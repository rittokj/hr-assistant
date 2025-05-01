import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	KeyboardAvoidingView,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PaySlip from '@/components/PaySlip';
import PaySlipDetails from '@/components/PaySlipDetails';
import { useEffect, useState } from 'react';
import { usePayslip } from '../contexts/PayslipContext';

export default function PaySlipScreen() {
	const { payslips, isLoading, error, fetchPayslips } = usePayslip();
	const [open, setOpen] = useState(false);
	useEffect(() => {
		fetchPayslips();
	}, []);

	return (
		<KeyboardAvoidingView
			behavior='padding'
			style={{ flex: 1, backgroundColor: '#ECE9F2' }}>
			<ThemedView style={styles.requestsContainer}>
				<View style={styles.requestsTitleSection}>
					<ThemedText
						style={{ fontSize: 20 }}
						type='defaultSemiBold'>
						Pay Slips
					</ThemedText>
				</View>
				<FlatList
					data={payslips}
					contentContainerStyle={{
						padding: 20,
						paddingTop: 10,
						paddingBottom: 100,
					}}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					renderItem={({ item }) => (
						<PaySlip
							open={open}
							slip={item}
							setOpen={setOpen}
						/>
					)}
				/>
			</ThemedView>
			<PaySlipDetails
				open={open}
				setOpen={setOpen}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
	},
	requestsTitleSection: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 10,
	},
	requestsContainer: {
		paddingVertical: 10,
		paddingTop: 72,
	},
});
