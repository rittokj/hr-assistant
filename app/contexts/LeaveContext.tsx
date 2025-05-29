import { createContext, useContext, useEffect, useState } from 'react';

import { axiosInstance } from '../utils/axios';
import { useAuth } from './AuthContext';
import { API_URL } from '@/constants/constants';
import { Toast } from 'toastify-react-native';

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
	isLoadingDetails: boolean;
	isRecenteaveRequestsLoading: boolean;
	leaveTypesList: Leave[];
	selectedLeaveDetails: Leave;
	leaveRequests: LeaveRequest[];
	recentLeaveRequests: LeaveRequest[];
	selectedLeaveRequest: LeaveRequest | null;
	setSelectedLeave: (leave: Leave) => Promise<void>;
	setSelectedLeaveRequest: (leave: LeaveRequest) => void;
	checkLeaveAvailability: (
		employeeId: string,
		leaveTypeId: string
	) => Promise<void>;
	getLeaveRequests: (params: PaginationParams) => Promise<void>;
	getLeaveRequestById: (id: number) => Promise<void>;
	cancelLeaveRequestById: (id: number) => Promise<void>;
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
	const { isAuthenticated, profileInfo } = useAuth();
	const [isRecenteaveRequestsLoading, setRecentLeaveRequestsLoading] =
		useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [leaveTypesList, setLeaveTypesList] = useState<Leave[]>([]);
	const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
	const [recentLeaveRequests, setRecentLeaveRequests] = useState<
		LeaveRequest[]
	>([]);
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
			getRecentLeaveRequests({
				employeeId: profileInfo.employeeID,
			});
		}
	}, [isAuthenticated]);

	const getLeaveTypesList = async () => {
		try {
			setIsLoading(true);
			const response = await axiosInstance.get(`${API_URL}api/LeaveType/List`);
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
				`${API_URL}api/LeaveRequest/List/Pagination`,
				params
			);
			if (response.data.status == 200) setLeaveRequests(response.data.result);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getLeaveRequestById = async (id: number) => {
		setIsLoadingDetails(true);
		try {
			const response = await axiosInstance.get(
				`${API_URL}api/LeaveRequest/Detail?id=${id}`
			);

			if (response.data.status == 200) {
				const list = [...leaveRequests];
				const index = list.findIndex((i) => i.employeeLeaveRequestId === id);
				if (index > -1) list[index] = response.data.result;
				setLeaveRequests(list);
				handleSetSelectedLeaveRequest(response.data.result);
			}
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingDetails(false);
		}
	};

	const cancelLeaveRequestById = (id: number) => {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axiosInstance.post(
					`${API_URL}api/LeaveRequest/CancelLeaveRequest`,
					{
						wfStateActionConfigId: null,
						wfStateConfigId: null,
						actionNotes: 'Cancelled',
						employeeLeaveRequestId: id,
					}
				);
				if (response.data.status === 200) {
					getLeaveRequestById(id);
					resolve(true);
				} else
					reject({
						message: 'Something went wrong! Please try after sometime.',
					});
			} catch (error) {
				reject(error);
			}
		});
	};

	const getRecentLeaveRequests = async (params: PaginationParams) => {
		try {
			setRecentLeaveRequestsLoading(true);
			const response = await axiosInstance.post(
				`${API_URL}api/LeaveRequest/GetPendingLeaveRequest`,
				params
			);
			if (response?.data?.status == 200) {
				setRecentLeaveRequests(
					response?.data?.resultCount ? response.data.result : []
				);
			} else setRecentLeaveRequests([]);
		} catch (error) {
			throw error;
		} finally {
			setRecentLeaveRequestsLoading(false);
		}
	};

	const applyLeave = async (params: PaginationParams) => {
		try {
			const response = await axiosInstance.post(
				`${API_URL}api/LeaveRequest/Create`,
				params
			);
			return response;
		} catch (error) {
			throw error;
		} finally {
		}
	};

	const checkLeaveAvailability = async (
		employeeId: string,
		leaveTypeId: string
	) => {
		try {
			return await axiosInstance.get(
				`${API_URL}api/LeaveRequest/CheckEmployeeLeaveAvailability?employeeId=${employeeId}&leaveTypeId=${leaveTypeId}`
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
				isLoadingDetails,
				isRecenteaveRequestsLoading,
				leaveTypesList,
				selectedLeaveDetails,
				leaveRequests,
				recentLeaveRequests,
				selectedLeaveRequest,
				checkLeaveAvailability,
				applyLeave,
				setSelectedLeave,
				setSelectedLeaveRequest: handleSetSelectedLeaveRequest,
				getLeaveRequests,
				getLeaveRequestById,
				cancelLeaveRequestById,
			}}>
			{children}
		</LeaveContext.Provider>
	);
};
