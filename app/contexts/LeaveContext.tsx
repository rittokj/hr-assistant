import { createContext, useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axios';
import { useAuth } from './AuthContext';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type Leave = {
	id: number;
	// add other leave properties you need
};

type LeaveContextType = {
	isLoading: boolean;
	leaveTypesList: Leave[];
	selectedLeaveDetails: Leave;
	setSelectedLeave: (leave: Leave) => Promise<void>;
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
	const [selectedLeaveDetails, setSelectedLeaveDetails] = useState<Leave>({
		id: 0,
	});

	useEffect(() => {
		if (isAuthenticated) getLeaveTypesList();
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

	const setSelectedLeave = async (leave: Leave) => {
		try {
			setSelectedLeaveDetails({ ...leave });
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	};

	return (
		<LeaveContext.Provider
			value={{
				isLoading,
				leaveTypesList,
				selectedLeaveDetails,
				setSelectedLeave,
			}}>
			{children}
		</LeaveContext.Provider>
	);
};
