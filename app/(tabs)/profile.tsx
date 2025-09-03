import { RootState, useAppDispatch } from '@/src/lib/store';
import { fetchProfile, logout } from '@/src/lib/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function ProfileScreen() {
	const { profile } = useSelector((s: RootState) => s.auth);
	const dispatch = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		dispatch(fetchProfile());
	}, [dispatch]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>My Profile</Text>
			<Text>Name: {profile?.name}</Text>
			<Text>Email: {profile?.email}</Text>
			<Text>Phone: {profile?.phone || '-'}</Text>
			<TouchableOpacity
				style={styles.button}
				onPress={async () => {
					await dispatch(logout());
					router.replace('/login');
				}}
			>
				<Text style={styles.buttonText}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
	button: { backgroundColor: '#ef4444', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
	buttonText: { color: '#fff', fontWeight: '600' },
});
