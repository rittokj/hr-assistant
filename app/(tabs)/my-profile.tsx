import {
	StyleSheet,
	View,
	SafeAreaView,
	ScrollView,
	Image,
	TouchableOpacity,
	Platform,
	useColorScheme,
	Animated,
	RefreshControl,
} from 'react-native';
import moment from 'moment';
import { useRef, useState, useCallback, useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AngleRightIcon from '@/assets/svgs/AngleRight';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import DefaultUserImageIcon from '@/assets/svgs/DefaultUserImage';
import { API_URL } from '@/constants/constants';
import { primaryColor } from '@/constants/Colors';
import AngleIcon from '@/assets/svgs/Angle';

type MenuItem = {
	id: string;
	label: string;
	value: string;
	type?: 'date';
};

type ProfileSection = {
	id: string;
	label: string;
	size: number;
	list: MenuItem[];
};

export default function ProfileScreen() {
	const colorScheme = useColorScheme();
	const [selected, setSelected] = useState('');
	const [opened, setOpened] = useState<string[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const { profileInfo, logout, tokens, getProfileInfo } = useAuth();
	const { memos, warnings, fetchMemos, fetchWarnings } = useProfile();
	const animationValues = useRef<Record<string, Animated.Value>>({}).current;

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			if (tokens.employeeId) {
				await Promise.all([
					getProfileInfo(tokens.employeeId, null, null),
					fetchMemos(),
					fetchWarnings(),
				]);
			}
		} catch (error) {
			console.error('Error refreshing profile:', error);
		} finally {
			setRefreshing(false);
		}
	}, [tokens.employeeId, getProfileInfo, fetchMemos, fetchWarnings]);

	useEffect(() => {
		fetchMemos();
		fetchWarnings();
	}, [profileInfo?.employeeID]);

	const profileInfoList: ProfileSection[] = [
		{
			id: 'personalDetails',
			label: 'Personal Details',
			size: 60,
			list: [
				{
					id: 'gender',
					label: 'Gender',
					value: profileInfo?.genderCdNavigationDTO?.lookUpName || '',
				},
				{ id: 'dob', label: 'Date of Birth', value: profileInfo?.dob || '' },
				{ id: 'email', label: 'Email ID', value: profileInfo?.emailId || '' },
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
			size: 60,
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
			size: 80,
			list:
				profileInfo?.employeeDocumentDTOList?.map((i) => ({
					id: i.documentTypeDTO.documentTypeCode,
					label: i.documentTypeDTO.documentTypeName,
					value:
						i.documentTypeDTO.documentTypeCode === 'PPT'
							? `Issue Date: ${i.issueDateText} \nExpiry Date: ${i.expiryDateText}`
							: '',
				})) || [],
		},
		{
			id: 'salaryInfo',
			label: 'Salary Info',
			size: 80,
			list:
				profileInfo?.employeeSalaryDTOList?.map((i) => ({
					id: 'Total_Salary',
					label: 'Salary',
					value: `Total: ${i.totalSalary}\nDate From: ${i.dateFromText}\nVersion: ${i.version}`,
				})) || [],
		},
		{
			id: 'Warning',
			size: 85,
			label: 'Warning',
			list: warnings.map((warning) => ({
				id: `warning-${warning.employeeWarningId}`,
				label: warning.warningMessage,
				openable: true,
			})),
		},
		{
			id: 'Memo',
			size: 85,
			label: 'Memo',
			list: memos.map((memo) => ({
				id: `memo-${memo.memoDTO.memoId}`,
				label: memo.memoDTO.subject,
				openable: true,
			})),
		},
	];

	const toggleSection = (id: string) => {
		const list = [...opened];
		const currentIndex = list.findIndex((i) => i === id);
		if (currentIndex !== -1) {
			list.splice(currentIndex, 1);
		} else {
			list.push(id);
		}
		const isOpen = currentIndex !== -1;
		setSelected(isOpen ? '' : id);
		if (!animationValues[id]) {
			animationValues[id] = new Animated.Value(isOpen ? 0 : 1);
		}
		Animated.timing(animationValues[id], {
			toValue: isOpen ? 0 : 1,
			duration: 300,
			useNativeDriver: false,
		}).start();
		setOpened(list);
	};

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
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={primaryColor}
							colors={[primaryColor]}
						/>
					}
					contentContainerStyle={{
						padding: 20,
						paddingTop: 10,
						paddingBottom: 120,
					}}>
					<View
						style={[
							styles.imageWrapper,
							{ borderColor: colorScheme === 'dark' ? '#373737' : '#ECE9F2' },
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
								<DefaultUserImageIcon
									color={colorScheme === 'dark' ? '#373737' : '#171717'}
								/>
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
						{profileInfoList.map((item) => {
							if (!animationValues[item.id]) {
								animationValues[item.id] = new Animated.Value(0);
							}
							const animatedHeight = animationValues[item.id].interpolate({
								inputRange: [0, 1],
								outputRange: [0, item.list.length * item.size],
							});
							const animatedOpacity = animationValues[item.id].interpolate({
								inputRange: [0, 1],
								outputRange: [0, 1],
							});

							return (
								<View key={item.id}>
									<TouchableOpacity
										onPress={() => toggleSection(item.id)}
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
													{
														rotate:
															opened.findIndex((i) => i === item.id) > -1
																? '90deg'
																: '0deg',
													},
												],
											}}>
											<AngleRightIcon
												color={colorScheme === 'dark' ? '#ccc' : '#171717'}
											/>
										</View>
									</TouchableOpacity>
									<Animated.View
										style={{
											height: animatedHeight,
											opacity: animatedOpacity,
											overflow: 'hidden',
										}}>
										<View
											style={[
												styles.detailsWrapper,
												{
													borderColor:
														colorScheme === 'dark' ? '#373737' : '#ECE9F2',
												},
											]}>
											{item?.list?.map((menuItem, index) => {
												const Wrapper = menuItem?.openable
													? TouchableOpacity
													: View;
												return (
													<Wrapper
														key={menuItem.id}
														style={[
															styles.detailsItem,
															{
																borderBottomWidth:
																	item?.list?.length - 1 === index ? 0 : 1,
																borderBottomColor:
																	colorScheme === 'dark'
																		? '#373737'
																		: '#ECE9F2',
																alignItems: menuItem?.openable
																	? 'center'
																	: 'flex-start',
															},
														]}>
														<ThemedText
															style={{
																flex: 1,
																paddingRight: menuItem?.openable ? 20 : 0,
															}}>
															{menuItem.label}
														</ThemedText>
														{menuItem?.openable ? (
															<TouchableOpacity style={styles.iconContainer}>
																<View style={styles.iconWrapper}>
																	<AngleIcon color='#fff' />
																</View>
															</TouchableOpacity>
														) : (
															<ThemedText>
																{menuItem?.type === 'date'
																	? moment(menuItem.value).format('DD MMM YYYY')
																	: menuItem.value}
															</ThemedText>
														)}
													</Wrapper>
												);
											})}
										</View>
									</Animated.View>
								</View>
							);
						})}
						<TouchableOpacity
							onPress={logout}
							style={[styles.linksItem, { backgroundColor: '#FF3B30' }]}>
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
	iconContainer: {
		width: 15,
		height: 15,
		backgroundColor: primaryColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		padding: 5,
	},
	iconWrapper: {
		transform: [{ scale: 0.5 }],
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
		backgroundColor: primaryColor,
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
