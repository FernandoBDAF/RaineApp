import React, { useMemo } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChildForm } from '../../components/profile-setup/ChildForm';
import { ContinueButton } from '../../components/profile-setup/ContinueButton';
import { SetupHeader } from '../../components/profile-setup/SetupHeader';
import { useProfileSetupStore } from '../../store/profileSetupStore';
import type { Child, DueDate } from '../../types/profile-setup';

const CHILD_COUNT_OPTIONS = [1, 2, 3, 4];

export default function ChildrenScreen() {
  const router = useRouter();
  const { childCount, isExpecting, dueDate, children, setChildren, setCurrentStep } =
    useProfileSetupStore();

  const canContinue = useMemo(() => {  
    if (isExpecting && (!dueDate?.month || !dueDate?.year)) {
      return false;
    }
    return children.slice(0, childCount).every((child) => {
      return (
        Boolean(child?.name?.trim()) &&
        Number.isFinite(child?.birthMonth) &&
        child.birthMonth > 0 &&
        child.birthMonth <= 12 &&
        Number.isFinite(child?.birthYear) &&
        child.birthYear > 0
      );
    });
  }, [childCount, isExpecting, dueDate, children]);

  const updateChildCount = (count: number) => {
    if (count === childCount) {
      setChildren(0, [], isExpecting, dueDate);
      return;
    }
    const nextChildren: Child[] = Array.from({ length: count }).map((_, index) => {
      return children[index] ?? { name: '', birthMonth: 0, birthYear: 0 };
    });
    setChildren(count, nextChildren, isExpecting, dueDate);
  };

  const toggleExpecting = () => {
    setChildren(childCount, children, !isExpecting, isExpecting ? null : dueDate);
  };

  const handleChildrenChange = (nextChildren: Child[]) => {
    setChildren(childCount, nextChildren, isExpecting, dueDate);
  };

  const handleDueDateChange = (nextDueDate: DueDate | null) => {
    setChildren(childCount, children, isExpecting, nextDueDate);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    setCurrentStep(6);
    router.push('/(profile-setup)/before-motherhood');
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <SetupHeader
        headline="Tell us about your children"
        subheadline="HOW MANY CHILDREN DO YOU HAVE?"
      />
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row gap-2">
          {CHILD_COUNT_OPTIONS.map((count) => (
            <Pressable
              key={`count-${count}`}
              onPress={() => updateChildCount(count)}
              className={`flex-1 rounded-full border px-4 py-2 ${
                childCount === count ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
              }`}
            >
              <Text className="text-center text-sm font-semibold text-slate-700">
                {count === 4 ? '4+' : count}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-4">
          <Pressable
            onPress={toggleExpecting}
            className={`rounded-full border px-4 py-2 ${
              isExpecting ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
            }`}
          >
            <Text className="text-center text-sm font-semibold text-slate-700">I'm Expecting</Text>
          </Pressable>
        </View>

        <View className="mt-6 mb-6">
          <ChildForm
            childCount={childCount}
            children={children}
            isExpecting={isExpecting}
            dueDate={dueDate}
            onChildrenChange={handleChildrenChange}
            onDueDateChange={handleDueDateChange}
          />
        </View>
      </ScrollView>
      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </KeyboardAvoidingView>
  );
}
