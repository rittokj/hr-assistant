/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Accore Lab
export const primaryColor = '#007AFF';
export const primaryColorLight = '#E5F2FF';

// Art Nuveau Decor
// export const primaryColor = '#BE9976';
// export const primaryColorLight = '#f8f5f1';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
	light: {
		text: '#11181C',
		background: '#fff',
		tint: tintColorLight,
		icon: '#687076',
		placeholder: '#999',
		tabIconDefault: '#687076',
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: '#ECEDEE',
		background: '#151718',
		tint: tintColorDark,
		icon: '#9BA1A6',
		placeholder: '#999',
		tabIconDefault: '#9BA1A6',
		tabIconSelected: tintColorDark,
	},
};
