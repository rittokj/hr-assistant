import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { axiosInstance } from "../utils/axios";
import { API_URL } from "@/constants/constants";
import { useLeaves } from "../contexts/LeaveContext";
import { useNotification } from "../contexts/NotificationContext";
import { useProfile } from "../contexts/ProfileContext";
import { usePayslip } from "../contexts/PayslipContext";
import { useAttendance } from "../contexts/AttendanceContext";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
  employeeId: string | null;
};

type ProfileInfo = {
  employeeID: string;
  employeeName?: string;
  profileImagePath?: string;
  designationDTO?: {
    designationName?: string;
  };
  genderCdNavigationDTO?: {
    lookUpName?: string;
  };
  dob?: string;
  emailId?: string;
  mobileNo?: string;
  joinDateText?: string;
  qualificationCdNavigationDTO?: {
    lookUpName?: string;
  };
  offerSignedDateText?: string;
  departmentDTO?: {
    departmentName?: string;
  };
  reportingTO?: string;
  sponsorName?: string;
  holiday?: string;
  employeeDocumentDTOList?: Array<{
    documentTypeDTO: {
      documentTypeCode: string;
      documentTypeName: string;
    };
    issueDateText?: string;
    expiryDateText?: string;
  }>;
  employeeSalaryDTOList?: Array<{
    totalSalary: string;
    dateFromText: string;
    version: string;
  }>;
};

type AuthContextType = {
  tokens: AuthTokens;
  isLoading: boolean;
  initialLoading: boolean;
  isAuthenticated: boolean;
  isProfileLoaded: boolean;
  profileInfo: ProfileInfo | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfileInfo: (
    userId: string,
    callback1: any,
    callback2: any
  ) => Promise<void>;
  setTokens: (tokens: AuthTokens) => void;
  setProfileInfo: (info: ProfileInfo | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<AuthTokens>({
    accessToken: null,
    refreshToken: null,
    employeeId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const setLoad = (val: any) => {
    setInitialLoading(val);
  };

  const loadTokens = async () => {
    try {
      const [accessToken, refreshToken, employeeId] = await Promise.all([
        AsyncStorage.getItem("accessToken"),
        AsyncStorage.getItem("refreshToken"),
        AsyncStorage.getItem("employeeId"),
      ]);
      if (accessToken && refreshToken && employeeId) {
        setTokens({
          accessToken,
          refreshToken,
          employeeId,
        });
        getProfileInfo(
          employeeId,
          () => {
            setLoad(false);
            setIsProfileLoaded(true);
          },
          () => {
            setLoad(false);
            setIsProfileLoaded(false);
          }
        );
      } else {
        setLoad(false);
        setIsProfileLoaded(false);
      }
    } catch (error) {
      setLoad(false);
      setIsProfileLoaded(false);
    }
  };

  const login = async (userName: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(`${API_URL}api/Authenticate/Token`, {
            userName,
            password,
            refreshToken: "",
          })
          .then(async (response) => {
            if (response?.data?.result?.user?.employeeId) {
              const { tokenModel, user } = response?.data?.result;
              await Promise.all([
                AsyncStorage.setItem("accessToken", tokenModel.token),
                AsyncStorage.setItem("refreshToken", tokenModel.refreshToken),
                AsyncStorage.setItem("employeeId", `${user.employeeId}`),
              ]);

              // Set tokens first
              setTokens({
                accessToken: tokenModel.token,
                refreshToken: tokenModel.refreshToken,
                employeeId: user.employeeId,
              });

              // Then get profile info
              getProfileInfo(
                user.employeeId,
                () => {
                  setIsProfileLoaded(true);
                  setIsLoading(false);
                  resolve();
                },
                () => {
                  setIsProfileLoaded(false);
                  setIsLoading(false);
                  reject();
                }
              );
            } else {
              setIsLoading(false);
              reject("No response");
            }
          })
          .catch((err) => {
            setIsLoading(false);
            reject(err);
          });
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const getProfileInfo = async (
    userId: string,
    callback1: any,
    callback2: any
  ) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}api/Employee/Detail?id=${parseInt(userId)}`
      );
      if (response?.data?.result) {
        setProfileInfo(response.data.result);
        if (callback1) callback1();
      } else {
        if (callback2) callback2();
      }
    } catch (error) {
      if (callback2) callback2();
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();

      // Reset auth state
      setProfileInfo(null);
      setTokens({ accessToken: null, refreshToken: null, employeeId: null });
      setIsProfileLoaded(false);
      setIsLoading(false);
      setInitialLoading(false);

      // Remove auth header
      delete axiosInstance.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        tokens,
        profileInfo,
        isLoading,
        initialLoading,
        isProfileLoaded,
        isAuthenticated: Boolean(profileInfo?.employeeID),
        login,
        logout,
        getProfileInfo,
        setTokens,
        setProfileInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
