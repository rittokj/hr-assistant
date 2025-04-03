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
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
	undefined
);

export function AttendanceProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { tokens, profileInfo } = useAuth();
	const [selectedMonth, setSelectedMonth] = useState<MonthData>({
		id: '',
		label: '',
		value: '',
	});
	const [attendanceList, setAttendanceList] = useState<AttendanceData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [summary, setSummary] = useState<AttendanceSummary>({
		totalAttendance: 0,
		totalLeaves: 0,
		totalWorkingHours: 0,
	});

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
			const monthYear = date.toLocaleString('default', {
				month: 'long',
				year: 'numeric',
			});

			months.push({
				id: (i + 1).toString(),
				label: monthYear,
				value: monthName,
			});
		}

		return months;
	};

	const months = getLastTwelveMonths();

	useEffect(() => {
		if (!selectedMonth.id && months.length > 0) {
			setSelectedMonth(months[0]);
		}
	}, [months]);

	useEffect(() => {
		const fetchAttendanceData = async () => {
			if (!selectedMonth.id || !profileInfo?.userId) return;

			setIsLoading(true);
			try {
				const { data } = await axiosInstance.post(
					'api/Attendance/GetEmployeeAttDetailByMonth',
					{
						offset: 0,
						limit: 10,
						search: '',
						employeeId: 0,
						departmentId: 0,
						year: 2025,
						month: 4,
					}
				);

				setAttendanceList(data.attendanceList || []);
				setSummary({
					totalAttendance: data.totalAttendance || 0,
					totalLeaves: data.totalLeaves || 0,
					totalWorkingHours: data.totalWorkingHours || 0,
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

		fetchAttendanceData();
	}, [selectedMonth, , profileInfo]);

	const markAttendance = async (typeId: number) => {
		setIsLoading(true);
		try {
			const currentDate = moment().format('YYYY-MM-DD');
			const currentTime = moment().format('HH:mm:ss');

			const payload: AttendancePayload = {
				AttendanceId: 0,
				EmployeeId: profileInfo?.userId, // This should come from user context or props
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

	return (
		<AttendanceContext.Provider
			value={{
				months,
				selectedMonth,
				setSelectedMonth,
				attendanceList,
				isLoading,
				summary,
				markAttendance,
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
