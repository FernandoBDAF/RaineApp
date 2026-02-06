import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import type { DropItem } from "../../types/drop";

interface DropItemCardProps {
  item: DropItem;
  dropId: string;
  dropTitle: string;
  sectionId: string;
  isHearted: boolean;
  onHeart: () => void;
  onShop: () => void;
}

export const DropItemCard: React.FC<DropItemCardProps> = ({
  item,
  isHearted,
  onHeart,
  onShop,
}) => {
  return (
    <View className="flex-row border-b border-slate-100 px-6 py-4">
      {/* Product Photo */}
      <Image
        source={{ uri: item.photoURL }}
        className="h-24 w-24 rounded-xl bg-slate-100"
        resizeMode="cover"
      />

      {/* Info */}
      <View className="ml-3 flex-1 justify-center">
        <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
          {item.productName}
        </Text>
        {item.brand ? (
          <Text className="mt-0.5 text-xs text-slate-400">{item.brand}</Text>
        ) : null}
        <Text className="mt-1 text-xs leading-4 text-slate-600" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Actions */}
        <View className="mt-2 flex-row items-center gap-3">
          <Pressable onPress={onHeart}>
            <Text className={`text-lg ${isHearted ? "text-[#E8613C]" : "text-slate-300"}`}>
              {isHearted ? "♥" : "♡"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onShop}
            className="flex-row items-center rounded-full border border-[#E8613C] px-3 py-1"
          >
            <Text className="text-xs font-semibold text-[#E8613C]">
              Shop 🔗
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
