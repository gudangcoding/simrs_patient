import { useAppDispatch } from '@/src/lib/store';
import { fetchProfile, register, setOnboardingSeen } from '@/src/lib/store/slices/authSlice';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		phone: '',
		birth_date: '', // YYYY-MM-DD
		gender: 'male' as 'male' | 'female',
		address: '',
	});
	const [loading, setLoading] = useState(false);

	const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

	const onSubmit = async () => {
		try {
			setLoading(true);
			await dispatch(setOnboardingSeen());
			const result = await dispatch(register(form as any));
			if ((result as any).error) throw new Error((result as any).payload || 'Registrasi gagal');
			await dispatch(fetchProfile());
			router.replace('/(tabs)');
		} catch (e: any) {
			Alert.alert('Gagal', e.message || 'Periksa input Anda');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={{ uri: 'https://raw.githubusercontent.com/expo/expo/main/.github/resources/banner.png' }} style={styles.logo} resizeMode="contain" />
			<Text style={styles.title}>Daftar Akun</Text>
			<TextInput style={styles.input} placeholder="Nama Lengkap" value={form.name} onChangeText={(v) => update('name', v)} />
			<TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => update('email', v)} />
			<TextInput style={styles.input} placeholder="No. HP" value={form.phone} onChangeText={(v) => update('phone', v)} />
			<TextInput style={styles.input} placeholder="Tanggal Lahir (YYYY-MM-DD)" value={form.birth_date} onChangeText={(v) => update('birth_date', v)} />
			<TextInput style={styles.input} placeholder="Jenis Kelamin (male/female)" value={form.gender} onChangeText={(v) => update('gender', v as any)} />
			<TextInput style={styles.input} placeholder="Alamat" value={form.address} onChangeText={(v) => update('address', v)} />
			<TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={(v) => update('password', v)} />
			<TextInput style={styles.input} placeholder="Konfirmasi Password" secureTextEntry value={form.password_confirmation} onChangeText={(v) => update('password_confirmation', v)} />
			<TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Memproses...' : 'Daftar'}</Text>
			</TouchableOpacity>
			<Text style={{ textAlign: 'center', marginTop: 8 }}>
				Sudah punya akun? <Link href="/login">Login</Link>
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, justifyContent: 'center' },
	logo: { width: '100%', height: 80, marginBottom: 12 },
	title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
	input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 },
	button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
	buttonText: { color: '#fff', fontWeight: '600' },
});
