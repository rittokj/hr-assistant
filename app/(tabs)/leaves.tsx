import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	Platform,
} from 'react-native';

import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LeaveRequest from '@/components/LeaveRequest';
import { useThemeColor } from '@/hooks/useThemeColor';

const data = [
	'#B0604D',
	'#899F9C',
	'#B3C680',
	'#5C6265',
	'#F5D399',
	'#F1F1F1',
	'#F1F1F1',
	'#F1F1F1',
	'#F1F1F1',
	'#F1F1F1',
];

export default function LeavesScreen() {
	const backgroundColor = useThemeColor({}, 'background');
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
					data={data}
					contentContainerStyle={{
						padding: 20,
						paddingTop: 10,
						paddingBottom: 100,
					}}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					renderItem={() => <LeaveRequest />}
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
