import * as React from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import SkeletonLoading from 'expo-skeleton-loading';

function DailyAttendenceLoaderItem() {
	const darkTheme = useColorScheme() == 'dark';

	return (
		<SkeletonLoading
			background={darkTheme ? '#373737' : '#adadad'}
			highlight={darkTheme ? '#171717' : '#ffffff'}
			style={styles.placeholderWrapper}>
			<View>
				<View style={styles.placeholderContainer}>
					<View style={styles.attendanceSectionText}>
						<View style={styles.circleWrapper}></View>
						<View>
							<View style={styles.title} />
							<View style={styles.text} />
						</View>
					</View>
					<View style={styles.attendanceSectionText}>
						<View style={[styles.arrowWrapper]}></View>
						<View>
							<View style={styles.title} />
							<View style={styles.text} />
						</View>
					</View>
					<View style={styles.attendanceSectionText}>
						<View style={[styles.arrowWrapper]}></View>
						<View>
							<View style={styles.title} />
							<View style={styles.text} />
						</View>
					</View>
				</View>
				<View style={styles.bottomLine} />
			</View>
		</SkeletonLoading>
	);
}

function DailyAttendenceLoader() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			{[
				'skl1',
				'skl2',
				'skl3',
				'skl4',
				'skl5',
				'skl6',
				'skl7',
				'skl8',
				'skl9',
				'skl10',
			].map((i) => (
				<DailyAttendenceLoaderItem key={i} />
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	placeholderWrapper: {
		justifyContent: 'center',
		height: 'auto',
		backgroundColor: '#F5F5F5',
		marginHorizontal: 20,
		paddingVertical: 20,
	},
	placeholderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 20,
	},
	title: {
		marginTop: 5,
		width: 25,
		height: 10,
		backgroundColor: '#fff',
		borderRadius: 4,
	},
	text: {
		marginTop: 10,
		width: 45,
		height: 10,
		backgroundColor: '#fff',
		borderRadius: 4,
	},
	bottomLine: {
		width: '100%',
		height: 1,
		backgroundColor: '#fff',
		marginBottom: 20,
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
		backgroundColor: '#fff',
	},
	attendanceSectionText: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default DailyAttendenceLoader;
