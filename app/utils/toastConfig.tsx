import { Text, View } from 'react-native';
import React from 'react';
import { ToastConfig } from 'react-native-toast-message';

interface ToastProps {
	text1?: string;
	text2?: string;
}

// Custom toast configuration
export const toastConfig: ToastConfig = {
	success: ({ text1, text2 }: ToastProps) => (
		<View style={{ backgroundColor: '#4CAF50', padding: 16, borderRadius: 10 }}>
			<Text style={{ color: '#fff', fontWeight: 'bold' }}>{text1}</Text>
			{text2 && <Text style={{ color: 'white' }}>{text2}</Text>}
		</View>
	),
};
