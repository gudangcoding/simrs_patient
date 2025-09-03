import api from '@/src/lib/api/client';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function NotificationsScreen() {
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get('/notifications');
				setItems(res.data.data || []);
			} catch {}
			setLoading(false);
		})();
	}, []);

	if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

	return (
		<View style={{ flex: 1, padding: 16 }}>
			<FlatList
				data={items}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
						<Text style={{ fontWeight: '600' }}>{item.title}</Text>
						<Text>{item.message}</Text>
						<Text style={{ color: '#666' }}>{new Date(item.created_at).toLocaleString()}</Text>
					</View>
				)}
			/>
		</View>
	);
}
