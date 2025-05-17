import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { primaryColor } from '@/constants/Colors';

import HomeIcon from '@/assets/svgs/Home';
import LeavesIcon from '@/assets/svgs/Leaves';
import AttendenceIcon from '@/assets/svgs/Attendance';
import PaySlipIcon from '@/assets/svgs/PaySlip';
import ProfileIcon from '@/assets/svgs/Profile';

export default function HomeLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: primaryColor,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
						paddingTop: 8,
						paddingBottom: 8,
						height: 65,
					},
					default: {
						paddingTop: 8,
						paddingBottom: 8,
						height: 65,
					},
				}),
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <HomeIcon color={color} />,
				}}
			/>
			<Tabs.Screen
				name='leaves'
				options={{
					title: 'Leaves',
					tabBarIcon: ({ color }) => <LeavesIcon color={color} />,
				}}
			/>
			<Tabs.Screen
				name='attendance'
				options={{
					title: 'Attendance',
					tabBarIcon: ({ color }) => <AttendenceIcon color={color} />,
				}}
			/>
			<Tabs.Screen
				name='pay-slip'
				options={{
					title: 'Pay Slip',
					tabBarIcon: ({ color }) => <PaySlipIcon color={color} />,
				}}
			/>
			<Tabs.Screen
				name='my-profile'
				options={{
					title: 'My Profile',
					tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
				}}
			/>
		</Tabs>
	);
}
