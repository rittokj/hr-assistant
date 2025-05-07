import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import CloseIcon from '@/assets/svgs/Close';
import { usePayslip } from '@/app/contexts/PayslipContext';
import PayslipDetailsLoader from './PayslipDetailsLoader';

interface PaySlipDetailsProps {
	open: string;
	setOpen: (value: string) => void;
	title?: string;
}

function PaySlipDetails({
	open,
	setOpen,
	title = 'February',
}: PaySlipDetailsProps) {
	const sheetRef = useRef<BottomSheet>(null);
	const {
		fetchPayslipDetails,
		payslipDetails,
		isLoading,
		isDownloading,
		resetPayslipDetails,
		downloadPayslip,
	} = usePayslip();
	const snapPoints = useMemo(() => ['65%'], []);

	// callbacks
	const handleSnapPress = useCallback((index: number) => {
		sheetRef.current?.snapToIndex(index);
	}, []);

	const closeModal = useCallback(() => {
		setOpen('');
		sheetRef.current?.close();
		resetPayslipDetails();
	}, []);

	const handleDownload = async () => {
		downloadPayslip(open);
	};

	useEffect(() => {
		if (open !== '') {
			handleSnapPress(0);
			fetchPayslipDetails(open);
		}
	}, [open]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				onPress={null}
				pressBehavior='none'
			/>
		),
		[]
	);

	const salaryItems = payslipDetails?.payrollGenerationDetDTOList || [];

	return (
		<BottomSheet
			ref={sheetRef}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			index={-1}
			handleComponent={null}
			backdropComponent={renderBackdrop}>
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>{title}</Text>
				<TouchableOpacity
					onPress={closeModal}
					style={styles.closeButton}>
					<CloseIcon color='#fff' />
				</TouchableOpacity>
			</View>
			<BottomSheetScrollView>
				{isLoading || !payslipDetails ? (
					<PayslipDetailsLoader />
				) : (
					<>
						{/* Title Section */}
						<View style={styles.titleContainer}>
							<View style={styles.flex}>
								<Text style={styles.textLeft}>Type</Text>
							</View>
							<View style={styles.flex}>
								<Text style={styles.textLeft}>Addition</Text>
							</View>
							<View style={styles.flex}>
								<Text style={styles.textRight}>Deduction</Text>
							</View>
						</View>

						{/* Salary Items */}
						{salaryItems.map((item, index) => (
							<View
								key={index}
								style={styles.itemContainer}>
								<View style={styles.flex}>
									<Text style={styles.textLeft}>
										{item.salaryTypeDTO.salaryTypeName}
									</Text>
								</View>
								<View style={styles.flex}>
									<Text style={styles.textLeft}>
										{item.addAmount ? `AED ${item.addAmount}` : ''}
									</Text>
								</View>
								<View style={styles.flex}>
									<Text style={styles.textRight}>
										{item.dedAmount ? `AED ${item.dedAmount}` : ''}
									</Text>
								</View>
							</View>
						))}

						{/* Total Section */}
						<View style={styles.totalContainer}>
							<View style={styles.flex}>
								<Text style={styles.textLeft}>Total</Text>
							</View>
							<View style={styles.flex}>
								<Text style={styles.textLeft}></Text>
							</View>
							<View style={styles.flex}>
								<Text style={styles.textRight}>{`AED ${
									payslipDetails?.totalAmount || 0
								}`}</Text>
							</View>
						</View>
						<View>
							<TouchableOpacity
								style={[
									styles.downloadButton,
									isDownloading && styles.downloadButtonDisabled,
								]}
								onPress={handleDownload}
								disabled={isDownloading}>
								{isDownloading ? (
									<View style={styles.downloadButtonContent}>
										<ActivityIndicator
											color='#007aff'
											size='small'
										/>
										<Text
											style={[
												styles.downloadButtonText,
												styles.downloadButtonTextMargin,
											]}>
											Downloading...
										</Text>
									</View>
								) : (
									<Text style={styles.downloadButtonText}>
										Download Pay Slip
									</Text>
								)}
							</TouchableOpacity>
						</View>
					</>
				)}
			</BottomSheetScrollView>
		</BottomSheet>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerText: { fontWeight: '600', fontSize: 16 },
	closeButton: { padding: 10, backgroundColor: '#000', borderRadius: 20 },
	titleContainer: {
		flexDirection: 'row',
		marginHorizontal: 20,
		paddingBottom: 15,
		justifyContent: 'space-between',
		borderBottomColor: '#ECE9F2',
		borderBottomWidth: 1,
	},
	itemContainer: {
		flexDirection: 'row',
		marginHorizontal: 20,
		marginTop: 20,
		paddingBottom: 15,
		justifyContent: 'space-between',
		borderBottomColor: '#ECE9F2',
		borderBottomWidth: 1,
	},
	totalContainer: {
		flexDirection: 'row',
		padding: 20,
		marginTop: -1,
		justifyContent: 'space-between',
		backgroundColor: '#ECE9F2',
	},
	downloadButton: {
		margin: 20,
		padding: 15,
		backgroundColor: '#007aff1a',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	downloadButtonDisabled: {
		opacity: 0.7,
	},
	downloadButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	downloadButtonText: {
		color: '#007aff',
	},
	downloadButtonTextMargin: {
		marginLeft: 8,
	},
	textLeft: { fontSize: 14, textAlign: 'left' },
	textRight: { fontSize: 14, textAlign: 'right' },
	flex: { flex: 1 },
});

export default PaySlipDetails;
