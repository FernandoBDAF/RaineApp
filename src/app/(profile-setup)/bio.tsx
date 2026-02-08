import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { ContinueButton } from '../../components/profile-setup/ContinueButton';
import { SetupHeader } from '../../components/profile-setup/SetupHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { generateBio } from '../../services/bio';
import { saveProfileSetup } from '../../services/profile';
import { useAuth } from '../../features/auth/AuthContext';

export default function BioScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  const payload = useProfileSetupStore(
    useShallow((state) => ({
      firstName: state.firstName,
      lastInitial: state.lastInitial,
      photoURL: state.photoURL,
      zipCode: state.zipCode,
      city: state.city,
      state: state.state,
      county: state.county,
      cityFeel: state.cityFeel,
      childCount: state.childCount,
      isExpecting: state.isExpecting,
      dueDate: state.dueDate,
      children: state.children,
      beforeMotherhood: state.beforeMotherhood,
      perfectWeekend: state.perfectWeekend,
      feelYourself: state.feelYourself,
      hardTruths: state.hardTruths,
      unexpectedJoys: state.unexpectedJoys,
      aesthetic: state.aesthetic,
      momFriendStyle: state.momFriendStyle,
      whatBroughtYou: state.whatBroughtYou,
      generatedBio: state.generatedBio,
      bioApproved: state.bioApproved,
      currentStep: state.currentStep,
      completed: state.completed
    }))
  );
  const setBio = useProfileSetupStore((state) => state.setBio);
  const completeSetup = useProfileSetupStore((state) => state.completeSetup);
  const setCurrentStep = useProfileSetupStore((state) => state.setCurrentStep);
  const generatedBio = payload.generatedBio;

  useEffect(() => {
    setCurrentStep(14);
  }, [setCurrentStep]);

  useEffect(() => {
    if (generatedBio) {
      return;
    }
    const run = async () => {
      setLoading(true);
      try {
        const bio = await generateBio(payload);
        setBio(bio, false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [generatedBio, payload, setBio]);

  const handleNotQuite = () => {
    setEditing(true);
    setApproved(false);
    setEditedBio(generatedBio);
  };

  const handleThatsMe = () => {
    setApproved(true);
    setEditing(false);
  };

  const handleComplete = async () => {
    if (!user) {
      return;
    }
    setSubmitting(true);
    try {
      const finalBio = editing ? editedBio : generatedBio;
      setBio(finalBio, true);
      await saveProfileSetup(user.uid, { ...payload, generatedBio: finalBio, bioApproved: true });
      completeSetup();
      router.replace('/welcome/welcome');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SetupHeader headline="Here's your bio" />
      <View className="flex-1 px-6 pt-6">
        {loading ? (
          <View className="mt-10 items-center">
            <LoadingSpinner />
            <Text className="mt-3 text-sm text-slate-500">Generating your bio...</Text>
          </View>
        ) : editing ? (
          <View className="rounded-lg border border-orange-500 p-4">
            <TextInput
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
              className="text-base italic text-slate-700"
              autoFocus
            />
          </View>
        ) : (
          <View className="rounded-lg border border-slate-200 p-4">
            <Text className="text-base italic text-slate-700">{generatedBio}</Text>
          </View>
        )}

        {!editing && !loading ? (
          <>
            <Text className="mt-6 text-center text-sm text-slate-600">
              Does this sound like you?
            </Text>
            <View className="mt-3 flex-row gap-3">
              <Pressable
                onPress={handleNotQuite}
                className="flex-1 rounded-lg border border-slate-300 py-3"
              >
                <Text className="text-center text-sm font-semibold text-slate-700">Not quite</Text>
              </Pressable>
              <Pressable
                onPress={handleThatsMe}
                className={`flex-1 rounded-lg py-3 ${
                  approved ? 'bg-orange-500' : 'border border-slate-300'
                }`}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    approved ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  That&apos;s me!
                </Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {editing ? (
          <Pressable
            onPress={() => {
              setEditing(false);
              setApproved(true);
              setBio(editedBio, false);
            }}
            className="mt-4 self-end rounded-lg bg-orange-500 px-6 py-3"
          >
            <Text className="text-center text-sm font-semibold text-white">Save changes</Text>
          </Pressable>
        ) : null}
      </View>
      <ContinueButton
        onPress={handleComplete}
        disabled={(!approved && !editing) || submitting || loading}
        label={submitting ? 'SAVING...' : 'COMPLETE'}
      />
    </View>
  );
}
