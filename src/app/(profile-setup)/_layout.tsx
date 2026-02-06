import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '../../components/profile-setup/ProgressDots';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import { STEP_TO_ROUTE } from '../../constants/profile-options';

export default function ProfileSetupLayout() {
  const currentStep = useProfileSetupStore((state) => state.currentStep);
  const { decrementStep } = useProfileSetupStore();
  const router = useRouter();
  const canGoBack = currentStep > 1;

  const handleBack = () => {
    const previousStep = currentStep - 1;
    const route = STEP_TO_ROUTE[previousStep];
    if (route) {
      decrementStep();
      router.replace(route as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-2">
        {canGoBack ? (
          <TouchableOpacity onPress={handleBack} className="w-10 h-10 items-center justify-center">
            <Ionicons name="chevron-back" size={24} color="#334155" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
        <View className="flex-1">
          <ProgressDots currentStep={currentStep} />
        </View>
        <View className="w-10" />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_right'
        }}
      />
    </SafeAreaView>
  );
}
