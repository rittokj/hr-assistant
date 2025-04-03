import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../utils/axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type AuthTokens = {
	accessToken: string | null;
	refreshToken: string | null;
	employeeId: string | null;
};

type AuthContextType = {
	tokens: AuthTokens;
	isLoading: boolean;
	isAuthenticated: boolean;
	profileInfo: object | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
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
	const [profileInfo, setProfileInfo] = useState(null);

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
			setTokens({
				accessToken,
				refreshToken,
				employeeId,
			});
			if (employeeId) getProfileInfo(employeeId);
		} catch (error) {
			console.error('Error loading tokens:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (userName: string, password: string) => {
		try {
			const response = await axiosInstance.post(
				`${BASE_URL}api/Authenticate/Token`,
				{
					userName,
					password,
					refreshToken: '',
				}
			);
			const accessToken = response?.data?.result?.tokenModel?.token;
			const refreshToken = response?.data?.result?.tokenModel?.refreshToken;
			const employeeId = response?.data?.result?.user?.employeeId;
			await Promise.all([
				AsyncStorage.setItem('accessToken', accessToken),
				AsyncStorage.setItem('refreshToken', refreshToken),
				AsyncStorage.setItem('employeeId', `${employeeId}`),
			]);
			if (employeeId) getProfileInfo(employeeId);

			setTokens({
				accessToken,
				refreshToken,
				employeeId,
			});
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	};

	const getProfileInfo = async (userId: string) => {
		try {
			const response = await axiosInstance.get(
				`${BASE_URL}api/Employee/Detail?id=${parseInt(userId)}`
			);
			setProfileInfo(response?.data?.result);
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
			setTokens({ accessToken: null, refreshToken: null });
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				tokens,
				profileInfo,
				isLoading,
				isAuthenticated: !!tokens.accessToken,
				login,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
