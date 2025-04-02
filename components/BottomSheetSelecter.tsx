import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import CloseIcon from '@/assets/svgs/Close';

interface BottomSheetSelecterProps {
	open: boolean;
	onClose: () => void;
	title: string;
	list: any[];
	onSelect: (item: any) => void;
	selectedItem: any;
	valueName: string;
	valueId: string;
}

function BottomSheetSelecter({
	open,
	onClose,
	title,
	list,
	onSelect,
	selectedItem,
	valueName,
	valueId,
}: BottomSheetSelecterProps) {
	const sheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['55%'], []);

	// callbacks
	const handleSnapPress = useCallback((index) => {
		sheetRef.current?.snapToIndex(index);
	}, []);

	const closeModal = useCallback(() => {
		onClose();
		sheetRef.current?.close();
	}, []);

	useEffect(() => {
		if (open) handleSnapPress(0);
	}, [open]);

	const renderBackdrop = useCallback(
		(props) => (
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

	return (
		<BottomSheet
			ref={sheetRef}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			index={-1}
			handleComponent={null}
			backdropComponent={renderBackdrop}>
			<View
				style={{
					padding: 20,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<Text style={{ fontWeight: '600', fontSize: 16 }}>{title}</Text>
				<TouchableOpacity
					onPress={closeModal}
					style={{ padding: 10, backgroundColor: '#000', borderRadius: 20 }}>
					<CloseIcon color='#fff' />
				</TouchableOpacity>
			</View>
			<BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
				{list.map((item) => (
					<TouchableOpacity
						key={item[valueId]}
						onPress={() => {
							onSelect(item);
							closeModal();
						}}>
						<View
							style={{
								backgroundColor:
									selectedItem?.metaData &&
									item[valueId] === selectedItem?.metaData[valueId]
										? '#007AFF'
										: '#e6f2ff',
								justifyContent: 'center',
								alignItems: 'center',
								padding: 10,
								marginVertical: 5,
								borderRadius: 10,
							}}>
							<View>
								<Text
									style={{
										fontSize: 14,
										fontWeight:
											selectedItem?.metaData &&
											item[valueId] === selectedItem?.metaData[valueId]
												? '600'
												: '400',
										color:
											selectedItem?.metaData &&
											item[valueId] === selectedItem?.metaData[valueId]
												? '#FFF'
												: '#000',
									}}>
									{item[valueName]}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				))}
			</BottomSheetScrollView>
		</BottomSheet>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'grey',
	},
	contentContainer: {
		flex: 1,
		padding: 36,
		alignItems: 'center',
	},
});

export default BottomSheetSelecter;
