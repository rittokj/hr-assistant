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
import { Toast } from 'toastify-react-native';

import SmallAngleIcon from '@/assets/svgs/SmallAngle';
import BottomSheetSelecter from '@/components/BottomSheetSelecter';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import PlusIcon from '@/assets/svgs/Plus';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useLeaves } from './contexts/LeaveContext';
import { useAuth } from './contexts/AuthContext';
import { useNavigation } from 'expo-router';

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
		value: new Date(),
		type: 'date',
	},
	{
		id: 'toDate',
		label: 'To Date',
		value: new Date(),
		type: 'date',
	},
	{ id: 'leaveDays', label: 'Leave Days', value: '', type: 'dynamic' },
	{ id: 'reason', label: 'Reason', value: 'Medical', type: 'text' },
	{
		id: 'attachment',
		label: 'Attach Document',
		value: '',
		type: 'attachment',
	},
];

export default function LeaveFormScreen() {
	const navigation = useNavigation();
	const colorScheme = useColorScheme();
	const {
		leaveTypesList,
		checkLeaveAvailability,
		getLeaveRequests,
		applyLeave,
	} = useLeaves();
	const { profileInfo } = useAuth();
	const [formData, setFormData] = useState(formDataModel);
	const [open, setOpen] = useState(false);
	const [checkingAvailability, setCheckingAvailability] = useState(false);
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
								const fromDate = formData.find((i) => i.id === 'fromDate');
								const updatedFormData = formData.map((data) => {
									if (data.id === 'halfDay') {
										return {
											...data,
											value: data.value === 'Yes' ? 'No' : 'Yes',
										};
									}
									if (data.id === 'toDate') {
										return {
											...data,
											value: fromDate?.value || new Date(),
										};
									}
									if (data.id === 'leaveDays') {
										return {
											...data,
											value: '0.5',
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
										if (updatedFormData[index].id === 'fromDate') {
											const toDateIndex = updatedFormData.findIndex(
												(i) => i.id === 'toDate'
											);
											if (toDateIndex > -1) {
												updatedFormData[toDateIndex] = {
													...updatedFormData[toDateIndex],
													value: date,
												};
											}
										}
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
				const halfDay = formData.find((i) => i.id === 'halfDay');

				const startDate = moment(formData[3].value);
				const endDate = moment(formData[4].value);
				const daysCount =
					endDate.diff(startDate, 'days') +
					(halfDay?.value === 'Yes' ? 0.5 : 1);

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

	const toggleLeave = (leave) => {
		setCheckingAvailability(true);
		checkLeaveAvailability(profileInfo.employeeID, leave.leaveTypeId)
			.then((res) => {
				if (res.data.result.allocatedCount === 0) {
					Toast.show({
						type: 'error',
						text1: `You have used all your ${leave.leaveTypeName || ''} days.`,
						position: 'bottom',
						visibilityTime: 8000,
					});
				} else {
					const updatedFormData = formData.map((data) => {
						if (data.id === 'leaveType') {
							return { ...data, value: leave.leaveTypeName, metaData: leave };
						}
						return data;
					});
					setFormData(updatedFormData);
				}
			})
			.finally(() => setCheckingAvailability(false));
	};

	const submitLeaveRequest = async () => {
		const fromDate = formData.find((item) => item.id === 'fromDate').value;
		const toDate = formData.find((item) => item.id === 'toDate').value;
		const leaveType = formData.find((item) => item.id === 'leaveType').metaData;
		const reason = formData.find((item) => item.id === 'reason').value;
		const isHalfDay =
			formData.find((item) => item.id === 'halfDay').value === 'Yes';
		const leaveDays =
			moment(toDate).diff(moment(fromDate), 'days') + (isHalfDay ? 0.5 : 1);

		if (!fromDate || !toDate || !leaveType || !reason) {
			Toast.show({
				type: 'error',
				text1: 'Please complete all fields before submitting.',
				position: 'bottom',
			});
			return;
		}

		const payload = {
			EmployeeLeaveRequestId: 0,
			EmployeeId: profileInfo.employeeID,
			LeaveTypeId: leaveType.leaveTypeId,
			LeaveFromDate: moment(fromDate).format(),
			LeaveToDate: moment(toDate).format(),
			Reason: reason,
			IsDeleted: false,
			EmployeeName: profileInfo.employeeName,
			TransDate: moment().format(),
			TransNo: `TX${Date.now()}`,
			LeaveDays: leaveDays,
			IsHalfDay: isHalfDay,
			WfstateConfigId: 3,
			ActionNotes: 'Submitted',
		};
		try {
			applyLeave(payload)
				.then(async (res) => {
					await getLeaveRequests({
						offset: 0,
						limit: 10,
						search: '',
						isExpired: 0,
						filterList: [],
					});
					setFormData(formDataModel);
					navigation.goBack();
					Toast.show({
						type: 'success',
						text1: 'Leave request submitted successfully.',
						position: 'bottom',
					});
				})
				.catch((err) => {
					Toast.show({
						type: 'error',
						text1: 'Submission failed',
						text2: err.message || 'Something went wrong.',
						position: 'bottom',
					});
				});
		} catch (err) {
			Toast.show({
				type: 'error',
				text1: 'Network Error',
				text2: err.message,
				position: 'bottom',
			});
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
							style={styles.container}>
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
							onPress={submitLeaveRequest}
							style={styles.applyeaveButton}>
							<ThemedText style={styles.applyeaveButtonText}>
								Apply leave
							</ThemedText>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
			<BottomSheetSelecter
				list={leaveTypesList}
				title='Select Leave Type'
				onSelect={toggleLeave}
				onClose={() => setOpen(false)}
				selectedItem={formData.find((item) => item.id === 'leaveType')}
				valueName='leaveTypeName'
				valueId='leaveTypeId'
				open={open}
				loading={checkingAvailability}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginHorizontal: 20,
		marginTop: 20,
		paddingBottom: 15,
		justifyContent: 'space-between',
		borderBottomColor: '#ECE9F2',
		borderBottomWidth: 1,
	},
	applyeaveButton: {
		margin: 20,
		marginTop: 30,
		padding: 15,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	applyeaveButtonText: {
		color: '#FFF',
		fontWeight: '600',
		fontSize: 16,
	},
});
