import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_KEY, API_URL } from '@/constants/constants';

export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'X-Api-Key': API_KEY,
		'Content-Type': 'application/json',
	},
});

if (Platform.OS === 'android') {
	axiosInstance.defaults.proxy = false;
}

// Request interceptor
axiosInstance.interceptors.request.use(
	async (config) => {
		const accessToken = await AsyncStorage.getItem('accessToken');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If error is 401 and we haven't tried to refresh token yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = await AsyncStorage.getItem('refreshToken');
				if (!refreshToken) {
					throw new Error('No refresh token found');
				}

				// Get new access token
				const response = await axios.post(`${API_URL}/refresh-token`, {
					refreshToken,
				});

				const { accessToken } = response.data;
				await AsyncStorage.setItem('accessToken', accessToken);

				// Retry original request with new token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh token fails, logout user
				await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
				throw refreshError;
			}
		}

		return Promise.reject(error);
	}
);
