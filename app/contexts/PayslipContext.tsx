import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../utils/axios';
import { API_URL } from '@/constants/constants';

type SalaryTypeDTO = {
	salaryTypeCode: string;
	salaryTypeName: string;
};

type PayrollGenerationDetDTO = {
	salaryTypeDTO: SalaryTypeDTO;
	addAmount?: number;
	dedAmount?: number;
};

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
	payrollGenerationDetDTOList?: PayrollGenerationDetDTO[];
	// Add other payslip fields as needed
};

interface PayslipContextType {
	payslips: Payslip[] | null;
	payslipDetails: Payslip | null;
	isLoading: boolean;
	error: string | null;
	fetchPayslips: () => Promise<void>;
	fetchPayslipDetails: (id: string) => Promise<void>;
	resetPayslipDetails: () => void;
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
			const url = `${API_URL}api/PayrollGeneration/GetPaySlipList`;
			const response = await axiosInstance.post(url, {
				employeeId: profileInfo.employeeID,
			});
			const result = response?.data?.result;
			if (result?.length) {
				setPayslips(result);
			}
		} catch (err) {
			setError('Failed to fetch payslip data');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchPayslipDetails = async (paySlipId: string) => {
		if (!paySlipId) return;

		setIsLoading(true);
		try {
			const url = `${API_URL}api/PayrollGeneration/GetPayslipDetail?id=${paySlipId}`;
			const response = await axiosInstance.get(url);
			if (response.data.status === 200) {
				const details = response.data.result;
				setPayslipDetails(details);
			}
		} catch (error) {
			console.error('Error fetching payslip details:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const resetPayslipDetails = () => {
		setPayslipDetails(null);
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
				resetPayslipDetails,
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
