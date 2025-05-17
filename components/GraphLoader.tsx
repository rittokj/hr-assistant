import * as React from 'react';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { StyleSheet, useColorScheme, View } from 'react-native';

function GraphLoader() {
	const darkTheme = useColorScheme() == 'dark';

	return (
		<View style={styles.container}>
			<ShimmerPlaceHolder
				visible
				style={{ opacity: darkTheme ? 0.5 : 1 }}>
				<View style={styles.title}></View>
			</ShimmerPlaceHolder>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		borderWidth: 1,
		borderRadius: 20,
		borderColor: '#ffffff',
	},
	title: {
		width: '100%',
		height: 285,
		backgroundColor: '#E6F2FF',
		borderRadius: 16,
	},
	text: {
		width: 180,
		height: 14,
		backgroundColor: '#E6F2FF',
		borderRadius: 4,
	},
	icon: {
		width: 20,
		height: 20,
		backgroundColor: '#E6F2FF',
		borderRadius: 4,
	},
	item: {
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		height: 'auto',
		backgroundColor: '#F5F5F5',
	},
});

export default GraphLoader;
