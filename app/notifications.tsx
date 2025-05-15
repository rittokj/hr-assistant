import React, {
	useEffect,
	useCallback,
	useState,
	useMemo,
	useRef,
} from 'react';
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	useColorScheme,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { useNotification } from './contexts/NotificationContext';
import NotificationLoader from '@/components/NotificationLoader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CloseIcon from '@/assets/svgs/Close';

interface Notification {
	id: string;
	message: string;
	timestamp: string;
}

const notifications = [
	{
		notificationLogId: 27001,
		notificationMessage:
			'<p>Dear Team,</p>\n                <p>I would like to bring to your attention an important information regarding unemployment\n                insurance. It’s mandatory to enroll in the (ILOE), also known as Unemployment Insurance\n                Scheme, in time to avoid the fine amount of AED 400/-. All employees who are residing in\n                UAE on employment visa, after processing the emirates ID are individually responsible to\n                enroll in this insurance, company will not be liable for any employee insurance or the fine\n                amount due to the overdue.</p>\n                <p>Please follow the below guideline to apply ILOE insurance through a mobile device:</p>\n                <ul>\n                    <li>Download the ILOE App from Google Play Store.</li>\n                    <li>Create an account or log in if you already have one.</li>\n                    <li>Use the app’s search feature or navigate to the insurance section to find the ILOE\n                    insurance (i.e., annual, 12 months insurance for AED 63).</li>\n                    <li>Enter the required information for a quote, such as personal details, business\n                    information, and coverage needs.</li>\n                    <li>Proceed with the amount in the quote and pay via bank transfer.</li>\n                    <li>Review your application details and submit them. You may receive confirmation and\n                    further instructions via email or in-app notifications.</li>\n                </ul>',
	},
	{
		notificationLogId: 27000,
		notificationMessage:
			'<p>Dear Team,</p>\n                <p>I would like to bring to your attention an important information regarding unemployment\n                insurance. It’s mandatory to enroll in the (ILOE), also known as Unemployment Insurance\n                Scheme, in time to avoid the fine amount of AED 400/-. All employees who are residing in\n                UAE on employment visa, after processing the emirates ID are individually responsible to\n                enroll in this insurance, company will not be liable for any employee insurance or the fine\n                amount due to the overdue.</p>\n                <p>Please follow the below guideline to apply ILOE insurance through a mobile device:</p>\n                <ul>\n                    <li>Download the ILOE App from Google Play Store.</li>\n                    <li>Create an account or log in if you already have one.</li>\n                    <li>Use the app’s search feature or navigate to the insurance section to find the ILOE\n                    insurance (i.e., annual, 12 months insurance for AED 63).</li>\n                    <li>Enter the required information for a quote, such as personal details, business\n                    information, and coverage needs.</li>\n                    <li>Proceed with the amount in the quote and pay via bank transfer.</li>\n                    <li>Review your application details and submit them. You may receive confirmation and\n                    further instructions via email or in-app notifications.</li>\n                </ul>',
	},
	{
		notificationLogId: 10996,
		notificationMessage:
			'<div>aaaaaaaaa aaaaaaaa aaaaaaaa aaaaaa aaaaaaaa aaaaaaaaaa aaaaaaaaaaaaa&nbsp; f</div>',
	},
	{
		notificationLogId: 9997,
		notificationMessage:
			'<p>Dear Team,</p>\n                <p>I would like to bring to your attention an important information regarding unemployment\n                insurance. It’s mandatory to enroll in the (ILOE), also known as Unemployment Insurance\n                Scheme, in time to avoid the fine amount of AED 400/-. All employees who are residing in\n                UAE on employment visa, after processing the emirates ID are individually responsible to\n                enroll in this insurance, company will not be liable for any employee insurance or the fine\n                amount due to the overdue.</p>\n                <p>Please follow the below guideline to apply ILOE insurance through a mobile device:</p>\n                <ul>\n                    <li>Download the ILOE App from Google Play Store.</li>\n                    <li>Create an account or log in if you already have one.</li>\n                    <li>Use the app’s search feature or navigate to the insurance section to find the ILOE\n                    insurance (i.e., annual, 12 months insurance for AED 63).</li>\n                    <li>Enter the required information for a quote, such as personal details, business\n                    information, and coverage needs.</li>\n                    <li>Proceed with the amount in the quote and pay via bank transfer.</li>\n                    <li>Review your application details and submit them. You may receive confirmation and\n                    further instructions via email or in-app notifications.</li>\n                </ul>',
	},
	{
		notificationLogId: 9996,
		notificationMessage:
			'<p>Dear Team,</p>\n                <p>I would like to bring to your attention an important information regarding unemployment\n                insurance. It’s mandatory to enroll in the (ILOE), also known as Unemployment Insurance\n                Scheme, in time to avoid the fine amount of AED 400/-. All employees who are residing in\n                UAE on employment visa, after processing the emirates ID are individually responsible to\n                enroll in this insurance, company will not be liable for any employee insurance or the fine\n                amount due to the overdue.</p>\n                <p>Please follow the below guideline to apply ILOE insurance through a mobile device:</p>\n                <ul>\n                    <li>Download the ILOE App from Google Play Store.</li>\n                    <li>Create an account or log in if you already have one.</li>\n                    <li>Use the app’s search feature or navigate to the insurance section to find the ILOE\n                    insurance (i.e., annual, 12 months insurance for AED 63).</li>\n                    <li>Enter the required information for a quote, such as personal details, business\n                    information, and coverage needs.</li>\n                    <li>Proceed with the amount in the quote and pay via bank transfer.</li>\n                    <li>Review your application details and submit them. You may receive confirmation and\n                    further instructions via email or in-app notifications.</li>\n                </ul>',
	},
];
const NotificationsScreen = () => {
	const [selected, setSelected] = useState(null);
	const sheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['65%'], []);
	const {
		isNotificationsLoading,
		getNotifications,
		// notifications,
		hasMore,
		currentPage,
	} = useNotification();
	const colorScheme = useColorScheme();

	const handleSnapPress = useCallback((item) => {
		setSelected(item);
		sheetRef.current?.snapToIndex(0);
	}, []);

	const closeModal = useCallback(() => {
		sheetRef.current?.close();
		setSelected(null);
	}, []);

	useEffect(() => {
		getNotifications(1);
	}, []);

	const loadMore = useCallback(() => {
		if (!isNotificationsLoading && hasMore) {
			getNotifications(currentPage + 1);
		}
	}, [isNotificationsLoading, hasMore, currentPage]);

	const renderItem = ({ item, index }: { item: Notification }) => (
		<TouchableOpacity onPress={() => handleSnapPress(item)}>
			<ThemedView
				style={[
					styles.notificationItem,
					{ backgroundColor: colorScheme === 'dark' ? '#000' : '#eee' },
				]}>
				<ThemedText style={styles.message}>{`Notification ${
					index + 1
				}`}</ThemedText>
				<ThemedText style={styles.message}>
					Click here to open notification
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
					color='#007AFF'
				/>
			</View>
		);
	};

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				onPress={null}
				pressBehavior='none'
			/>
		),
		[]
	);

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
			<BottomSheet
				ref={sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				index={-1}
				handleComponent={null}
				backdropComponent={renderBackdrop}>
				<View style={styles.headerContainer}>
					<Text style={styles.headerText}>{`Hello`}</Text>
					<TouchableOpacity
						onPress={closeModal}
						style={styles.closeButton}>
						<CloseIcon color='#fff' />
					</TouchableOpacity>
				</View>
				<BottomSheetScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ flexGrow: 1 }}>
					<WebView
						style={styles.titleContainer}
						source={{ html: selected?.notificationMessage }}
					/>
				</BottomSheetScrollView>
			</BottomSheet>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
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
