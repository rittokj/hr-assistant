import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import AngleIcon from '@/assets/svgs/Angle';
import CalendarIcon from '@/assets/svgs/Calendar';
import { Link } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import moment from 'moment';
import { useLeaves } from '../app/contexts/LeaveContext';
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
	const textColor = useThemeColor({}, 'text');
	const { setSelectedLeaveRequest } = useLeaves();

	const handlePress = () => {
		setSelectedLeaveRequest(leave);
	};

	return (
		<Link
			href='/request-details'
			onPress={handlePress}>
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
							fontSize: 14,
							fontWeight: '500',
						}}>{`${leave.leaveDays} ${
						leave.leaveDays === 1 ? 'Day' : 'Days'
					}`}</ThemedText>
					<View
						style={{
							backgroundColor:
								leaveRequestStatuses[leave?.wfstateConfigDTO?.wfstateId || 15]
									.color,
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
										leaveRequestStatuses[
											leave?.wfstateConfigDTO?.wfstateId || 15
										].textColor,
								},
							]}>
							{leave.wfStateName || ''}
						</ThemedText>
					</View>
				</View>
			</ThemedView>
		</Link>
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
