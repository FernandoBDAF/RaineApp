import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useAuth } from '../../context/auth/AuthContext';
import { updateUserProfile } from '../../services/firebase/users';
import { uploadProfilePhoto } from '../../services/profile';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { Input } from '../../components/ui/Input';
import { lookupZipCode } from '../../services/location';

function getChildAge(birthMonth: number, birthYear: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0 && months <= 0) return 'Newborn';
  if (years < 1) return `${months}mo`;
  if (years === 1 && months === 0) return '1 year';
  if (months === 0) return `${years} years`;
  return `${years}y ${months}mo`;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const storeFirstName = useProfileSetupStore((s) => s.firstName);
  const storeLastInitial = useProfileSetupStore((s) => s.lastInitial);
  const storePhotoURL = useProfileSetupStore((s) => s.photoURL);
  const storeGeneratedBio = useProfileSetupStore((s) => s.generatedBio);
  const storeZipCode = useProfileSetupStore((s) => s.zipCode);
  const storeCity = useProfileSetupStore((s) => s.city);
  const storeState = useProfileSetupStore((s) => s.state);
  const children = useProfileSetupStore((s) => s.children);
  const childCount = useProfileSetupStore((s) => s.childCount);
  const isExpecting = useProfileSetupStore((s) => s.isExpecting);
  const dueDate = useProfileSetupStore((s) => s.dueDate);

  const setName = useProfileSetupStore((s) => s.setName);
  const setBio = useProfileSetupStore((s) => s.setBio);
  const setLocation = useProfileSetupStore((s) => s.setLocation);
  const setPhoto = useProfileSetupStore((s) => s.setPhoto);

  const [firstName, setFirstName] = useState(storeFirstName);
  const [lastInitial, setLastInitial] = useState(storeLastInitial);
  const [bio, setBioText] = useState(storeGeneratedBio);
  const [zipCode, setZipCode] = useState(storeZipCode);
  const [city, setCity] = useState(storeCity);
  const [state, setState] = useState(storeState);
  const [locationError, setLocationError] = useState<string | undefined>();
  const [locationLoading, setLocationLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9
    });

    if (!result.canceled && result.assets?.[0]?.uri && user) {
      setPhotoLoading(true);
      try {
        const context = ImageManipulator.manipulate(result.assets[0].uri);
        context.resize({ width: 800 });
        const image = await context.renderAsync();
        const manipulated = await image.saveAsync({
          compress: 0.8,
          format: SaveFormat.JPEG
        });
        const remoteUrl = await uploadProfilePhoto(user.uid, manipulated.uri);
        setPhoto(remoteUrl);
      } finally {
        setPhotoLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      setName(firstName, lastInitial);
      if (bio !== storeGeneratedBio) {
        setBio(bio, true);
      }
      if (zipCode !== storeZipCode || city !== storeCity || state !== storeState) {
        const county = useProfileSetupStore.getState().county;
        setLocation(zipCode, city, state, county);
      }

      if (user) {
        const store = useProfileSetupStore.getState();
        await updateUserProfile(user.uid, {
          firstName: store.firstName,
          lastInitial: store.lastInitial,
          photoURL: store.photoURL,
          generatedBio: store.generatedBio,
          bioApproved: store.bioApproved,
          zipCode: store.zipCode,
          city: store.city,
          state: store.state,
          county: store.county,
          dueDate: store.dueDate
        });
      }
      Alert.alert('Success', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Could not save profile. Please try again.'
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleZipLookup = async () => {
    if (zipCode.length !== 5) {
      setLocationError('Enter a 5-digit zip code');
      return;
    }
    setLocationError(undefined);
    setLocationLoading(true);
    try {
      const result = await lookupZipCode(zipCode);
      if (!result.valid) {
        setLocationError(result.error ?? 'Invalid zip code');
        return;
      }
      setCity(result.city ?? '');
      setState(result.state ?? '');
      setLocation(zipCode, result.city ?? '', result.state ?? '', result.county ?? '');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRegenerateBio = () => {
    // Placeholder: In production this would call the AI bio generator
    const placeholderBios = [
      'A nature-loving mom navigating chaos with coffee and curiosity.',
      'Two kids, one dog, and a dream of sleeping past 7am.',
      'Former globe-trotter turned playground explorer. Still loves a good adventure.'
    ];
    const randomBio = placeholderBios[Math.floor(Math.random() * placeholderBios.length)];
    setBioText(randomBio);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-16">
        <Pressable onPress={() => router.back()} className="active:opacity-70">
          <Text className="text-2xl text-slate-700">←</Text>
        </Pressable>
        <Text className="text-base font-semibold text-slate-800">Edit Profile</Text>
        <Pressable onPress={handleSave} disabled={saveLoading} className="active:opacity-70">
          {saveLoading ? (
            <ActivityIndicator size="small" color="#E8613C" />
          ) : (
            <Text className="text-sm font-semibold text-orange-500">Save</Text>
          )}
        </Pressable>
      </View>
      <ScrollView className="flex-1 bg-white">
        {/* Photo */}
        <View className="items-center py-6">
          <Pressable
            onPress={handleChangePhoto}
            disabled={photoLoading}
            className="active:opacity-80"
          >
            {storePhotoURL ? (
              <Image
                source={{ uri: storePhotoURL }}
                className="h-36 w-36 rounded-full bg-slate-100"
              />
            ) : (
              <View className="h-36 w-36 items-center justify-center rounded-full bg-slate-100">
                <Text className="text-5xl">👤</Text>
              </View>
            )}
            <View
              className={`absolute bottom-0 right-0 rounded-full px-3 py-1.5 ${
                photoLoading ? 'bg-slate-400' : 'bg-orange-500'
              }`}
            >
              <Text className="text-[10px] font-bold uppercase text-white">
                {photoLoading ? '...' : 'Change'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View className="gap-5 px-6">
          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Your first name"
          />
          <Input
            label="Last Initial"
            value={lastInitial}
            onChangeText={(text) => setLastInitial(text.slice(0, 1).toUpperCase())}
            placeholder="e.g. S"
            maxLength={1}
          />

          {/* Location */}
          <View className="gap-2">
            <Text className="text-sm text-slate-600">Location</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  value={zipCode}
                  onChangeText={(text) => {
                    setZipCode(text.replace(/\D/g, '').slice(0, 5));
                    setLocationError(undefined);
                  }}
                  placeholder="Zip code"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <Pressable
                onPress={handleZipLookup}
                disabled={locationLoading || zipCode.length !== 5}
                className="self-end rounded-full bg-orange-50 px-4 py-3 active:bg-orange-100"
              >
                <Text
                  className={`text-xs font-semibold text-orange-500 ${
                    zipCode.length === 5 ? '' : 'opacity-50'
                  }`}
                >
                  {locationLoading ? '...' : 'Lookup'}
                </Text>
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input value={city} onChangeText={setCity} placeholder="City" />
              </View>
              <View className="w-25">
                <Input
                  value={state}
                  onChangeText={(text) => setState(text.slice(0, 2).toUpperCase())}
                  placeholder="State"
                  maxLength={2}
                />
              </View>
            </View>
            {locationError && <Text className="text-sm text-red-500">{locationError}</Text>}
          </View>

          {/* Bio */}
          <View className="gap-2">
            <Text className="text-sm text-slate-600">Bio</Text>
            <View className="rounded-xl bg-slate-50 p-4">
              <Text className="text-base italic leading-6 text-slate-700">
                {bio ? `"${bio}"` : 'No bio yet'}
              </Text>
            </View>
            <Pressable
              onPress={handleRegenerateBio}
              className="mt-1 self-start rounded-full bg-orange-50 px-4 py-2 active:bg-orange-100"
            >
              <Text className="text-xs font-semibold text-orange-500">Regenerate Bio</Text>
            </Pressable>
          </View>

          {/* Children */}
          <View className="gap-2">
            <Text className="text-sm text-slate-600">Children</Text>
            <View className="rounded-xl bg-slate-50 p-4">
              {children.length > 0 || isExpecting ? (
                <View className="gap-2">
                  {children.slice(0, childCount).map((child, index) => (
                    <View key={`child-${index}`} className="flex-row items-center justify-between">
                      <Text className="text-base text-slate-700">
                        {child?.name || `Child ${index + 1}`}
                      </Text>
                      <Text className="text-sm text-slate-400">
                        {getChildAge(child?.birthMonth ?? 0, child?.birthYear ?? 0)}
                      </Text>
                    </View>
                  ))}
                  {isExpecting && dueDate ? (
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-slate-700">Baby on the way</Text>
                      <Text className="text-sm text-slate-400">
                        Due {dueDate.month}/{dueDate.year}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <Text className="text-base text-slate-500">No children added yet</Text>
              )}
            </View>
            <Pressable
              onPress={() => router.push('/profile/edit-children')}
              className="mt-1 self-start rounded-full bg-orange-50 px-4 py-2 active:bg-orange-100"
            >
              <Text className="text-xs font-semibold text-orange-500">Edit Children</Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom spacer */}
        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
