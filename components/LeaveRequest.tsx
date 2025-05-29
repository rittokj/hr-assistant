import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AngleIcon from '@/assets/svgs/Angle';
import CalendarIcon from '@/assets/svgs/Calendar';
import { Link, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import moment from 'moment';
import { leaveRequestStatuses } from '@/app/constants/statusColor';
import { primaryColor } from '@/constants/Colors';

type LeaveRequestProps = {
	leave: {
		id: number;
		leaveTypeDTO: {
			leaveTypeName: string;
		};
		leaveFromDate: string;
		leaveToDate: string;
		status: string;
		reason?: string;
	};
};

function LeaveRequest({ leave }: LeaveRequestProps) {
	const router = useRouter();
	const textColor = useThemeColor({}, 'text');

	const onPressItem = () => {
		router.push({
			pathname: '/request-details',
			params: { leaveRequestId: leave?.employeeLeaveRequestId },
		});
	};

	return (
		<TouchableOpacity onPress={onPressItem}>
			<ThemedView
				style={[
					styles.item,
					{
						borderColor: '#F3EBFF',
						borderWidth: 1,
						paddingVertical: 7.5,
						paddingHorizontal: 15,
					},
				]}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
					}}>
					<View
						style={{
							flex: 1,
							alignItems: 'flex-start',
						}}>
						<ThemedText style={styles.title}>
							{leave.leaveTypeDTO.leaveTypeName || ''}
						</ThemedText>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 5,
							}}>
							<CalendarIcon color={textColor} />
							<ThemedText
								style={[styles.text, { marginLeft: 5, marginTop: 5 }]}>
								{leave.leaveDays > 1
									? `${
											moment(leave.leaveFromDate).format('DD MMMM') || ''
									  } to ${moment(leave.leaveToDate).format('DD MMMM') || ''}`
									: moment(leave.leaveFromDate).format('DD MMMM')}
							</ThemedText>
						</View>
					</View>

					<View style={styles.iconContainer}>
						<View style={styles.iconWrapper}>
							<AngleIcon color='#fff' />
						</View>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						marginTop: 15,
						width: '100%',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<ThemedText
						style={{
							fontSize: 12,
							fontWeight: '500',
						}}>{`${leave.leaveDays} ${
						leave.leaveDays === 1 ? 'Day' : 'Days'
					}`}</ThemedText>
					{leave?.wfstateConfigDTO?.wfstateId ? (
						<View
							style={{
								backgroundColor:
									leaveRequestStatuses[leave?.wfstateConfigDTO?.wfstateId]
										?.color || '#ccc',
								paddingHorizontal: 10,
								paddingVertical: 5,
								width: 'auto',
								borderRadius: 6,
							}}>
							<ThemedText
								style={[
									styles.text,
									{
										color:
											leaveRequestStatuses[leave?.wfstateConfigDTO?.wfstateId]
												?.textColor || '#000',
									},
								]}>
								{leave.wfStateName || ''}
							</ThemedText>
						</View>
					) : null}
				</View>
			</ThemedView>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	iconContainer: {
		width: 15,
		height: 15,
		backgroundColor: primaryColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
		marginTop: 5,
	},
	iconWrapper: {
		transform: [{ scale: 0.5 }],
	},
	item: {
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		height: 'auto',
	},
	title: {
		fontSize: 14,
		fontWeight: '600',
	},
	text: {
		fontSize: 12,
		lineHeight: 12,
	},
});

export default LeaveRequest;
