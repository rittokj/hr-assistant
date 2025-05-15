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
		<ThemedView
			style={[
				styles.item,
				{
					borderColor: '#F3EBFF',
					borderWidth: 1,
					padding: 20,
				},
			]}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
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
						<ThemedText style={[styles.text, { marginLeft: 5 }]}>
							{`${moment(leave.leaveFromDate).format('DD MMMM') || ''} to ${
								moment(leave.leaveToDate).format('DD MMMM') || ''
							}`}
						</ThemedText>
					</View>
				</View>
				<Link
					href='/request-details'
					onPress={handlePress}>
					<View style={styles.iconContainer}>
						<View style={styles.iconWrapper}>
							<AngleIcon color='#fff' />
						</View>
					</View>
				</Link>
			</View>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 10,
					width: '100%',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<ThemedText
					style={{ fontWeight: '600' }}>{`${leave.leaveDays} Days`}</ThemedText>
				<View
					style={{
						backgroundColor:
							leaveRequestStatuses[leave?.wfstateConfigDTO?.wfstateId || 15]
								.color,
						paddingHorizontal: 10,
						paddingVertical: 5,
						width: 'auto',
						borderRadius: 10,
					}}>
					<ThemedText
						style={[
							styles.text,
							{
								fontWeight: '600',
								color:
									leaveRequestStatuses[leave?.wfstateConfigDTO?.wfstateId || 15]
										.textColor,
							},
						]}>
						{leave.wfStateName || ''}
					</ThemedText>
				</View>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	iconContainer: {
		width: 22.5,
		height: 22.5,
		backgroundColor: primaryColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		padding: 5,
	},
	iconWrapper: {
		transform: [{ scale: 0.75 }],
	},
	item: {
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		height: 'auto',
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		// fontWeight: "bold",
	},
	text: {
		fontSize: 14,
		lineHeight: 18,
	},
});

export default LeaveRequest;
