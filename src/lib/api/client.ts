import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.2:8000/api/patient';

export const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 20000,
});

api.interceptors.request.use(async (config) => {
	try {
		const token = await SecureStore.getItemAsync('api_token');
		if (token) {
			config.headers = config.headers || {} as any;
			(config.headers as any).Authorization = `Bearer ${token}`;
		}
	} catch {}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error)
);

export default api;
