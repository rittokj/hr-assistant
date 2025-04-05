import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';

import { useAuth } from './AuthContext';
import { axiosInstance } from '../utils/axios';

type AttendanceData = {
	date: string;
	checkIn: string;
	checkOut: string;
	totalHours: string;
	status: 'present' | 'absent' | 'leave';
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
	EmployeeId: number;
	AttendanceDate: string;
	TotalHour: null;
	IsManual: boolean;
	AttendanceDetDTOList: AttendanceDetDTO[];
}

interface AttendanceContextType {
	months: MonthData[];
	selectedMonth: MonthData;
	setSelectedMonth: (month: MonthData) => void;
	attendanceList: AttendanceData[];
	isLoading: boolean;
	summary: AttendanceSummary;
	markAttendance: (typeId: number) => Promise<any>;
	fetchAttendanceData: () => Promise<any>;
	currentDayAttendance: {
		checkIn: string | null;
		checkOut: string | null;
	};
	weeklyAttendance: AttendanceData[];
	fetchCurrentDayAttendance: () => Promise<void>;
	fetchWeeklyAttendance: () => Promise<void>;
	isCurrentDayLoading: boolean;
	isWeeklyLoading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
	undefined
);

export function AttendanceProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { tokens } = useAuth();
	const [selectedMonth, setSelectedMonth] = useState<MonthData>({
		id: '',
		label: '',
		value: '',
		month: null,
		year: null,
	});
	const [attendanceList, setAttendanceList] = useState<AttendanceData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCurrentDayLoading, setIsCurrentDayLoading] = useState(false);
	const [isWeeklyLoading, setIsWeeklyLoading] = useState(false);
	const [summary, setSummary] = useState<AttendanceSummary>({
		totalAttendance: 0,
		totalLeaves: 0,
		totalWorkingHours: 0,
	});
	const [currentDayAttendance, setCurrentDayAttendance] = useState<{
		checkIn: string | null;
		checkOut: string | null;
	}>({
		checkIn: null,
		checkOut: null,
	});
	const [weeklyAttendance, setWeeklyAttendance] = useState<AttendanceData[]>(
		[]
	);

	const getLastTwelveMonths = () => {
		const months = [];
		const currentDate = new Date();

		for (let i = 0; i < 12; i++) {
			const date = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() - i,
				1
			);
			const monthName = date.toLocaleString('default', { month: 'long' });
			const year = date.toLocaleString('default', { year: 'numeric' });
			const month = date.toLocaleString('default', { month: 'numeric' });
			const monthYear = date.toLocaleString('default', {
				month: 'long',
				year: 'numeric',
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
		if (!selectedMonth.id || !tokens?.employeeId) return;
		setAttendanceList([]);

		setIsLoading(true);
		try {
			const response = await axiosInstance.post(
				'api/Attendance/GetEmployeeAttDetailByMonth',
				{
					offset: 0,
					limit: 10,
					search: '',
					employeeId: tokens?.employeeId,
					departmentId: 0,
					year: selectedMonth.year,
					month: selectedMonth.month,
				}
			);
			const { result } = response.data;
			setAttendanceList(result[0].attendanceMonthDetail || []);
			setSummary({
				totalAttendance: result[0].totalAttendance || 0,
				totalLeaves: result[0].totalLeaves || 0,
				totalWorkingHours: result[0].totalWorkingHours || 0,
			});
		} catch (error) {
			console.error('Error fetching attendance data:', error);
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

	const markAttendance = async (typeId: number) => {
		setIsLoading(true);
		try {
			const currentDate = moment().format('YYYY-MM-DD');
			const currentTime = moment().format('HH:mm:ss');

			const payload: AttendancePayload = {
				AttendanceId: 0,
				EmployeeId: tokens?.employeeId, // This should come from user context or props
				AttendanceDate: currentDate,
				TotalHour: null,
				IsManual: true,
				AttendanceDetDTOList: [
					{
						AttendanceDetId: 0,
						AttendanceId: 0,
						TypeId: typeId,
						AttendanceTime: currentTime,
					},
				],
			};

			const response = await axiosInstance.post(
				'/api/Attendance/SaveEmployeeAttByDate',
				payload
			);
			return response.data;
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const fetchCurrentDayAttendance = async () => {
		if (!tokens?.employeeId) return;
		setIsCurrentDayLoading(true);
		try {
			const currentDate = moment().format('MM/DD/YYYY');
			const response = await axiosInstance.get(
				'api/Attendance/GetEmployeeAttByDate',
				{
					params: {
						employeeId: tokens.employeeId,
						attDate: currentDate,
					},
				}
			);
			const { result } = response.data;
			if (result && result.length > 0) {
				const attendance = result[0];
				setCurrentDayAttendance({
					checkIn: attendance.checkIn || null,
					checkOut: attendance.checkOut || null,
				});
			}
		} catch (error) {
			console.error('Error fetching current day attendance:', error);
		} finally {
			setIsCurrentDayLoading(false);
		}
	};

	const fetchWeeklyAttendance = async () => {
		if (!tokens?.employeeId) return;
		setIsWeeklyLoading(true);
		try {
			const startDate = moment().startOf('week').format('MM/DD/YYYY');
			const endDate = moment().endOf('week').format('MM/DD/YYYY');
			const response = await axiosInstance.post(
				'api/Attendance/GetEmployeeAttDetailByMonth',
				{
					offset: 0,
					limit: 7,
					search: '',
					employeeId: tokens.employeeId,
					departmentId: 0,
					startDate,
					endDate,
				}
			);
			const { result } = response.data;
			if (result && result.length > 0) {
				setWeeklyAttendance(result[0].attendanceMonthDetail || []);
			}
		} catch (error) {
			console.error('Error fetching weekly attendance:', error);
		} finally {
			setIsWeeklyLoading(false);
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
				fetchWeeklyAttendance,
				isCurrentDayLoading,
				isWeeklyLoading,
			}}>
			{children}
		</AttendanceContext.Provider>
	);
}

export const useAttendance = () => {
	const context = useContext(AttendanceContext);
	if (context === undefined) {
		throw new Error('useAttendance must be used within an AttendanceProvider');
	}
	return context;
};
