import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/auth/AuthContext";
import { updateUserProfile } from "../../services/firebase/users";
import { useProfileSetupStore } from "../../store/profileSetupStore";
import { ChildForm } from "../../components/profile-setup/ChildForm";
import type { Child, DueDate } from "../../types/profile-setup";

const CHILD_COUNT_OPTIONS = [1, 2, 3, 4];

export default function EditChildrenScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const {    
    childCount,
    isExpecting,
    dueDate,
    children,
    setChildren
  } = useProfileSetupStore();

  const effectiveCount = Math.max(1, childCount);
  const [localChildCount, setLocalChildCount] = useState(effectiveCount);
  const [localChildren, setLocalChildren] = useState<Child[]>(() => {
    const len = Math.max(effectiveCount, children.length);
    return Array.from({ length: len }).map((_, i) => children[i] ?? { name: "", birthMonth: 0, birthYear: 0 });
  });
  const [localIsExpecting, setLocalIsExpecting] = useState(isExpecting);
  const [localDueDate, setLocalDueDate] = useState<DueDate | null>(dueDate);

  const canSave = useMemo(() => {
    if (localIsExpecting && (!localDueDate?.month || !localDueDate?.year)) {
      return false;
    }
    return localChildren.slice(0, localChildCount).every((child) => {
      return (
        Boolean(child?.name?.trim()) &&
        Number.isFinite(child?.birthMonth) &&
        (child?.birthMonth ?? 0) > 0 &&
        (child?.birthMonth ?? 0) <= 12 &&
        Number.isFinite(child?.birthYear) &&
        (child?.birthYear ?? 0) > 0
      );
    });
  }, [localChildCount, localIsExpecting, localDueDate, localChildren]);

  const updateChildCount = (count: number) => {
    if (count === localChildCount) return;
    const nextChildren: Child[] = Array.from({ length: count }).map((_, index) => {
      return localChildren[index] ?? { name: "", birthMonth: 0, birthYear: 0 };
    });
    setLocalChildCount(count);
    setLocalChildren(nextChildren);
  };

  const toggleExpecting = () => {
    setLocalIsExpecting(!localIsExpecting);
    if (localIsExpecting) {
      setLocalDueDate(null);
    }
  };

  const handleChildrenChange = (nextChildren: Child[]) => {
    setLocalChildren(nextChildren);
  };

  const handleDueDateChange = (nextDueDate: DueDate | null) => {
    setLocalDueDate(nextDueDate);
  };

  const handleSave = async () => {
    if (!canSave) return;

    const finalChildren = localChildren.slice(0, localChildCount);
    setChildren(localChildCount, finalChildren, localIsExpecting, localDueDate);

    if (user) {
      const dueDateStr = localDueDate
        ? `${localDueDate.month}-${localDueDate.year}`
        : null;
    
      await updateUserProfile(user.uid,{
        childCount: localChildCount,
        children: finalChildren,
        isExpecting: localIsExpecting,
        dueDate: dueDateStr
      });
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-14">
        <Pressable onPress={() => router.back()} className="active:opacity-70">
          <Text className="text-2xl text-slate-700">←</Text>
        </Pressable>
        <Text className="text-base font-semibold text-slate-800">
          Edit Children
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          className="active:opacity-70"
        >
          <Text
            className={`text-sm font-semibold ${
              canSave ? "text-orange-500" : "text-slate-400"
            }`}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-sm text-slate-600">
          How many children do you have?
        </Text>
        <View className="flex-row gap-2">
          {CHILD_COUNT_OPTIONS.map((count) => (
            <Pressable
              key={`count-${count}`}
              onPress={() => updateChildCount(count)}
              className={`flex-1 rounded-full border px-4 py-2 ${
                localChildCount === count
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200"
              }`}
            >
              <Text className="text-center text-sm font-semibold text-slate-700">
                {count === 4 ? "4+" : count}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-4">
          <Pressable
            onPress={toggleExpecting}
            className={`rounded-full border px-4 py-2 ${
              localIsExpecting ? "border-orange-500 bg-orange-50" : "border-slate-200"
            }`}
          >
            <Text className="text-center text-sm font-semibold text-slate-700">
              I&apos;m Expecting
            </Text>
          </Pressable>
        </View>

        <View className="mt-6 mb-6">
          <ChildForm
            childCount={localChildCount}
            childList={localChildren}
            isExpecting={localIsExpecting}
            dueDate={localDueDate}
            onChildrenChange={handleChildrenChange}
            onDueDateChange={handleDueDateChange}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
