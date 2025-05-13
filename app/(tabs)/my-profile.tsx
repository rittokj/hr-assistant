import {
	StyleSheet,
	View,
	SafeAreaView,
	ScrollView,
	Image,
	TouchableOpacity,
	Platform,
	useColorScheme,
} from 'react-native';
import moment from 'moment';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AngleRightIcon from '@/assets/svgs/AngleRight';
import { useAuth } from '../contexts/AuthContext';
import DefaultUserImageIcon from '@/assets/svgs/DefaultUserImage';
import { useState } from 'react';
import { API_URL } from '@/constants/constants';

export default function ProfileScreen() {
	const colorScheme = useColorScheme();
	const [selected, setSelected] = useState('personalDetails');
	const { profileInfo, logout } = useAuth('');
	console.log('profileInfo', JSON.stringify(profileInfo));
	const profileInfoList = [
		{
			id: 'personalDetails',
			label: 'Personal Details',
			list: [
				{
					id: 'gender',
					label: 'Gender',
					value: profileInfo?.genderCdNavigationDTO?.lookUpName || '',
				},
				{
					id: 'dob',
					label: 'Date of Birth',
					value: profileInfo?.dob || '',
				},
				{
					id: 'email',
					label: 'Email ID',
					value: profileInfo?.emailId || '',
				},
				{
					id: 'phone',
					label: 'Mobile Number',
					value: profileInfo?.mobileNo || '',
				},
				{
					id: 'joining',
					label: 'Joining Date',
					value: profileInfo?.joinDateText || '',
				},
				{
					id: 'designation',
					label: 'Designation',
					value: profileInfo?.designationDTO?.designationName || '',
				},
			],
		},
		{
			id: 'professionalDetails',
			label: 'Professional Details',
			list: [
				{
					id: 'qualification',
					label: 'Qualification',
					value: profileInfo?.qualificationCdNavigationDTO?.lookUpName || '',
				},
				{
					id: 'osd',
					label: 'Offer Signed Date',
					value: profileInfo?.offerSignedDateText || '',
				},
				{
					id: 'department',
					label: 'Department',
					value: profileInfo?.departmentDTO?.departmentName || '',
				},
				{
					id: 'reporting_to',
					label: 'Reporting to',
					value: profileInfo?.reportingTO || '',
				},
				{
					id: 'Sponsor_Name',
					label: 'Sponsor Name',
					value: profileInfo?.sponsorName || '',
				},
				{
					id: 'Weekly_Holiday',
					label: 'Weekly Holiday',
					value: profileInfo?.holiday || '',
				},
			],
		},
		{
			id: 'documents',
			label: 'Documents',
			list: profileInfo?.employeeDocumentDTOList.map((i) => {
				return {
					id: i.documentTypeDTO.documentTypeCode,
					label: i.documentTypeDTO.documentTypeName,
					value:
						i.documentTypeDTO.documentTypeCode === 'PPT'
							? `Issue Date: ${i.issueDateText} \nExpiry Date: ${i.expiryDateText}`
							: '',
				};
			}),
		},
		// {
		// 	id: 'leaveInfo',
		// 	label: 'Leave Info',
		// 	list: [
		// 		{
		// 			id: 'Annual_leave',
		// 			label: 'Annual leave',
		// 			value: '',
		// 		},
		// 		{
		// 			id: 'Sick_Leave',
		// 			label: 'Sick Leave',
		// 			value: '',
		// 		},
		// 		{
		// 			id: 'Casual_Leave',
		// 			label: 'Casual Leave',
		// 			value: '',
		// 		},
		// 		{
		// 			id: 'Unpaid_Leave',
		// 			label: 'Unpaid Leave',
		// 			value: '',
		// 		},
		// 	],
		// },
		{
			id: 'salaryInfo',
			label: 'Salary Info',
			list: profileInfo?.employeeSalaryDTOList?.map((i) => {
				return {
					id: 'Total_Salary',
					label: 'Salary',
					value: `Total: ${i.totalSalary}\nDate From: ${i.dateFromText}\nVersion: ${i.version}`,
				};
			}),
		},
		{
			id: 'Warning',
			label: 'Warning',
			list: [
				{
					id: 'Warning_Message',
					label: 'Warning Message',
					value: 'First Warning	',
				},
			],
		},
		{
			id: 'Memo',
			label: 'Memo',
			list: [
				{
					id: 'Memo-Code',
					label: 'Memo Code',
					value: 'M20',
				},
			],
		},
	];
	return (
		<SafeAreaView style={styles.container}>
			<ThemedView style={styles.requestsContainer}>
				<View style={styles.requestsTitleSection}>
					<ThemedText
						style={{ fontSize: 20 }}
						type='defaultSemiBold'>
						My Profile
					</ThemedText>
				</View>
				<ScrollView
					contentContainerStyle={{
						padding: 20,
						paddingTop: 10,
						paddingBottom: 120,
					}}>
					<View
						style={[
							styles.imageWrapper,
							{
								borderColor: colorScheme === 'dark' ? '#373737' : '#ECE9F2',
							},
						]}>
						{profileInfo?.profileImagePath ? (
							<Image
								source={{
									uri: `${API_URL}documents/${profileInfo.profileImagePath}`,
								}}
								style={styles.profileImage}
							/>
						) : (
							<View style={styles.profileImage}>
								<DefaultUserImageIcon />
							</View>
						)}
						<View style={styles.nameWrapper}>
							<ThemedText
								style={{
									color: '#fff',
									fontSize: 20,
									fontWeight: '600',
									marginBottom: 5,
								}}>
								{profileInfo?.employeeName || ''}
							</ThemedText>
							<ThemedText style={{ color: '#fff', fontSize: 14 }}>
								{profileInfo?.designationDTO?.designationName || ''}
							</ThemedText>
						</View>
					</View>
					<View style={styles.linksWrapper}>
						{profileInfoList.map((item) => (
							<View key={item.id}>
								<TouchableOpacity
									key={item.id}
									onPress={() =>
										setSelected((val) => (val === item.id ? '' : item.id))
									}
									style={[
										styles.linksItem,
										{
											backgroundColor:
												colorScheme === 'dark' ? '#373737' : '#ECE9F2',
										},
									]}>
									<ThemedText
										lightColor='#171717'
										darkColor='#ccc'>
										{item.label}
									</ThemedText>
									<View
										style={{
											transform: [
												{ rotate: selected === item.id ? '90deg' : '0deg' },
											],
										}}>
										<AngleRightIcon
											color={colorScheme === 'dark' ? '#ccc' : '#171717'}
										/>
									</View>
								</TouchableOpacity>
								{selected === item.id ? (
									<View
										style={[
											styles.detailsWrapper,
											{
												borderColor:
													colorScheme === 'dark' ? '#373737' : '#ECE9F2',
											},
										]}>
										{item?.list?.map((menuItem, index) => (
											<View
												key={menuItem.id}
												style={[
													styles.detailsItem,
													{
														borderBottomWidth:
															item?.list?.length - 1 === index ? 0 : 1,
														borderBottomColor:
															colorScheme === 'dark' ? '#373737' : '#ECE9F2',
													},
												]}>
												<ThemedText>{menuItem.label}</ThemedText>
												<ThemedText>
													{menuItem?.type === 'date'
														? moment(menuItem.value).format('DD MMM YYYY')
														: menuItem.value}
												</ThemedText>
											</View>
										))}
									</View>
								) : null}
							</View>
						))}
						<TouchableOpacity
							onPress={logout}
							style={[
								styles.linksItem,
								{
									backgroundColor: '#FF3B30',
								},
							]}>
							<ThemedText style={{ color: '#fff' }}>Logout</ThemedText>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#171717',
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
		paddingTop: Platform.OS === 'android' ? 72 : 10,
	},
	profileImage: {
		width: '100%',
		height: 350,
		objectFit: 'fill',
	},
	imageWrapper: {
		position: 'relative',
		borderRadius: 20,
		overflow: 'hidden',
		marginBottom: 20,
		borderWidth: 1,
	},
	detailsWrapper: {
		position: 'relative',
		borderRadius: 15,
		overflow: 'hidden',
		marginBottom: 20,
		borderWidth: 1,
		paddingHorizontal: 20,
	},
	detailsItem: {
		width: '100%',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingBottom: 15,
		paddingTop: 15,
	},
	nameWrapper: {
		position: 'absolute',
		backgroundColor: '#007AFF',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
	},
	linksWrapper: {},
	linksItem: {
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',

		paddingHorizontal: 20,
		paddingVertical: 15,
		marginBottom: 15,
		borderRadius: 15,
	},
});
