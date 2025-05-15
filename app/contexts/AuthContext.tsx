import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { axiosInstance } from '../utils/axios';
import { API_URL } from '@/constants/constants';

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
	isAuthenticated: boolean;
	profileInfo: ProfileInfo | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	getProfileInfo: (
		userId: string,
		callback1: any,
		callback2: any
	) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [tokens, setTokens] = useState<AuthTokens>({
		accessToken: null,
		refreshToken: null,
		employeeId: null,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

	useEffect(() => {
		loadTokens();
	}, []);

	const loadTokens = async () => {
		try {
			// AsyncStorage.removeItem('accessToken');
			// AsyncStorage.removeItem('refreshToken');
			// AsyncStorage.removeItem('employeeId');
			const [accessToken, refreshToken, employeeId] = await Promise.all([
				AsyncStorage.getItem('accessToken'),
				AsyncStorage.getItem('refreshToken'),
				AsyncStorage.getItem('employeeId'),
			]);
			if (accessToken && refreshToken && employeeId) {
				setTokens({
					accessToken,
					refreshToken,
					employeeId,
				});
				getProfileInfo(employeeId, null, null);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (userName: string, password: string): Promise<void> => {
		try {
			return new Promise((resolve, reject) => {
				axiosInstance
					.post(`${API_URL}api/Authenticate/Token`, {
						userName,
						password,
						refreshToken: '',
					})
					.then((response) => {
						if (response?.data?.result?.user?.employeeId) {
							const { tokenModel, user } = response?.data?.result;
							Promise.all([
								AsyncStorage.setItem('accessToken', tokenModel.token),
								AsyncStorage.setItem('refreshToken', tokenModel.refreshToken),
								AsyncStorage.setItem('employeeId', `${user.employeeId}`),
							]);
							setTokens({
								accessToken: tokenModel.token,
								refreshToken: tokenModel.refreshToken,
								employeeId: user.employeeId,
							});
							getProfileInfo(
								user.employeeId,
								() => resolve(),
								() => reject()
							);
						} else reject('No response');
					})
					.catch((err) => {
						reject(err);
					});
			});
		} catch (error) {
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
			throw error;
		}
	};

	const logout = async () => {
		try {
			await AsyncStorage.multiRemove([
				'accessToken',
				'refreshToken',
				'employeeId',
			]);
			setProfileInfo(null);
			setTokens({ accessToken: null, refreshToken: null, employeeId: null });
		} catch (error) {
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				tokens,
				profileInfo,
				isLoading,
				isAuthenticated: Boolean(profileInfo?.employeeID),
				login,
				logout,
				getProfileInfo,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
