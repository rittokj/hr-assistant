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

export default function ProfileScreen() {
	const colorScheme = useColorScheme();
	const { profileInfo } = useAuth();
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
					<View style={styles.imageWrapper}>
						{profileInfo?.profileImagePath ? (
							<Image
								source={{ uri: profileInfo.profileImagePath }}
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
					<View style={styles.detailsWrapper}>
						{[
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
								value: profileInfo?.appointmentSignedDate || '',
								type: 'date',
							},
							{
								id: 'designation',
								label: 'Designation',
								value: profileInfo?.designationDTO?.designationName || '',
							},
						].map((item) => (
							<View
								key={item.id}
								style={styles.detailsItem}>
								<ThemedText>{item.label}</ThemedText>
								<ThemedText>
									{item?.type === 'date'
										? moment(item.value).format('DD MMM YYYY')
										: item.value}
								</ThemedText>
							</View>
						))}
					</View>
					<View style={styles.linksWrapper}>
						{[
							{ id: 'personalDetails', label: 'Personal Details' },
							{ id: 'professionalDetails', label: 'Professional Details' },
							{ id: 'documents', label: 'Documents' },
							{ id: 'salaryInfo', label: 'Salary Info' },
							{ id: 'Warning', label: 'Warning' },
							{ id: 'Memo', label: 'Memo' },
						].map((item) => (
							<TouchableOpacity
								key={item.id}
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
								<AngleRightIcon
									color={colorScheme === 'dark' ? '#ccc' : '#171717'}
								/>
							</TouchableOpacity>
						))}
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
		objectFit: 'cover',
		backgroundColor: '#373737',
	},
	imageWrapper: {
		position: 'relative',
		borderRadius: 20,
		overflow: 'hidden',
		marginBottom: 20,
	},
	detailsWrapper: {
		position: 'relative',
		borderRadius: 15,
		overflow: 'hidden',
		marginBottom: 20,
		borderColor: '#ECE9F2',
		borderWidth: 1,
		paddingHorizontal: 20,
	},
	detailsItem: {
		width: '100%',
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderBottomColor: '#ECE9F2',
		paddingBottom: 15,
		paddingTop: 15,
		borderBottomWidth: 1,
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
