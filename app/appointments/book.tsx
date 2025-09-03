import api from '@/src/lib/api/client';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BookAppointmentScreen() {
	const router = useRouter();
	const [date, setDate] = useState(''); // YYYY-MM-DD
	const [departmentId, setDepartmentId] = useState<string>('');
	const [departments, setDepartments] = useState<any[]>([]);
	const [doctors, setDoctors] = useState<any[]>([]);
	const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
	const [timeSlots, setTimeSlots] = useState<any[]>([]);
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [complaint, setComplaint] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get('/departments');
				setDepartments(res.data.data || []);
			} catch {}
		})();
	}, []);

	const loadDoctors = async () => {
		if (!date) {
			Alert.alert('Tanggal wajib diisi', 'Isi tanggal dengan format YYYY-MM-DD');
			return;
		}
		setLoading(true);
		try {
			const res = await api.get('/available-doctors', { params: { date, department_id: departmentId || undefined } });
			setDoctors(res.data.data || []);
		} catch (e: any) {
			Alert.alert('Gagal memuat dokter', e?.response?.data?.message || 'Coba lagi');
		} finally {
			setLoading(false);
		}
	};

	const loadTimeSlots = async (doctorId: number) => {
		if (!date) return;
		setLoading(true);
		try {
			const res = await api.get(`/doctors/${doctorId}/schedules`, { params: { date } });
			setTimeSlots(res.data.data?.time_slots || []);
		} catch (e: any) {
			Alert.alert('Gagal memuat jadwal', e?.response?.data?.message || 'Coba lagi');
		} finally {
			setLoading(false);
		}
	};

	const submitBooking = async () => {
		if (!selectedDoctor || !selectedTime || !date || !complaint) {
			Alert.alert('Lengkapi data', 'Tanggal, dokter, jam, dan keluhan wajib diisi');
			return;
		}
		setLoading(true);
		try {
			await api.post('/appointments/book', {
				doctor_id: selectedDoctor.id,
				appointment_date: date,
				appointment_time: selectedTime,
				complaint,
			});
			Alert.alert('Sukses', 'Janji temu berhasil dibuat');
			router.back();
		} catch (e: any) {
			Alert.alert('Gagal', e?.response?.data?.message || 'Tidak dapat membuat janji temu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Buat Janji Temu</Text>
			<TextInput
				style={styles.input}
				placeholder="Tanggal (YYYY-MM-DD)"
				value={date}
				onChangeText={setDate}
			/>
			<TextInput
				style={styles.input}
				placeholder="ID Departemen (opsional)"
				value={departmentId}
				onChangeText={setDepartmentId}
			/>
			<TouchableOpacity style={styles.button} onPress={loadDoctors}>
				<Text style={styles.buttonText}>Cari Dokter Tersedia</Text>
			</TouchableOpacity>

			{loading && <ActivityIndicator style={{ marginVertical: 12 }} />}

			{doctors.length > 0 && (
				<View style={{ marginTop: 16 }}>
					<Text style={styles.sectionTitle}>Pilih Dokter</Text>
					<FlatList
						data={doctors}
						keyExtractor={(item) => String(item.id)}
						horizontal
						renderItem={({ item }) => (
							<TouchableOpacity
								style={[styles.chip, selectedDoctor?.id === item.id && styles.chipActive]}
								onPress={() => {
									setSelectedDoctor(item);
									setSelectedTime('');
									loadTimeSlots(item.id);
								}}
							>
								<Text style={[styles.chipText, selectedDoctor?.id === item.id && styles.chipTextActive]}>{item.name}</Text>
							</TouchableOpacity>
						)}
					/>
				</View>
			)}

			{timeSlots.length > 0 && (
				<View style={{ marginTop: 16 }}>
					<Text style={styles.sectionTitle}>Pilih Waktu</Text>
					<FlatList
						data={timeSlots}
						keyExtractor={(item) => item.time}
						horizontal
						renderItem={({ item }) => (
							<TouchableOpacity
								style={[styles.chip, selectedTime === item.time && styles.chipActive, !item.available && { opacity: 0.5 }]}
								disabled={!item.available}
								onPress={() => setSelectedTime(item.time)}
							>
								<Text style={[styles.chipText, selectedTime === item.time && styles.chipTextActive]}>{item.formatted_time}</Text>
							</TouchableOpacity>
						)}
					/>
				</View>
			)}

			<TextInput
				style={[styles.input, { height: 100 }]}
				placeholder="Keluhan"
				value={complaint}
				multiline
				onChangeText={setComplaint}
			/>

			<TouchableOpacity style={[styles.button, { backgroundColor: '#16a34a' }]} onPress={submitBooking} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Memproses...' : 'Buat Janji Temu'}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
	sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
	input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
	button: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
	buttonText: { color: '#fff', fontWeight: '600' },
	chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
	chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
	chipText: { color: '#111' },
	chipTextActive: { color: '#fff' },
});
