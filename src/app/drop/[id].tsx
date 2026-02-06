import React from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDropById } from "../../services/drops";
import { useDropsStore } from "../../store/dropsStore";
import { DropItemCard } from "../../components/drops/DropItemCard";
import { SectionHeader } from "../../components/shared/SectionHeader";
import type { DropItem } from "../../types/drop";

export default function DropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const drop = getDropById(id);

  const heartedItems = useDropsStore((state) => state.heartedItems);
  const addHeartedItem = useDropsStore((state) => state.addHeartedItem);
  const removeHeartedItem = useDropsStore((state) => state.removeHeartedItem);

  if (!drop) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-400">Drop not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-semibold text-[#E8613C]">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const isItemHearted = (itemId: string) =>
    heartedItems.some((h) => h.itemId === itemId);

  const handleHeart = (item: DropItem, sectionId: string) => {
    if (isItemHearted(item.id)) {
      removeHeartedItem(item.id);
    } else {
      addHeartedItem({
        itemId: item.id,
        dropId: drop.id,
        dropTitle: drop.title,
        sectionId,
        productName: item.productName,
        photoURL: item.photoURL,
        shopURL: item.shopURL,
        heartedAt: new Date(),
      });
    }
  };

  const handleShop = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-16 pb-4">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-xl text-slate-600">←</Text>
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-xs font-bold tracking-[3px] text-slate-400 uppercase">
            THE DROP
          </Text>
          <Text
            className="text-xl text-[#E8613C]"
            style={{ fontFamily: "serif", fontStyle: "italic" }}
          >
            {drop.title}
          </Text>
        </View>
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-xl text-slate-600">✕</Text>
        </Pressable>
      </View>

      {/* Cover strip */}
      <View
        className="mx-6 h-2 rounded-full"
        style={{ backgroundColor: drop.coverColor }}
      />

      {/* Subtitle */}
      <Text className="mt-3 px-6 text-center text-sm text-slate-500">
        {drop.subtitle}
      </Text>

      {/* Sections */}
      <ScrollView
        className="mt-4 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {drop.sections.map((section) => (
          <View key={section.id}>
            <SectionHeader title={section.title} />
            {section.items.map((item) => (
              <DropItemCard
                key={item.id}
                item={item}
                dropId={drop.id}
                dropTitle={drop.title}
                sectionId={section.id}
                isHearted={isItemHearted(item.id)}
                onHeart={() => handleHeart(item, section.id)}
                onShop={() => handleShop(item.shopURL)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
