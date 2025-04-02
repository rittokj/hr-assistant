import { type TextProps, StyleSheet, TextInput } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	multiline?: boolean;
	type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedTextInput({
	style,
	lightColor,
	darkColor,
	multiline,
	...rest
}: ThemedTextInputProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'background'
	);

	return (
		<TextInput
			style={[{ color, backgroundColor }, styles.default, style]}
			multiline={multiline}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
	},
	defaultSemiBold: {
		fontSize: 16,
		fontWeight: '600',
	},
	title: {
		fontSize: 32,
		fontWeight: '600',
	},
	subtitle: {
		fontSize: 20,
		fontWeight: '600',
	},
	link: {
		fontSize: 16,
		color: '#0a7ea4',
	},
});
