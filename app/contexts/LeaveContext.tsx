import { createContext, useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants';

import { axiosInstance } from '../utils/axios';
import { useAuth } from './AuthContext';

const BASE_URL = Constants.expoConfig?.extra.API_URL;

type Leave = {
	id: number;
	// add other leave properties you need
};

type LeaveRequest = {
	id: number;
	leaveTypeDTO: {
		leaveTypeName: string;
	};
	leaveFromDate: string;
	leaveToDate: string;
	status: string;
	reason?: string;
};

type PaginationParams = {
	offset: number;
	limit: number;
	search: string;
	isExpired: number;
	filterList: Array<{
		whereString: string;
		attributeName: string;
		attributeValue: string;
		attributeSecondValue: string;
		attributeDataType: number;
		operator: number;
		condition: number;
	}>;
};

type LeaveContextType = {
	isLoading: boolean;
	leaveTypesList: Leave[];
	selectedLeaveDetails: Leave;
	leaveRequests: LeaveRequest[];
	selectedLeaveRequest: LeaveRequest | null;
	setSelectedLeave: (leave: Leave) => Promise<void>;
	setSelectedLeaveRequest: (leave: LeaveRequest) => void;
	checkLeaveAvailability: (
		employeeId: string,
		leaveTypeId: string
	) => Promise<void>;
	getLeaveRequests: (params: PaginationParams) => Promise<void>;
	applyLeave: (params: PaginationParams) => Promise<void>;
};

export const LeaveContext = createContext<LeaveContextType | null>(null);

export const useLeaves = () => {
	const context = useContext(LeaveContext);
	if (!context) {
		throw new Error('useLeaves must be used within an LeavesProvider');
	}
	return context;
};

export const LeaveProvider = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [leaveTypesList, setLeaveTypesList] = useState<Leave[]>([]);
	const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
	const [selectedLeaveDetails, setSelectedLeaveDetails] = useState<Leave>({
		id: 0,
	});
	const [selectedLeaveRequest, setSelectedLeaveRequest] =
		useState<LeaveRequest | null>(null);

	useEffect(() => {
		if (isAuthenticated) {
			getLeaveTypesList();
			getLeaveRequests({
				offset: 0,
				limit: 10,
				search: '',
				isExpired: 0,
				filterList: [],
			});
		}
	}, [isAuthenticated]);

	const getLeaveTypesList = async () => {
		try {
			setIsLoading(true);
			const response = await axiosInstance.get(`${BASE_URL}api/LeaveType/List`);
			if (response.data.status == 200) setLeaveTypesList(response.data.result);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getLeaveRequests = async (params: PaginationParams) => {
		try {
			setIsLoading(true);
			const response = await axiosInstance.post(
				`${BASE_URL}api/LeaveRequest/List/Pagination`,
				params
			);
			if (response.data.status == 200) setLeaveRequests(response.data.result);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const applyLeave = async (params: PaginationParams) => {
		try {
			const response = await axiosInstance.post(
				`${BASE_URL}api/LeaveRequest/Create`,
				params
			);
			return response;
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const checkLeaveAvailability = async (
		employeeId: string,
		leaveTypeId: string
	) => {
		try {
			return await axiosInstance.get(
				`${BASE_URL}api/LeaveRequest/CheckEmployeeLeaveAvailability?employeeId=${employeeId}&leaveTypeId=${leaveTypeId}`
			);
		} catch (error) {
			throw error;
		}
	};

	const setSelectedLeave = async (leave: Leave) => {
		try {
			setSelectedLeaveDetails({ ...leave });
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	};

	const handleSetSelectedLeaveRequest = (leave: LeaveRequest) => {
		setSelectedLeaveRequest(leave);
	};

	return (
		<LeaveContext.Provider
			value={{
				isLoading,
				leaveTypesList,
				selectedLeaveDetails,
				leaveRequests,
				selectedLeaveRequest,
				checkLeaveAvailability,
				applyLeave,
				setSelectedLeave,
				setSelectedLeaveRequest: handleSetSelectedLeaveRequest,
				getLeaveRequests,
			}}>
			{children}
		</LeaveContext.Provider>
	);
};
