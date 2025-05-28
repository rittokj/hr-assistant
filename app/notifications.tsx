import React, { useEffect, useCallback } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	useColorScheme,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import moment from 'moment';

import NotificationLoader from '@/components/NotificationLoader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { primaryColor } from '@/constants/Colors';
import { useNotification } from './contexts/NotificationContext';

interface Notification {
	notificationLogId: number;
	subject: string;
	notificationMessage: string;
	createDate: string;
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
	}, [isNotificationsLoading, hasMore, currentPage]);

	const renderItem = ({ item }: { item: Notification }) => (
		<TouchableOpacity key={item.notificationLogId}>
			<ThemedView
				style={[
					styles.notificationItem,
					{ borderColor: colorScheme === 'dark' ? '#000' : '#eee' },
				]}>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}>
					<View style={{ flex: 1, paddingRight: 10 }}>
						<ThemedText style={styles.messageTitle}>{item.subject}</ThemedText>
					</View>
					<ThemedText style={styles.message}>
						{moment(item.createDate).startOf('hour').fromNow()}
					</ThemedText>
				</View>
				<ThemedText style={styles.message}>
					{item.notificationMessage}
				</ThemedText>
			</ThemedView>
		</TouchableOpacity>
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
					color={primaryColor}
				/>
			</View>
		);
	};

	return (
		<ThemedView style={styles.container}>
			{currentPage === 1 && isNotificationsLoading ? (
				<NotificationLoader />
			) : (
				<FlatList
					data={notifications}
					keyExtractor={(item) => item.notificationLogId}
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
	},
	titleContainer: {
		margin: 20,
		fontSize: 16,
	},
	headerContainer: {
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerText: { fontWeight: '600', fontSize: 16 },
	closeButton: { padding: 10, backgroundColor: '#000', borderRadius: 20 },
	notificationItem: {
		padding: 20,
		marginVertical: 5,
		borderBottomWidth: 1,
	},
	messageTitle: {
		fontSize: 14,
		fontWeight: '500',
		lineHeight: 16,
		marginBottom: 10,
	},
	message: {
		lineHeight: 16,
		fontSize: 12,
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
