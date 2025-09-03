import { store } from '@/src/lib/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import { checkFirstLaunch, loadToken } from '@/src/lib/store/slices/authSlice';
import { useEffect } from 'react';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		store.dispatch(checkFirstLaunch());
		store.dispatch(loadToken());
	}, []);

	if (!loaded) {
		return null;
	}

	return (
		<Provider store={store}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="onboarding" options={{ headerShown: false }} />
					<Stack.Screen name="login" options={{ headerShown: false }} />
					<Stack.Screen name="register" options={{ title: 'Register' }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</Provider>
	);
}
