import React, { useEffect } from 'react';
import {
	Image,
	StyleSheet,
	Platform,
	View,
	ScrollView,
	SafeAreaView,
	Dimensions,
	useColorScheme,
} from 'react-native';

import { Link } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BellIcon from '@/assets/svgs/Bell';
import ArrowLeftIcon from '@/assets/svgs/ArrowLeft';
import ArrowRightIcon from '@/assets/svgs/ArrowRight';
import RnSwipeButton from '@/components/RnSwipeButton';
import RequestsCarousel from '@/components/RequestsCarousel';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import DefaultUserImageIcon from '@/assets/svgs/DefaultUserImage';
import moment from 'moment';

interface ProfileInfo {
	profileImagePath?: string;
	employeeName?: string;
	designationDTO?: {
		designationName?: string;
	};
}

const { width } = Dimensions.get('window');

export default function HomeScreen() {
	const colorScheme = useColorScheme();
	const textColor = useThemeColor({}, 'text');
	const backgroundColor = useThemeColor({}, 'background');
	const { profileInfo } = useAuth() as { profileInfo: ProfileInfo };
	const {
		currentDayAttendance,
		weeklyAttendance,
		fetchCurrentDayAttendance,
		isCurrentDayLoading,
		isWeeklyLoading,
	} = useAttendance();

	useEffect(() => {
		fetchCurrentDayAttendance();
	}, [profileInfo?.employeeID]);

	const chartData = weeklyAttendance.map((att) => ({
		value: att.totalHours ? parseFloat(att.totalHours) : 0,
		label: moment(att.date).format('ddd'),
	}));

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]}>
			<ThemedView style={styles.header}>
				<View style={styles.headerNameSection}>
					{profileInfo?.profileImagePath ? (
						<Image
							source={{ uri: profileInfo.profileImagePath }}
							style={styles.reactLogo}
						/>
					) : (
						<View style={styles.reactLogo}>
							<DefaultUserImageIcon />
						</View>
					)}

					<View>
						<ThemedText type='subtitle'>
							{profileInfo?.employeeName || ''}
						</ThemedText>
						<ThemedText>
							{profileInfo?.designationDTO?.designationName || ''}
						</ThemedText>
					</View>
				</View>
				<Link href='/notifications'>
					<BellIcon color='#007AFF' />
				</Link>
			</ThemedView>
			<ScrollView showsVerticalScrollIndicator={false}>
				<ThemedView style={styles.titleContainer}>
					<View style={styles.titleGraphSection}>
						<ThemedText type='defaultSemiBold'>Attendance</ThemedText>
						<Link href='/attendance'>
							<ThemedText
								lightColor='#007AFF'
								darkColor='#007AFF'>
								View All
							</ThemedText>
						</Link>
					</View>
					<View style={styles.bodyGraphSection}>
						{isWeeklyLoading ? (
							<ThemedText style={{ textAlign: 'center', padding: 20 }}>
								Loading weekly data...
							</ThemedText>
						) : (
							<BarChart
								data={chartData}
								frontColor='#3185FE'
								xAxisLabelTextStyle={{
									color: textColor,
								}}
								yAxisTextStyle={{
									color: textColor,
								}}
								height={250}
								barWidth={(width - 60) / 15}
								isAnimated={true}
								yAxisLabelTexts={['0h', '2h', '4h', '6h', '8h', '10h', '12h']}
								noOfSections={6}
								barBorderRadius={4}
								yAxisThickness={0}
								xAxisThickness={0}
								showYAxisIndices={false}
								showXAxisIndices={false}
								dashWidth={0}
							/>
						)}
					</View>
				</ThemedView>
				<ThemedView style={styles.attendanceContainer}>
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
							<ThemedText>Check in</ThemedText>
						</View>
						<View style={styles.attendanceSectionText}>
							{isCurrentDayLoading ? (
								<ThemedText>Loading...</ThemedText>
							) : (
								<>
									<ThemedText type='title'>
										{currentDayAttendance.checkIn.time || '--:--'}
									</ThemedText>
									<ThemedText>
										{currentDayAttendance.checkIn.division}
									</ThemedText>
								</>
							)}
						</View>
						<View style={styles.attendanceSectionText}>
							<ThemedText>
								{currentDayAttendance.checkIn.time
									? 'On time'
									: 'Not checked in'}
							</ThemedText>
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
							<ThemedText>Check out</ThemedText>
						</View>
						<View style={styles.attendanceSectionText}>
							{isCurrentDayLoading ? (
								<ThemedText>Loading...</ThemedText>
							) : (
								<>
									<ThemedText type='title'>
										{currentDayAttendance.checkOut.time || '--:--'}
									</ThemedText>
									<ThemedText>
										{currentDayAttendance.checkOut.division}
									</ThemedText>
								</>
							)}
						</View>
						<View style={styles.attendanceSectionText}>
							<ThemedText>
								{currentDayAttendance.checkOut.time
									? 'On time'
									: 'Not checked out'}
							</ThemedText>
						</View>
					</View>
				</ThemedView>
				<ThemedView style={styles.swipeButtonContainer}>
					<View style={styles.swipeButtonSection}>
						<RnSwipeButton />
					</View>
				</ThemedView>
				<ThemedView style={styles.requestsContainer}>
					<View style={styles.requestsTitleSection}>
						<ThemedText type='defaultSemiBold'>My Requests</ThemedText>
						<Link href='/leaves'>
							<ThemedText
								lightColor='#007AFF'
								darkColor='#007AFF'>
								View All
							</ThemedText>
						</Link>
					</View>
					<View style={styles.requestsSection}>
						<RequestsCarousel />
					</View>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 10,
		paddingTop: Platform.OS === 'android' ? 72 : 10,
	},
	titleGraphSection: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '100%',
	},
	requestsTitleSection: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 20,
	},
	attendanceContainer: {
		flexDirection: 'row',
		width: '100%',
		flex: 1,
		gap: 16,
		padding: 20,
	},
	attendanceSection: {
		flex: 1,
		gap: 8,
		padding: 10,
		borderRadius: 20,
		borderColor: '#ECE9F2',
		borderWidth: 1,
	},
	attendanceSectionText: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	arrowWrapper: {
		backgroundColor: '#E6F2FF',
		padding: 7.5,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	swipeButtonContainer: {
		flexDirection: 'row',
		width: '100%',
		flex: 1,
		gap: 16,
		padding: 20,
	},
	swipeButtonSection: {
		flex: 1,
	},
	requestsSection: {
		flex: 1,
	},
	bodyGraphSection: {
		width: '100%',
		borderColor: '#ECE9F2',
		borderWidth: 1,
		padding: 10,
		borderRadius: 20,
	},
	headerNameSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	titleContainer: {
		gap: 8,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	requestsContainer: {
		gap: 8,
		paddingVertical: 10,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	reactLogo: {
		height: 60,
		width: 60,
		borderRadius: 30,
		objectFit: 'cover',
		resizeMode: 'contain',
		backgroundColor: '#676767',
	},
});
