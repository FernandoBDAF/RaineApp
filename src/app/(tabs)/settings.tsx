import React from 'react';
import { Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../features/auth/AuthContext';
import { useAppStore } from '../../store/appStore';
import { getFcmToken, requestNotificationPermission } from '../../services/firebase/notifications';
import { updateUserFcmToken } from '../../services/firebase/users';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const notificationsEnabled = useAppStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((state) => state.setNotificationsEnabled);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        return;
      }
      if (user?.uid) {
        const token = await getFcmToken();
        if (token) {
          await updateUserFcmToken(user.uid, token);
        }
      }
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <View className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold text-slate-900">Settings</Text>
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-slate-700">Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} />
        </View>
        <Button title="Manage subscription" onPress={() => router.push('/subscription')} />
        <Button title="Sign out" onPress={logout} variant="outline" />
      </View>
    </View>
  );
}
