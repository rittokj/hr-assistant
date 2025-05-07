import * as React from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import moment = require('moment');

import AngleIcon from '@/assets/svgs/Angle';
import { Link } from 'expo-router';
import { ThemedText } from './ThemedText';
import { useLeaves } from '@/app/contexts/LeaveContext';

const { width } = Dimensions.get('window');

const defaultDataWith6Colors = [
	'#B0604D',
	'#899F9C',
	'#B3C680',
	'#5C6265',
	'#F5D399',
	'#F1F1F1',
];

function RequestsCarousel() {
	const { recenteaveRequests } = useLeaves();
	return (
		<Carousel
			loop={false}
			width={width}
			height={258}
			snapEnabled={true}
			pagingEnabled={true}
			autoPlayInterval={2000}
			mode='parallax'
			modeConfig={{
				parallaxScrollingScale: 0.9,
				parallaxScrollingOffset: 50,
			}}
			data={recenteaveRequests}
			style={{ width: '100%' }}
			renderItem={({ item }) => <RequestsCarouselItem item={item} />}
		/>
	);
}

function RequestsCarouselItem({ item }: { item: string }) {
	const colorScheme = useColorScheme();
	const fromDate = moment(item?.fromDateText, 'DD/MM/YYYY');
	const toDate = moment(item?.toDateText, 'DD/MM/YYYY');
	const formattedRange = `${fromDate.format('D MMMM')} to ${toDate.format(
		'D MMMM'
	)}`;

	return (
		<View
			style={[
				styles.item,
				{
					backgroundColor: colorScheme === 'dark' ? '#373737' : '#F3EBFF',
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
					<ThemedText style={styles.title}>Leave Request</ThemedText>
					<ThemedText style={[styles.text, { marginTop: 5 }]}>{`${
						item?.leaveTypeDTO?.leaveTypeName || ''
					} | ${formattedRange}`}</ThemedText>
					<View
						style={{
							backgroundColor: colorScheme === 'dark' ? '#171717' : '#fff',
							paddingHorizontal: 10,
							paddingVertical: 5,
							marginTop: 10,
							width: 'auto',
							borderRadius: 10,
						}}>
						<ThemedText style={styles.text}>
							{item?.wfStateName || ''}
						</ThemedText>
					</View>
				</View>
				<TouchableOpacity>
					<Link href='/request-details'>
						<AngleIcon color={colorScheme === 'dark' ? '#FFF' : '#171717'} />
					</Link>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	item: {
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		height: 'auto',
		backgroundColor: '#F5F5F5',
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
	},
	text: {
		fontSize: 14,
	},
});

export default RequestsCarousel;
