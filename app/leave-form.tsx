import moment from 'moment';
import { useState } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Switch,
	KeyboardAvoidingView,
	Platform,
	useColorScheme,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import SmallAngleIcon from '@/assets/svgs/SmallAngle';
import BottomSheetSelecter from '@/components/BottomSheetSelecter';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import PlusIcon from '@/assets/svgs/Plus';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useLeaves } from './contexts/LeaveContext';

interface FormItem {
	id: string;
	label: string;
	type: string;
	value?: any;
	metaData?: any;
}

const formDataModel = [
	{
		id: 'date',
		label: 'Date',
		type: 'static',
	},
	{
		id: 'leaveType',
		label: 'Leave Type',
		value: null,
		type: 'dropdown',
	},
	{ id: 'halfDay', label: 'Half Day', value: 'No', type: 'toggle' },
	{
		id: 'fromDate',
		label: 'From Date',
		type: 'date',
	},
	{
		id: 'toDate',
		label: 'To Date',
		type: 'date',
	},
	{ id: 'leaveDays', label: 'Leave Days', value: '5', type: 'dynamic' },
	{ id: 'reason', label: 'Reason', value: 'Medical', type: 'text' },
	{
		id: 'attachment',
		label: 'Attach Document',
		value: '',
		type: 'attachment',
	},
];

export default function LeaveFormScreen() {
	const colorScheme = useColorScheme();
	const { leaveTypesList } = useLeaves();
	const [formData, setFormData] = useState(formDataModel);
	const [open, setOpen] = useState(false);
	const [openDatePicker, setOpenDatePicker] = useState(false);

	const getDocument = () => {
		DocumentPicker.getDocumentAsync((res) => {});
	};

	const renderTypes = (item: FormItem) => {
		switch (item.type) {
			case 'static':
				return (
					<View>
						<ThemedText style={{ fontSize: 14, textAlign: 'right' }}>
							{moment().format('DD MMM YYYY')}
						</ThemedText>
					</View>
				);
			case 'dropdown':
				return (
					<TouchableOpacity
						onPress={() => setOpen(true)}
						style={{ flexDirection: 'row', alignItems: 'center' }}>
						<ThemedText
							style={{ fontSize: 14, textAlign: 'right', marginRight: 5 }}>
							{item.value}
						</ThemedText>
						<SmallAngleIcon color={colorScheme === 'dark' ? '#fff' : '#000'} />
					</TouchableOpacity>
				);
			case 'toggle':
				return (
					<View>
						<Switch
							trackColor={{ false: '#DADADA', true: '#007AFF' }}
							thumbColor='#FFFFFF'
							ios_backgroundColor='#DADADA'
							onValueChange={() => {
								const updatedFormData = formData.map((data) => {
									if (data.id === 'halfDay') {
										return {
											...data,
											value: data.value === 'Yes' ? 'No' : 'Yes',
										};
									}
									return data;
								});
								setFormData(updatedFormData);
							}}
							value={
								formData.find((data) => data.id === 'halfDay').value === 'Yes'
							}
						/>
					</View>
				);
			case 'date':
				return (
					<View>
						{Platform.OS === 'ios' || openDatePicker === item.id ? (
							<RNDateTimePicker
								onChange={(e, date: Date) => {
									const updatedFormData = JSON.parse(JSON.stringify(formData));
									const index = updatedFormData.findIndex(
										(i) => i.id === openDatePicker
									);

									if (index > -1) {
										updatedFormData[index] = {
											...updatedFormData[index],
											value: date,
										};
									}
									setFormData(updatedFormData);
									if (date) setOpenDatePicker(false);
								}}
								onTouchCancel={() => setOpenDatePicker(false)}
								mode='date'
								value={item.value || new Date()}
								minimumDate={
									item.id === 'fromDate'
										? new Date()
										: formData[3].value || new Date()
								}
								maximumDate={moment().add(1, 'year').toDate()}
							/>
						) : (
							<TouchableOpacity
								onPress={() => setOpenDatePicker(item.id)}
								style={{ flexDirection: 'row', alignItems: 'center' }}>
								<ThemedText
									style={{
										fontSize: 14,
										textAlign: 'right',
										marginRight: 5,
										color: '#007AFF',
									}}>
									{moment(item.value || new Date()).format('DD MMM YYYY')}
								</ThemedText>
							</TouchableOpacity>
						)}
					</View>
				);
			case 'dynamic':
				const startDate = moment(formData[3].value);
				const endDate = moment(formData[4].value);
				const daysCount = endDate.diff(startDate, 'days');

				return (
					<View>
						<ThemedText style={{ fontSize: 14, textAlign: 'right' }}>
							{daysCount}
						</ThemedText>
					</View>
				);
			case 'text':
				return (
					<View>
						<ThemedTextInput
							multiline
							style={{
								width: 240,
								height: 80,
								borderRadius: 5,
								padding: 10,
							}}
						/>
					</View>
				);
			case 'attachment':
				return (
					<TouchableOpacity
						onPress={getDocument}
						style={{ flexDirection: 'row', alignItems: 'center' }}>
						<ThemedText style={{ fontSize: 14, marginRight: 10 }}>
							{item.value}
						</ThemedText>
						<PlusIcon />
					</TouchableOpacity>
				);
			default:
				return (
					<View>
						<ThemedText style={{ fontSize: 14, textAlign: 'right' }}>
							{item.value}
						</ThemedText>
					</View>
				);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior='padding'
			style={{ flex: 1 }}>
			<View
				style={{
					backgroundColor: colorScheme === 'dark' ? '#171717' : '#fff',
				}}>
				<ScrollView>
					{formData.map((item) => (
						<View
							key={item.id}
							style={{
								flexDirection: 'row',
								marginHorizontal: 20,
								marginTop: 20,
								paddingBottom: 15,
								justifyContent: 'space-between',
								borderBottomColor: '#ECE9F2',
								borderBottomWidth: 1,
							}}>
							<View>
								<ThemedText style={{ fontSize: 14, textAlign: 'left' }}>
									{item.label}
								</ThemedText>
							</View>
							{renderTypes(item)}
						</View>
					))}

					<View>
						<TouchableOpacity
							style={{
								margin: 20,
								marginTop: 30,
								padding: 15,
								backgroundColor: '#007AFF',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: 10,
							}}>
							<ThemedText
								style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>
								Apply leave
							</ThemedText>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
			<BottomSheetSelecter
				list={leaveTypesList}
				title='Select Leave Type'
				onSelect={(item) => {
					const updatedFormData = formData.map((data) => {
						if (data.id === 'leaveType') {
							return { ...data, value: item.leaveTypeName, metaData: item };
						}
						return data;
					});
					setFormData(updatedFormData);
				}}
				onClose={() => setOpen(false)}
				selectedItem={formData.find((item) => item.id === 'leaveType')}
				valueName='leaveTypeName'
				valueId='leaveTypeId'
				open={open}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {},
});
