import {
	StyleSheet,
	View,
	FlatList,
	KeyboardAvoidingView,
	useColorScheme,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PaySlip from '@/components/PaySlip';
import PaySlipDetails from '@/components/PaySlipDetails';
import PaySlipLoader from '@/components/PaySlipLoader';
import { useEffect, useState } from 'react';
import { usePayslip } from '../contexts/PayslipContext';

export default function PaySlipScreen() {
	const colorScheme = useColorScheme();
	const { payslips, fetchPayslips } = usePayslip();
	const [open, setOpen] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			await fetchPayslips();
			setLoading(false);
		};
		loadData();
	}, []);

	return (
		<KeyboardAvoidingView
			behavior='padding'
			style={{
				flex: 1,
				backgroundColor: colorScheme === 'dark' ? '#171717' : '#FFF',
			}}>
			<ThemedView style={styles.requestsContainer}>
				<View style={styles.requestsTitleSection}>
					<ThemedText
						style={{ fontSize: 20 }}
						type='defaultSemiBold'>
						Pay Slips
					</ThemedText>
				</View>
				{loading ? (
					<PaySlipLoader />
				) : (
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
								slip={item}
								setOpen={setOpen}
							/>
						)}
					/>
				)}
			</ThemedView>
			<PaySlipDetails
				open={open}
				setOpen={setOpen}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
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
