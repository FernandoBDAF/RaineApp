import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../context/auth/AuthContext';
import { listenToUserProfile, updateUserProfile } from '../../services/firebase/users';
import type { UserProfile } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = listenToUserProfile(user.uid, (nextProfile) => {
      setProfile(nextProfile);
      setDisplayName(nextProfile?.displayName ?? '');
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      return;
    }
    await updateUserProfile(user.uid, { displayName });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold text-slate-900">Profile</Text>
      <View className="mt-6 space-y-4">
        <Input label="Email" value={profile?.email ?? user?.email ?? ''} editable={false} />
        <Input label="Display Name" value={displayName} onChangeText={setDisplayName} />
        <Button title="Save changes" onPress={handleSave} />
      </View>
    </View>
  );
}
