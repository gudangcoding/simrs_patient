import api from '@/src/lib/api/client';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get('/dashboard');
				setData(res.data.data);
			} catch (e) {
				// ignore
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Dashboard</Text>
			<Text>Total Appointments: {data?.total_appointments}</Text>
			<Text>Upcoming Appointments: {data?.upcoming_appointments}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});
