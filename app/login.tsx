import { useAppDispatch } from '@/src/lib/store';
import { fetchProfile, login } from '@/src/lib/store/slices/authSlice';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState('patient@example.com');
	const [password, setPassword] = useState('password123');
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		try {
			setLoading(true);
			const result = await dispatch(login({ email, password }));
			if ((result as any).error) {
				throw new Error((result as any).payload || 'Login gagal');
			}
			await dispatch(fetchProfile());
			router.replace('/(tabs)');
		} catch (e: any) {
			Alert.alert('Login gagal', e.message || 'Silakan periksa email/password');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={{ uri: 'https://raw.githubusercontent.com/expo/expo/main/.github/resources/banner.png' }} style={styles.logo} resizeMode="contain" />
			<Text style={styles.title}>Patient Login</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				keyboardType="email-address"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
			</TouchableOpacity>
			<Text style={{ textAlign: 'center', marginTop: 8 }}>
				Belum punya akun? <Link href="/register">Daftar</Link>
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
	},
	logo: { width: '100%', height: 80, marginBottom: 12 },
	title: {
		fontSize: 24,
		fontWeight: '600',
		marginBottom: 24,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
	},
	button: {
		backgroundColor: '#2563eb',
		padding: 14,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: '600',
	},
});
