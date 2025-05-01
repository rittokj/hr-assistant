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
	pkValue: string;
	payrollMonth: number;
	payrollYear: string;
	totalAmount: string;
	// Add other payslip fields as needed
};

interface PayslipContextType {
	payslips: Payslip[] | null;
	payslipDetails: Payslip | null;
	isLoading: boolean;
	error: string | null;
	fetchPayslips: () => Promise<void>;
	fetchPayslipDetails: (pkValue: string) => Promise<void>;
}

const PayslipContext = createContext<PayslipContextType | undefined>(undefined);

export function PayslipProvider({ children }: { children: React.ReactNode }) {
	const { profileInfo } = useAuth();
	const [payslips, setPayslips] = useState<Payslip[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [payslipDetails, setPayslipDetails] = useState<Payslip | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchPayslips = async () => {
		if (!profileInfo || !('employeeID' in profileInfo)) return;

		setIsLoading(true);
		setError(null);

		try {
			const url = `${API_URL}api/PayrollGeneration/GetPayrollGenerationDetailByMonth`;
			const response = await axiosInstance.post(
				url,
				JSON.stringify({
					search: '',
					employeeId: profileInfo.employeeID,
					departmentId: null,
					year: '2025',
					month: '03',
					isApprove: 1,
				})
			);

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

	const fetchPayslipDetails = async (pkValue: string) => {
		if (!pkValue) return;

		setIsLoading(true);
		try {
			const response = await axiosInstance.get(
				// `${API_URL}PayrollGeneration/GetDetail?pkValue=${pkValue}`
				`https://stg.accorelab.com/PayrollGeneration/GetDetail?pkValue=3259&%22%22&_=1745345976793`
			);
			console.log('response', JSON.stringify(response));
			if (response.data.status === 200) {
				const details = response.data.result.map((item: any) => ({
					type: item.type,
					addition: item.addition || 0,
					deduction: item.deduction || 0,
				}));
				setPayslipDetails(details);
			}
		} catch (error) {
			console.error('Error fetching payslip details:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PayslipContext.Provider
			value={{
				payslips,
				payslipDetails,
				isLoading,
				error,
				fetchPayslips,
				fetchPayslipDetails,
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
