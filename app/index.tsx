import { RootState } from '@/src/lib/store';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
	const { token, showOnboarding, firstLaunchChecked } = useSelector((s: RootState) => s.auth);
	if (!firstLaunchChecked) return null;
	if (showOnboarding) return <Redirect href="/onboarding" />;
	if (!token) return <Redirect href="/login" />;
	return <Redirect href="/(tabs)" />;
}
