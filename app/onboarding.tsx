import { useAppDispatch } from '@/src/lib/store';
import { setOnboardingSeen } from '@/src/lib/store/slices/authSlice';
import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
	{ key: 's1', title: 'Selamat Datang', desc: 'Aplikasi SIMRS Patient untuk memudahkan layanan kesehatan.', image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200&auto=format&fit=crop' },
	{ key: 's2', title: 'Janji Temu', desc: 'Pesan janji temu dengan dokter secara cepat dan mudah.', image: 'https://images.unsplash.com/photo-1580281657527-47f249e8f8a3?q=80&w=1200&auto=format&fit=crop' },
	{ key: 's3', title: 'Rekam Medis', desc: 'Lihat riwayat medis, resep, dan hasil lab Anda.', image: 'https://images.unsplash.com/photo-1581594693702-fbdc8a6863be?q=80&w=1200&auto=format&fit=crop' },
];

export default function Onboarding() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const listRef = useRef<FlatList>(null);
	const [index, setIndex] = useState(0);

	const next = () => {
		if (index < slides.length - 1) {
			listRef.current?.scrollToIndex({ index: index + 1, animated: true });
			setIndex(index + 1);
		} else {
			skip();
		}
	};

	const skip = async () => {
		await dispatch(setOnboardingSeen());
		router.replace('/register');
	};

	return (
		<View style={styles.container}>
			<FlatList
				ref={listRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				data={slides}
				keyExtractor={(item) => item.key}
				renderItem={({ item }) => (
					<View style={[styles.slide, { width }]}>
						<Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.desc}>{item.desc}</Text>
					</View>
				)}
			/>
			<View style={styles.footer}>
				<View style={styles.dots}>
					{slides.map((_, i) => (
						<View key={i} style={[styles.dot, i === index && styles.dotActive]} />
					))}
				</View>
				<TouchableOpacity onPress={skip} style={[styles.button, { backgroundColor: '#6b7280' }]}>
					<Text style={styles.buttonText}>Skip</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={next} style={styles.button}>
					<Text style={styles.buttonText}>{index < slides.length - 1 ? 'Next' : 'Mulai'}</Text>
				</TouchableOpacity>
			</View>
			<View style={{ alignItems: 'center', marginTop: 12 }}>
				<Text>
					Sudah punya akun? <Link href="/login">Login</Link>
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingTop: 40 },
	slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
	image: { width: width - 48, height: 260, borderRadius: 16, marginBottom: 16 },
	title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
	desc: { fontSize: 16, textAlign: 'center', color: '#374151' },
	footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 },
	dots: { position: 'absolute', left: 16, flexDirection: 'row', gap: 6 },
	dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db' },
	dotActive: { backgroundColor: '#2563eb' },
	button: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
	buttonText: { color: '#fff', fontWeight: '600' },
});
