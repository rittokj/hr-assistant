import React, {
	useEffect,
	useState,
	useCallback,
	useRef,
	useMemo,
} from 'react';
import { View, Text, useColorScheme } from 'react-native';
import moment from 'moment';
import SwipeButton from 'rn-swipe-button';
import { Toast } from 'toastify-react-native';

import ArrowSimpleIcon from '@/assets/svgs/ArrowSimple';
import { useAttendance } from '@/app/contexts/AttendanceContext';

function RnSwipeButton() {
	const colorScheme = useColorScheme();
	const [currentTime, setCurrentTime] = useState(new Date());
	const { markAttendance, currentDayAttendance } = useAttendance();

	const forceResetLastButton = useRef<(() => void) | null>(null);

	const forceResetButtonCallback = useCallback(() => {
		forceResetLastButton.current?.();
	}, []);

	const handleSwipeSuccess = useCallback(async () => {
		try {
			const typeId = currentDayAttendance.checkIn.time ? 2 : 1;
			await markAttendance(typeId, currentDayAttendance.checkIn.id);
			forceResetButtonCallback();

			Toast.show({
				type: 'success',
				text1: `Successfully ${
					currentDayAttendance.checkIn.time ? 'checked out' : 'checked in'
				}!`,
				position: 'bottom',
				visibilityTime: 4000,
			});
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: `Failed to mark attendance. Please try again.`,
				position: 'bottom',
				visibilityTime: 4000,
			});
		}
	}, [currentDayAttendance.checkIn.time]);

	const handleForceReset = useCallback((reset: () => void) => {
		forceResetLastButton.current = reset;
	}, []);

	const titleComponent = useMemo(() => {
		return () => (
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
					Swipe right to{' '}
					{currentDayAttendance.checkIn ? 'check out' : 'check in'}
				</Text>
				<Text style={{ color: '#fff', fontSize: 12 }}>
					{moment(currentTime).format('LT')}
				</Text>
			</View>
		);
	}, [currentDayAttendance.checkIn, currentTime]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearTimeout(timer);
	}, [currentTime]);

	return (
		<View>
			<SwipeButton
				disableResetOnTap
				forceReset={handleForceReset}
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
				titleComponent={titleComponent}
			/>
		</View>
	);
}

export default React.memo(RnSwipeButton);
