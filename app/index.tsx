import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
} from 'react-native';
import { AxiosError } from 'axios';
import { useAuth } from './contexts/AuthContext';

const LoginScreen = () => {
	const navigation = useNavigation();
	const { login, isLoading, isAuthenticated } = useAuth();
	const [username, setUsername] = useState('employee1');
	const [password, setPassword] = useState('rw123');
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		if (isAuthenticated) {
			navigation.navigate('(tabs)' as never);
		}
	}, [isAuthenticated]);

	const handleLogin = async () => {
		try {
			setError(null);
			await login(username, password);
			navigation.navigate('(tabs)' as never);
		} catch (err) {
			if (err instanceof AxiosError) {
				setError(err.response?.data?.message || 'Login failed');
			} else {
				setError('An unexpected error occurred');
			}
		} finally {
		}
	};

	return (
		<ThemedView style={styles.container}>
			<Image
				source={require('@/assets/images/react-logo.png')}
				style={styles.logo}
			/>
			<ThemedText style={styles.title}>Welcome to HR App</ThemedText>

			{error && <ThemedText style={styles.error}>{error}</ThemedText>}

			<ThemedTextInput
				style={styles.input}
				placeholder='Username'
				value={username}
				onChangeText={setUsername}
				editable={!isLoading}
			/>

			<ThemedTextInput
				style={styles.input}
				placeholder='Password'
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				editable={!isLoading}
			/>

			<TouchableOpacity
				onPress={handleLogin}
				style={[styles.button, isLoading && styles.buttonDisabled]}
				disabled={isLoading}>
				<Text style={styles.buttonText}>
					{isLoading ? 'Logging in...' : 'Login'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
				<Text style={styles.forgotPassword}>Forgot Password?</Text>
			</TouchableOpacity>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: "#f4f4f4",
		padding: 20,
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		padding: 10,
		marginVertical: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
	},
	button: {
		width: '100%',
		padding: 15,
		backgroundColor: '#007bff',
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	forgotPassword: {
		marginTop: 10,
		color: '#007bff',
	},
	error: {
		color: 'red',
		marginBottom: 10,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
});

export default LoginScreen;
