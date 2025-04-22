import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../utils/axios';
import { API_URL } from '@/constants/constants';

type Payslip = {
	id: number;
	employeeId: number;
	month: string;
	year: string;
	basicSalary: number;
	allowances: number;
	deductions: number;
	netSalary: number;
	// Add other payslip fields as needed
};

interface PayslipContextType {
	payslips: Payslip | null;
	isLoading: boolean;
	error: string | null;
	fetchPayslips: () => Promise<void>;
}

const PayslipContext = createContext<PayslipContextType | undefined>(undefined);

export function PayslipProvider({ children }: { children: React.ReactNode }) {
	const { profileInfo } = useAuth();
	const [payslips, setPayslips] = useState<Payslip | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPayslips = async () => {
		if (!profileInfo?.employeeID) return;

		setIsLoading(true);
		setError(null);

		try {
			const url = `${API_URL}api/PayrollGeneration/GetPayrollGenerationDetailByMonth`;
			const response = await axiosInstance.post(
				url,
				JSON.stringify({
					search: '',
					employeeId: 3072,
					departmentId: null,
					year: '2025',
					month: '03',
					isApprove: 1,
				})
			);
			console.log('response', JSON.stringify(response));

			if (response.data.result) {
				setPayslips(response.data.result);
			}
		} catch (err) {
			setError('Failed to fetch payslip data');
			console.error('Error fetching payslip:', JSON.stringify(err));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PayslipContext.Provider
			value={{
				payslips,
				isLoading,
				error,
				fetchPayslips,
			}}>
			{children}
		</PayslipContext.Provider>
	);
}

export const usePayslip = () => {
	const context = useContext(PayslipContext);
	if (context === undefined) {
		throw new Error('usePayslip must be used within a PayslipProvider');
	}
	return context;
};
