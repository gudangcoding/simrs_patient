import api from '@/src/lib/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

export type PatientProfile = {
	id: number;
	name: string;
	email: string;
	phone?: string;
	birth_date?: string;
	gender?: string;
	address?: string;
};

export type AuthState = {
	status: 'idle' | 'loading' | 'authenticated' | 'error';
	token: string | null;
	profile: PatientProfile | null;
	error?: string;
	firstLaunchChecked: boolean;
	showOnboarding: boolean;
};

const initialState: AuthState = {
	status: 'idle',
	token: null,
	profile: null,
	firstLaunchChecked: false,
	showOnboarding: true,
};

const ONBOARDING_KEY = 'onboarding_seen';

export const checkFirstLaunch = createAsyncThunk('auth/checkFirstLaunch', async () => {
	const seen = await SecureStore.getItemAsync(ONBOARDING_KEY);
	return seen !== 'true';
});

export const setOnboardingSeen = createAsyncThunk('auth/setOnboardingSeen', async () => {
	await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
	return true;
});

export const loadToken = createAsyncThunk('auth/loadToken', async () => {
	const token = await SecureStore.getItemAsync('api_token');
	return token || null;
});

export const login = createAsyncThunk(
	'auth/login',
	async (payload: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const { data } = await api.post('/login', payload);
			if (data?.success && data?.data?.token) {
				await SecureStore.setItemAsync('api_token', data.data.token);
				return data.data.token as string;
			}
			return rejectWithValue('Login failed');
		} catch (err: any) {
			return rejectWithValue(err?.response?.data?.message || 'Login failed');
		}
	}
);

export const register = createAsyncThunk(
	'auth/register',
	async (
		payload: { name: string; email: string; password: string; password_confirmation: string; phone: string; birth_date: string; gender: 'male' | 'female'; address?: string },
		{ rejectWithValue }
	) => {
		try {
			const { data } = await api.post('/register', payload);
			if (data?.success && data?.data?.token) {
				await SecureStore.setItemAsync('api_token', data.data.token);
				return data.data.token as string;
			}
			return rejectWithValue('Register failed');
		} catch (err: any) {
			return rejectWithValue(err?.response?.data?.message || 'Register failed');
		}
	}
);

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/profile');
		return data.data as PatientProfile;
	} catch (err: any) {
		return rejectWithValue(err?.response?.data?.message || 'Failed to fetch profile');
	}
});

export const logout = createAsyncThunk('auth/logout', async () => {
	try {
		await api.post('/logout');
	} catch {}
	await SecureStore.deleteItemAsync('api_token');
	return true;
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(checkFirstLaunch.fulfilled, (state, action) => {
				state.showOnboarding = action.payload;
				state.firstLaunchChecked = true;
			})
			.addCase(setOnboardingSeen.fulfilled, (state) => {
				state.showOnboarding = false;
			})
			.addCase(loadToken.fulfilled, (state, action) => {
				state.token = action.payload;
				state.status = action.payload ? 'authenticated' : 'idle';
			})
			.addCase(login.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = 'authenticated';
				state.token = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.status = 'error';
				state.error = (action.payload as string) || 'Login failed';
			})
			.addCase(register.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.status = 'authenticated';
				state.token = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.status = 'error';
				state.error = (action.payload as string) || 'Register failed';
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.profile = action.payload;
			})
			.addCase(logout.fulfilled, (state) => {
				state.status = 'idle';
				state.token = null;
				state.profile = null;
			});
	},
});

export default authSlice.reducer;
