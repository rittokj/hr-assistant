import React, { createContext, useContext, useState, useEffect } from "react";
import moment from "moment";

import { useAuth } from "./AuthContext";
import { axiosInstance } from "../utils/axios";

type Attendance = {
  time: string;
  division: string;
  id: number;
};

type AttendanceData = {
  date: string;
  checkIn: Attendance;
  checkOut: Attendance;
  totalHours: string;
  status: "present" | "absent" | "leave";
};

type MonthData = {
  id: string;
  label: string;
  value: string;
  month: number | null;
  year: number | null;
};

type AttendanceSummary = {
  totalAttendance: number;
  totalLeaves: number;
  totalWorkingHours: number;
};

interface AttendanceDetDTO {
  AttendanceDetId: number;
  AttendanceId: number;
  TypeId: number;
  AttendanceTime: string;
}

interface AttendancePayload {
  AttendanceId: number;
  EmployeeId: number | string;
  AttendanceDate: string;
  TotalHour: null;
  IsManual: boolean;
  AttendanceSourceTypeCd: number;
  AttendanceDetDTOList: AttendanceDetDTO[];
}

interface AttendanceContextType {
  months: MonthData[];
  selectedMonth: MonthData;
  setSelectedMonth: (month: MonthData) => void;
  attendanceList: AttendanceData[];
  isLoading: boolean;
  summary: AttendanceSummary;
  markAttendance: (typeId: number, id: number) => Promise<any>;
  fetchAttendanceData: () => Promise<any>;
  currentDayAttendance: {
    checkIn: Attendance;
    checkOut: Attendance;
  };
  weeklyAttendance: any;
  fetchCurrentDayAttendance: () => Promise<void>;
  fetchCurrentWeekAttendance: () => Promise<void>;
  isCurrentDayLoading: boolean;
  isCurrentWeekLoading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export function AttendanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileInfo } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<MonthData>({
    id: "",
    label: "",
    value: "",
    month: null,
    year: null,
  });
  const [attendanceList, setAttendanceList] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentDayLoading, setIsCurrentDayLoading] = useState(false);
  const [isCurrentWeekLoading, setIsCurrentWeekLoading] = useState(false);
  const [summary, setSummary] = useState<AttendanceSummary>({
    totalAttendance: 0,
    totalLeaves: 0,
    totalWorkingHours: 0,
  });
  const [currentDayAttendance, setCurrentDayAttendance] = useState<{
    checkIn: Attendance;
    checkOut: Attendance;
  }>({
    checkIn: { time: "", division: "", id: 0 },
    checkOut: { time: "", division: "", id: 0 },
  });
  const [weeklyAttendance, setWeeklyAttendance] = useState(null);

  const getLastTwelveMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleString("default", { month: "long" });
      const year = date.toLocaleString("default", { year: "numeric" });
      const month = date.toLocaleString("default", { month: "numeric" });
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      months.push({
        id: (i + 1).toString(),
        label: monthYear,
        value: monthName,
        month: parseInt(month),
        year: parseInt(year),
      });
    }

    return months;
  };

  const months = getLastTwelveMonths();

  useEffect(() => {
    if (!selectedMonth.id && months.length > 0) {
      setSelectedMonth({ ...months[0], metaData: months[0] });
    }
  }, [months]);

  const fetchAttendanceData = async () => {
    if (!selectedMonth.id || !profileInfo?.employeeID) return;
    setAttendanceList([]);

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "api/Attendance/GetEmployeeAttDetailByMonth",
        {
          offset: 0,
          limit: 10,
          search: "",
          employeeId: profileInfo?.employeeID,
          departmentId: 0,
          year: selectedMonth.year,
          month: selectedMonth.month,
        }
      );
      const { result } = response.data;
      setAttendanceList(result[0].attendanceMonthDetail || []);
      setSummary({
        totalAttendance: result[0].presentDays || 0,
        totalLeaves: result[0].absentDays || 0,
        totalWorkingHours: result[0].monthlyTotalHour || 0,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      // Reset data on error
      setAttendanceList([]);
      setSummary({
        totalAttendance: 0,
        totalLeaves: 0,
        totalWorkingHours: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAttendance = async (typeId: number, id: number) => {
    setIsLoading(true);
    try {
      const currentDate = moment().format("YYYY-MM-DD");
      const currentTime = moment().format("HH:mm:ss");
      const payload: AttendancePayload = {
        AttendanceId: id || 0,
        EmployeeId: profileInfo?.employeeID || "", // This should come from user context or props
        AttendanceDate: currentDate,
        TotalHour: null,
        IsManual: true,
        AttendanceSourceTypeCd: 6700002,
        AttendanceDetDTOList: [
          {
            AttendanceDetId: 0,
            AttendanceId: id || 0,
            TypeId: typeId,
            AttendanceTime: currentTime,
          },
        ],
      };

      const response = await axiosInstance.post(
        "/api/Attendance/SaveEmployeeAttByDate",
        payload
      );

      await fetchCurrentDayAttendance();
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentDayAttendance = async () => {
    if (!profileInfo?.employeeID) return;
    setIsCurrentDayLoading(true);
    try {
      const currentDate = moment().format("MM/DD/YYYY");
      const response = await axiosInstance.get(
        `api/Attendance/GetEmployeeAttByDate?employeeId=${profileInfo.employeeID}&attDate=${currentDate}`
      );
      const attList = response?.data?.result.attendanceDetDTOList;
      const checkIn = attList?.find((i) => i.typeId === 1);
      const checkOut = attList?.find((i) => i.typeId === 2);
      setCurrentDayAttendance({
        checkIn: {
          time: checkIn?.attendanceTime
            ? moment(checkIn.attendanceTime, "HH:mm:ss").format("hh.mm")
            : "",
          division: checkIn?.attendanceTime
            ? moment(checkIn.attendanceTime, "HH:mm:ss").format("A")
            : "--",
          id: checkIn?.attendanceId,
        },
        checkOut: {
          time: checkOut?.attendanceTime
            ? moment(checkOut.attendanceTime, "HH:mm:ss").format("hh.mm")
            : "",
          division: checkOut?.attendanceTime
            ? moment(checkOut.attendanceTime, "HH:mm:ss").format("A")
            : "--",
          id: checkOut?.attendanceId || 0,
        },
      });
    } catch (error) {
    } finally {
      setIsCurrentDayLoading(false);
    }
  };

  const fetchCurrentWeekAttendance = async () => {
    if (!profileInfo?.employeeID) return;
    setIsCurrentWeekLoading(true);
    try {
      const response = await axiosInstance.post(
        `api/Attendance/GetEmployeeAttDetailByWeek`,
        {
          employeeId: profileInfo.employeeID,
        }
      );
      setWeeklyAttendance(response?.data?.result[0]);
    } catch (error) {
    } finally {
      setIsCurrentWeekLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        months,
        selectedMonth,
        setSelectedMonth,
        fetchAttendanceData,
        attendanceList,
        isLoading,
        summary,
        markAttendance,
        currentDayAttendance,
        weeklyAttendance,
        fetchCurrentDayAttendance,
        fetchCurrentWeekAttendance,
        isCurrentDayLoading,
        isCurrentWeekLoading,
      }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
