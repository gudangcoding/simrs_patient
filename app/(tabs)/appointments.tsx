import api from '@/src/lib/api/client';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

export default function AppointmentsScreen() {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [items, setItems] = useState<any[]>([]);
	const router = useRouter();

	const load = async () => {
		try {
			const res = await api.get('/appointments');
			setItems(res.data.data || []);
		} catch {}
		setLoading(false);
	};

	useEffect(() => {
		load();
	}, []);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await load();
		setRefreshing(false);
	}, []);

	const cancel = async (id: number) => {
		try {
			await api.put(`/appointments/${id}/cancel`);
			Alert.alert('Sukses', 'Janji temu dibatalkan');
			load();
		} catch (e: any) {
			Alert.alert('Gagal', e?.response?.data?.message || 'Tidak dapat membatalkan');
		}
	};

	if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

	return (
		<View style={{ flex: 1, padding: 16 }}>
			<TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 12, borderRadius: 8, marginBottom: 12 }} onPress={() => router.push('/appointments/book')}>
				<Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Buat Janji Temu</Text>
			</TouchableOpacity>
			<FlatList
				data={items}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
						<Text>{item.appointment_date} {item.appointment_time}</Text>
						<Text>Status: {item.status}</Text>
						<Text>Doctor: {item.doctor?.name}</Text>
						{item.status === 'scheduled' && (
							<TouchableOpacity onPress={() => cancel(item.id)} style={{ marginTop: 8 }}>
								<Text style={{ color: '#ef4444' }}>Batalkan</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
			/>
		</View>
	);
}
