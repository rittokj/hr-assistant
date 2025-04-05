import { ThemedText } from '@/components/ThemedText';
import moment from 'moment';
import { useMemo } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
	useColorScheme,
} from 'react-native';
import { useLeaves } from './contexts/LeaveContext';

export default function LeaveFormScreen() {
	const { selectedLeaveRequest } = useLeaves();
	const colorScheme = useColorScheme();

	const formData = useMemo(
		() => [
			{
				id: 'reqNo',
				label: 'Request No.',
				value: selectedLeaveRequest.transNo,
				type: 'static',
			},
			{
				id: 'date',
				label: 'Date',
				value: selectedLeaveRequest.transDate,
				type: 'date',
			},
			{
				id: 'leaveType',
				label: 'Leave Type',
				value: selectedLeaveRequest.leaveTypeDTO.leaveTypeName,
				type: 'static',
			},
			{
				id: 'halfDay',
				label: 'Half Day',
				value: selectedLeaveRequest.isHalfDay ? 'Yes' : 'No',
				type: 'static',
			},
			{
				id: 'fromDate',
				label: 'From Date',
				value: selectedLeaveRequest.leaveFromDate,
				type: 'date',
			},
			{
				id: 'toDate',
				label: 'To Date',
				value: selectedLeaveRequest.leaveToDate,
				type: 'date',
			},
			{
				id: 'leaveDays',
				label: 'Leave Days',
				value: selectedLeaveRequest.leaveDays,
				type: 'static',
			},
			{ id: 'reason', label: 'Reason', value: 'Medical', type: 'static' },
			{
				id: 'attachment',
				label: 'Attach Document',
				value: '',
				type: 'attachment',
			},
		],
		[selectedLeaveRequest.transNo]
	);

	const renderTypes = (item) => {
		if (item.type === 'date') {
			return (
				<ThemedText style={styles.text}>
					{moment(item.value).format('DD MMM YYYY')}
				</ThemedText>
			);
		}
		return <ThemedText style={styles.text}>{item.value}</ThemedText>;
	};

	return (
		<KeyboardAvoidingView
			behavior='padding'
			style={{ flex: 1 }}>
			<View
				style={{
					backgroundColor: colorScheme === 'dark' ? '#171717' : '#fff',
				}}>
				<ScrollView>
					{formData.map((item) => (
						<View
							key={item.id}
							style={styles.container}>
							<View>
								<ThemedText style={{ fontSize: 14, textAlign: 'left' }}>
									{item.label}
								</ThemedText>
							</View>
							<View>{renderTypes(item)}</View>
						</View>
					))}

					<View>
						<TouchableOpacity style={styles.cancelButton}>
							<Text style={styles.cancelButtonText}>Cancel leave</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginHorizontal: 20,
		marginTop: 20,
		paddingBottom: 15,
		justifyContent: 'space-between',
		borderBottomColor: '#ECE9F2',
		borderBottomWidth: 1,
	},
	cancelButton: {
		margin: 20,
		marginTop: 30,
		padding: 15,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	cancelButtonText: {
		color: '#FFF',
		fontWeight: '600',
		fontSize: 16,
	},
	text: { fontSize: 14, textAlign: 'right' },
});
