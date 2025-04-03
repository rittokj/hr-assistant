import * as React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import ArrowLeftIcon from '@/assets/svgs/ArrowLeft';
import ArrowRightIcon from '@/assets/svgs/ArrowRight';
import moment from 'moment';

function DailyAttendence({ attendance }: any) {
	const colorScheme = useColorScheme();
	return (
		<View
			style={[
				styles.item,
				{
					borderColor: '#F3EBFF',
					backgroundColor: colorScheme === 'dark' ? '#171717' : '#fff',
					borderBottomWidth: 1,
					marginTop: 10,
				},
			]}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<View
					style={{
						flexDirection: 'row',
					}}>
					<View
						style={[
							styles.circleWrapper,
							{
								backgroundColor: colorScheme === 'dark' ? '#000' : '#F3EEFF',
							},
						]}>
						<ThemedText>{moment(attendance.attDate).format('DD')}</ThemedText>
					</View>
					<View>
						<ThemedText style={styles.text}>
							{moment(attendance.attDate).format('dddd')}
						</ThemedText>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 5,
								minWidth: 85,
							}}>
							<ThemedText
								style={
									styles.text
								}>{`${attendance.totalHour} hours`}</ThemedText>
						</View>
					</View>
				</View>
				<View style={styles.attendanceSection}>
					<View style={styles.attendanceSectionText}>
						<View
							style={[
								styles.arrowWrapper,
								{
									backgroundColor:
										colorScheme === 'dark' ? '#272727' : '#E6F2FF',
								},
							]}>
							<ArrowRightIcon color='#007AFF' />
						</View>
						<View>
							<ThemedText style={styles.smallText}>Check in</ThemedText>
							<ThemedText style={styles.smallText}>09:03AM</ThemedText>
						</View>
					</View>
				</View>
				<View style={styles.attendanceSection}>
					<View style={styles.attendanceSectionText}>
						<View
							style={[
								styles.arrowWrapper,
								{
									backgroundColor:
										colorScheme === 'dark' ? '#272727' : '#E6F2FF',
								},
							]}>
							<ArrowLeftIcon color='#007AFF' />
						</View>
						<View>
							<ThemedText style={styles.smallText}>Check out</ThemedText>
							<ThemedText style={styles.smallText}>09:03AM</ThemedText>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		justifyContent: 'center',
		height: 'auto',
		backgroundColor: '#F5F5F5',
		marginHorizontal: 20,
		paddingVertical: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
	},
	text: {
		fontSize: 14,
	},
	smallText: {
		fontSize: 12,
	},
	arrowWrapper: {
		backgroundColor: '#E6F2FF',
		width: 40,
		height: 40,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	circleWrapper: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	attendanceSection: {},
	attendanceSectionText: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default DailyAttendence;
