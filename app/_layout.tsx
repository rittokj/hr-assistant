import { useEffect } from 'react';
import 'react-native-reanimated';
import { Text, TouchableOpacity, View } from 'react-native';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';

import AngleIcon from '@/assets/svgs/Angle';
import { ThemedText } from '@/components/ThemedText';
import { AuthProvider } from './contexts/AuthContext';
import { LeaveProvider } from './contexts/LeaveContext';
// import { AuthProvider } from '@/contexts/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<AuthProvider>
			<LeaveProvider>
				<GestureHandlerRootView>
					<ThemeProvider
						value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
						<Stack
							screenOptions={{
								headerStyle: {
									backgroundColor: '#f4511e',
								},
								headerTintColor: '#fff',
								headerTitleStyle: {
									fontWeight: '600',
								},
							}}>
							<Stack.Screen
								name='index'
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name='(tabs)'
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name='notifications'
								options={{
									title: 'Apply Leave',
									header: (props) => {
										return (
											<View
												style={{
													marginTop: 70,
													marginLeft: 20,
													flexDirection: 'row',
													alignItems: 'center',
													paddingBottom: 20,
												}}>
												<TouchableOpacity
													onPress={() => props.navigation.goBack()}>
													<View
														style={{
															width: 35,
															height: 35,
															backgroundColor:
																colorScheme === 'dark' ? '#171717' : '#000',
															justifyContent: 'center',
															alignItems: 'center',
															borderRadius: 50,
															marginRight: 10,
															transform: [{ rotate: '180deg' }],
														}}>
														<AngleIcon color='#fff' />
													</View>
												</TouchableOpacity>
												<ThemedText
													style={{
														fontSize: 20,
														fontWeight: 'bold',
													}}>
													Notifications
												</ThemedText>
											</View>
										);
									},
								}}
							/>
							<Stack.Screen
								name='leave-form'
								options={{
									title: 'Apply Leave',
									header: (props) => {
										return (
											<View
												style={{
													marginTop: 70,
													marginLeft: 20,
													flexDirection: 'row',
													alignItems: 'center',
													paddingBottom: 20,
												}}>
												<TouchableOpacity
													onPress={() => props.navigation.goBack()}>
													<View
														style={{
															width: 35,
															height: 35,
															backgroundColor:
																colorScheme === 'dark' ? '#171717' : '#000',
															justifyContent: 'center',
															alignItems: 'center',
															borderRadius: 50,
															marginRight: 10,
															transform: [{ rotate: '180deg' }],
														}}>
														<AngleIcon color='#fff' />
													</View>
												</TouchableOpacity>
												<ThemedText
													style={{
														fontSize: 20,
														fontWeight: 'bold',
													}}>
													Apply Leave
												</ThemedText>
											</View>
										);
									},
								}}
							/>
							<Stack.Screen
								name='request-details'
								options={{
									title: 'Apply Leave',
									header: (props) => {
										return (
											<View
												style={{
													marginTop: 70,
													marginLeft: 20,
													flexDirection: 'row',
													alignItems: 'center',
													paddingBottom: 20,
												}}>
												<TouchableOpacity
													onPress={() => props.navigation.goBack()}>
													<View
														style={{
															width: 35,
															height: 35,
															backgroundColor:
																colorScheme === 'dark' ? '#171717' : '#000',
															justifyContent: 'center',
															alignItems: 'center',
															borderRadius: 50,
															marginRight: 10,
															transform: [{ rotate: '180deg' }],
														}}>
														<AngleIcon color='#fff' />
													</View>
												</TouchableOpacity>
												<ThemedText
													style={{
														fontSize: 20,
														fontWeight: 'bold',
													}}>
													Leave Details
												</ThemedText>
											</View>
										);
									},
								}}
							/>
						</Stack>
						<StatusBar style='auto' />
					</ThemeProvider>
				</GestureHandlerRootView>
			</LeaveProvider>
		</AuthProvider>
	);
}
