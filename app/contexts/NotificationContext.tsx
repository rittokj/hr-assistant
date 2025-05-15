import { createContext, useContext, useState } from 'react';

import { axiosInstance } from '../utils/axios';
import { API_URL } from '@/constants/constants';

interface Notification {
	id: string;
	message: string;
	timestamp: string;
}

type NotificationContextType = {
	isNotificationsLoading: boolean;
	notifications: Notification[];
	getNotifications: (page?: number) => Promise<void>;
	hasMore: boolean;
	currentPage: number;
};

export const NotificationContext =
	createContext<NotificationContextType | null>(null);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotification must be used within an NotificationProvider'
		);
	}
	return context;
};

export const NotificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const getNotifications = async (page: number = 1) => {
		try {
			setIsNotificationsLoading(true);
			const response = await axiosInstance.get(
				`${API_URL}api/NotificationLog/GetUnReadNotificationByUser?type=5400001&page=${page}&pageSize=10`
			);
			const newNotifications = response?.data?.result || [];

			if (page === 1) {
				setNotifications(newNotifications);
			} else {
				setNotifications((prev) => [...prev, ...newNotifications]);
			}

			setHasMore(newNotifications.length === 10);
			setCurrentPage(page);
		} catch (error) {
			console.error('Error fetching notifications:', error);
			throw error;
		} finally {
			setIsNotificationsLoading(false);
		}
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				isNotificationsLoading,
				getNotifications,
				hasMore,
				currentPage,
			}}>
			{children}
		</NotificationContext.Provider>
	);
};
