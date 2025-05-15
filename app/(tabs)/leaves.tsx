import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	Platform,
	useColorScheme,
	RefreshControl,
} from 'react-native';

import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LeaveRequest from '@/components/LeaveRequest';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLeaves } from '../contexts/LeaveContext';
import { useEffect, useState, useCallback } from 'react';
import { primaryColor } from '@/constants/Colors';

export default function LeavesScreen() {
	const backgroundColor = useThemeColor({}, 'background');
	const colorScheme = useColorScheme();
	const { leaveRequests, isLoading, getLeaveRequests } = useLeaves();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getLeaveRequests({
			offset: 0,
			limit: 10,
			search: '',
			isExpired: 0,
			filterList: [],
		}).finally(() => {
			setRefreshing(false);
		});
	}, []);

	useEffect(() => {
		getLeaveRequests({
			offset: 0,
			limit: 10,
			search: '',
			isExpired: 0,
			filterList: [],
		});
	}, []);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]}>
			<ThemedView style={styles.requestsContainer}>
				<View style={styles.requestsTitleSection}>
					<ThemedText
						style={{ fontSize: 20 }}
						type='defaultSemiBold'>
						My Requests
					</ThemedText>
					<Link href='/leave-form'>
						<ThemedText
							darkColor={primaryColor}
							lightColor={primaryColor}>
							Apply Leave
						</ThemedText>
					</Link>
				</View>
				<FlatList
					data={leaveRequests}
					contentContainerStyle={{
						padding: 20,
						paddingTop: 10,
						paddingBottom: 100,
					}}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					renderItem={({ item }) => <LeaveRequest leave={item} />}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={primaryColor}
							colors={[primaryColor]}
						/>
					}
					ListEmptyComponent={
						isLoading ? (
							<ThemedText style={{ textAlign: 'center', marginTop: 20 }}>
								Loading...
							</ThemedText>
						) : (
							<ThemedText style={{ textAlign: 'center', marginTop: 20 }}>
								No leave requests found
							</ThemedText>
						)
					}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
	},
	requestsTitleSection: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 10,
	},
	requestsContainer: {
		paddingVertical: 10,
		paddingTop: Platform.OS === 'android' ? 72 : 10,
	},
});
