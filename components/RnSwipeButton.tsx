import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme, Alert } from 'react-native';
import moment from 'moment';
import SwipeButton from 'rn-swipe-button';

import ArrowSimpleIcon from '@/assets/svgs/ArrowSimple';
import { useAttendance } from '@/app/contexts/AttendanceContext';

function RnSwipeButton() {
	const colorScheme = useColorScheme();
	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const { markAttendance } = useAttendance();

	useEffect(() => {
		setTimeout(() => {
			setCurrentTime(new Date());
		}, 1000);
	}, [currentTime]);

	const handleSwipeSuccess = async () => {
		try {
			const typeId = isCheckedIn ? 2 : 1; // 1 for check-in, 2 for check-out
			await markAttendance(typeId);

			setIsCheckedIn(!isCheckedIn);
			Alert.alert(
				'Success',
				`Successfully ${isCheckedIn ? 'checked out' : 'checked in'}!`
			);
		} catch (error) {
			Alert.alert('Error', 'Failed to process attendance. Please try again.');
			console.error('Attendance error:', error);
		}
	};

	return (
		<View>
			<SwipeButton
				railBackgroundColor={colorScheme === 'dark' ? '#373737' : '#428EFB'}
				railBorderColor={colorScheme === 'dark' ? '#373737' : '#428EFB'}
				railStyles={{
					backgroundColor: colorScheme === 'dark' ? '#171717' : '#428EFB',
					borderColor: colorScheme === 'dark' ? '#171717' : '#428EFB',
				}}
				thumbIconBackgroundColor={
					colorScheme === 'dark' ? '#171717' : '#FFFFFF'
				}
				thumbIconBorderColor={colorScheme === 'dark' ? '#373737' : '#428EFB'}
				thumbIconComponent={() => <ArrowSimpleIcon color={'#428EFB'} />}
				titleColor='#fff'
				onSwipeSuccess={handleSwipeSuccess}
				titleComponent={() => (
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							flex: 1,
							width: '100%',
							paddingLeft: 60,
							paddingRight: 20,
						}}>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
							Swipe right to {isCheckedIn ? 'check out' : 'check in'}
						</Text>
						<Text style={{ color: '#fff', fontSize: 12 }}>
							{moment(currentTime).format('LT')}
						</Text>
					</View>
				)}
			/>
		</View>
	);
}

export default RnSwipeButton;
