import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	Platform,
	useColorScheme,
} from 'react-native';

import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LeaveRequest from '@/components/LeaveRequest';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLeaves } from '../contexts/LeaveContext';
import { useEffect } from 'react';

export default function LeavesScreen() {
	const backgroundColor = useThemeColor({}, 'background');
	const colorScheme = useColorScheme();
	const { leaveRequests, isLoading, getLeaveRequests } = useLeaves();

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
							darkColor='#007AFF'
							lightColor='#007AFF'>
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
