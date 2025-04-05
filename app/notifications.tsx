import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	useColorScheme,
	ActivityIndicator,
} from 'react-native';
import { useNotification } from './contexts/NotificationContext';
import NotificationLoader from '@/components/NotificationLoader';

interface Notification {
	id: string;
	message: string;
	timestamp: string;
}

const NotificationsScreen = () => {
	const {
		isNotificationsLoading,
		getNotifications,
		notifications,
		hasMore,
		currentPage,
	} = useNotification();
	const colorScheme = useColorScheme();

	useEffect(() => {
		getNotifications(1);
	}, []);

	const loadMore = useCallback(() => {
		if (!isNotificationsLoading && hasMore) {
			getNotifications(currentPage + 1);
		}
	}, [isNotificationsLoading, hasMore, currentPage, getNotifications]);

	const renderItem = ({ item }: { item: Notification }) => (
		<ThemedView
			style={[
				styles.notificationItem,
				{ backgroundColor: colorScheme === 'dark' ? '#000' : '#eee' },
			]}>
			<ThemedText style={styles.message}>{item.message}</ThemedText>
			<ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
		</ThemedView>
	);

	const renderEmptyState = () => (
		<View style={styles.emptyState}>
			<ThemedText style={styles.emptyStateText}>
				No notifications yet
			</ThemedText>
		</View>
	);

	const renderFooter = () => {
		if (!isNotificationsLoading) return null;
		return (
			<View style={styles.footerLoader}>
				<ActivityIndicator
					size='small'
					color='#007AFF'
				/>
			</View>
		);
	};

	return (
		<ThemedView style={styles.container}>
			{currentPage === 1 && isNotificationsLoading ? (
				<NotificationLoader />
			) : (
				<FlatList<Notification>
					data={notifications}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					ListEmptyComponent={renderEmptyState}
					ListFooterComponent={renderFooter}
					onEndReached={loadMore}
					onEndReachedThreshold={0.5}
					contentContainerStyle={styles.listContent}
				/>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	notificationItem: {
		padding: 15,
		marginVertical: 5,
		borderRadius: 5,
	},
	message: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	timestamp: {
		fontSize: 12,
		color: '#666',
		marginTop: 5,
	},
	emptyState: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 60,
	},
	emptyStateText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	footerLoader: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	listContent: {
		flexGrow: 1,
	},
});

export default NotificationsScreen;
