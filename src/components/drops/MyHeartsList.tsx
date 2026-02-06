import React from "react";
import { FlatList, Image, Linking, Pressable, Text, View } from "react-native";
import { useDropsStore } from "../../store/dropsStore";
import type { HeartedItem } from "../../types/drop";

export const MyHeartsList: React.FC = () => {
  const heartedItems = useDropsStore((state) => state.heartedItems);
  const removeHeartedItem = useDropsStore((state) => state.removeHeartedItem);

  const handleShop = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: HeartedItem }) => (
    <View className="flex-row items-center border-b border-slate-100 px-6 py-4">
      {/* Product Image */}
      <Image
        source={{ uri: item.photoURL }}
        className="h-16 w-16 rounded-xl bg-slate-100"
        resizeMode="cover"
      />

      {/* Info */}
      <View className="ml-3 flex-1">
        <Text className="text-[10px] tracking-wider text-slate-400 uppercase">
          {item.dropTitle}
        </Text>
        <Text className="mt-0.5 text-sm font-bold text-slate-900" numberOfLines={1}>
          {item.productName}
        </Text>

        {/* Actions */}
        <View className="mt-2 flex-row items-center gap-2">
          <Pressable
            onPress={() => handleShop(item.shopURL)}
            className="rounded-full border border-[#E8613C] px-3 py-1"
          >
            <Text className="text-[10px] font-bold tracking-wider text-[#E8613C]">
              SHOP NOW 🔗
            </Text>
          </Pressable>

          <Pressable
            onPress={() => removeHeartedItem(item.itemId)}
            className="rounded-full border border-slate-300 px-3 py-1"
          >
            <Text className="text-[10px] font-bold tracking-wider text-slate-400">
              REMOVE
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (heartedItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 py-20">
        <Text className="text-4xl">♡</Text>
        <Text className="mt-4 text-center text-base font-semibold text-slate-600">
          No hearted items yet
        </Text>
        <Text className="mt-2 text-center text-sm text-slate-400">
          Browse Raine Drops and tap the heart on products you love.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={heartedItems}
      keyExtractor={(item) => item.itemId}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};
