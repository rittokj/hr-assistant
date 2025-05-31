import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { API_URL } from "@/constants/constants";
import { useAuth } from "./AuthContext";

type Memo = {
  memoId: number;
  memoCode: string;
  memoTitle: string;
  memoDescription: string;
  memoDate: string;
  memoStatus: string;
  employeeId: number;
  employeeName: string;
  memoDTO: {
    memoId: number;
    subject: string;
    memoText: string;
  };
};

type Warning = {
  warningId: number;
  warningCode: string;
  warningTitle: string;
  warningDescription: string;
  warningDate: string;
  warningStatus: string;
  employeeId: number;
  employeeName: string;
  subject: string;
  warningMessage: string;
};

type ProfileContextType = {
  memos: Memo[];
  warnings: Warning[];
  isLoading: boolean;
  error: string | null;
  fetchMemos: () => Promise<void>;
  fetchWarnings: () => Promise<void>;
  resetProfileContext: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { profileInfo } = useAuth();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemos = async () => {
    if (!profileInfo?.employeeID) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}api/Memo/MemoListByEmployee?employeeId=${profileInfo.employeeID}`
      );

      if (response?.data?.result) {
        setMemos(response.data.result);
      } else {
        setMemos([]);
      }
    } catch (err) {
      setError("Failed to fetch memos");
      console.error("Error fetching memos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWarnings = async () => {
    if (!profileInfo?.employeeID) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}api/EmployeeWarning/WarningListByEmployee?employeeId=${profileInfo.employeeID}`
      );

      if (response?.data?.result) {
        setWarnings(response.data.result);
      } else {
        setWarnings([]);
      }
    } catch (err) {
      setError("Failed to fetch warnings");
      console.error("Error fetching warnings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetProfileContext = () => {
    setMemos([]);
    setWarnings([]);
    setError(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        memos,
        warnings,
        isLoading,
        error,
        fetchMemos,
        fetchWarnings,
        resetProfileContext,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};
