import React, { createContext, useContext, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { shareAsync } from "expo-sharing";
import moment from "moment";

import { useAuth } from "./AuthContext";
import { axiosInstance } from "../utils/axios";
import { API_URL } from "@/constants/constants";

type SalaryTypeDTO = {
  salaryTypeCode: string;
  salaryTypeName: string;
};

type PayrollGenerationDetDTO = {
  salaryTypeDTO: SalaryTypeDTO;
  addAmount?: number;
  dedAmount?: number;
};

type Payslip = {
  id: number;
  employeeId: number;
  month: string;
  year: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  pkValue: string;
  payrollMonth: number;
  payrollYear: string;
  totalAmount: string;
  payrollGenerationDetDTOList?: PayrollGenerationDetDTO[];
  // Add other payslip fields as needed
};

interface PayslipContextType {
  payslips: Payslip[] | null;
  payslipDetails: Payslip | null;
  isLoading: boolean;
  isDownloading: boolean;
  error: string | null;
  fetchPayslips: () => Promise<void>;
  fetchPayslipDetails: (id: string) => Promise<void>;
  resetPayslipDetails: () => void;
  downloadPayslip: (payrollGenerationId: string) => null;
}

const PayslipContext = createContext<PayslipContextType | undefined>(undefined);

export function PayslipProvider({ children }: { children: React.ReactNode }) {
  const { profileInfo } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [payslipDetails, setPayslipDetails] = useState<Payslip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPayslips = async () => {
    if (!profileInfo || !("employeeID" in profileInfo)) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `${API_URL}api/PayrollGeneration/GetPaySlipList`;
      const response = await axiosInstance.post(url, {
        employeeId: profileInfo.employeeID,
      });
      const result = response?.data?.result;
      if (result?.length) {
        setPayslips(result);
      }
    } catch (err) {
      setError("Failed to fetch payslip data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayslipDetails = async (paySlipId: string) => {
    if (!paySlipId) return;

    setIsLoading(true);
    try {
      const url = `${API_URL}api/PayrollGeneration/GetPayslipDetail?id=${paySlipId}`;
      const response = await axiosInstance.get(url);
      if (response.data.status === 200) {
        const details = response.data.result;
        setPayslipDetails(details);
      }
    } catch (error) {
      console.error("Error fetching payslip details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPayslipDetails = () => {
    setPayslipDetails(null);
  };

  const downloadPayslip = async (
    payrollGenerationId: string
  ): Promise<string> => {
    if (!payrollGenerationId) {
      throw new Error("Payroll generation ID is required");
    }

    setIsDownloading(true);
    try {
      // Fetch base64-encoded PDF from API
      const apiUrl = `${API_URL}api/PayrollGeneration/DownloadPayslip?payrollGenerationId=${payrollGenerationId}`;
      const response = await axiosInstance.get(apiUrl);

      const base64Data = response.data?.base64;
      const serverFileName = `PaySlip-${payslipDetails?.payrollYear}-${moment()
        .month(payslipDetails?.payrollMonth - 1)
        .format("MMMM")}`;
      const filename = `${serverFileName}.pdf`;

      if (!base64Data) {
        throw new Error("No PDF data received from server.");
      }

      // Save temp file in cache directory
      const tempUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(tempUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mimeType = "application/pdf";

      // Save to Android's shared storage or share fallback
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(tempUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            mimeType
          )
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, {
                encoding: FileSystem.EncodingType.Base64,
              });
            })
            .catch((e) => {
              console.error("Create file error:", e);
              throw new Error("Unable to create file");
            });
        } else {
          // Fallback: Share the file if permission denied
          await shareAsync(tempUri);
        }
      } else {
        // iOS: fallback to sharing the file
        await shareAsync(tempUri);
      }

      return tempUri;
    } catch (error: any) {
      console.error("Error downloading payslip:", error);
      throw new Error("Failed to download payslip");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PayslipContext.Provider
      value={{
        payslips,
        payslipDetails,
        isLoading,
        isDownloading,
        error,
        fetchPayslips,
        fetchPayslipDetails,
        resetPayslipDetails,
        downloadPayslip,
      }}>
      {children}
    </PayslipContext.Provider>
  );
}

export const usePayslip = () => {
  const context = useContext(PayslipContext);
  if (context === undefined) {
    throw new Error("usePayslip must be used within a PayslipProvider");
  }
  return context;
};
