import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useDropsStore } from "../../store/dropsStore";
import { getDrops } from "../../services/drops";
import { TabSwitcher } from "../../components/shared/TabSwitcher";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterPills } from "../../components/shared/FilterPills";
import { DropCoverCard } from "../../components/drops/DropCoverCard";
import { MyHeartsList } from "../../components/drops/MyHeartsList";
import type { Drop, DropCategory } from "../../types/drop";

const CATEGORIES: DropCategory[] = [
  "NEWBORN",
  "TODDLER",
  "FEEDING",
  "WELLNESS",
  "LIFESTYLE",
  "GEAR",
];

export default function DropsScreen() {
  const router = useRouter();
  const heartedItems = useDropsStore((state) => state.heartedItems);

  const [activeTab, setActiveTab] = useState("raine-drops");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allDrops = getDrops();

  const filteredDrops = useMemo(() => {
    let result = allDrops;

    if (selectedCategory) {
      result = result.filter((d) => d.category === selectedCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((d) => d.title.toLowerCase().includes(query));
    }

    return result;
  }, [allDrops, selectedCategory, search]);

  const tabs = [
    { id: "raine-drops", label: "RAINE DROPS" },
    { id: "my-hearts", label: "MY HEARTS", count: heartedItems.length },
  ];

  const handleDropPress = (drop: Drop) => {
    router.push(`/drop/${drop.id}`);
  };

  const renderDropCard = ({ item, index }: { item: Drop; index: number }) => (
    <View className={index % 2 === 0 ? "pr-2" : "pl-2"} style={{ flex: 0.5 }}>
      <DropCoverCard drop={item} onPress={() => handleDropPress(item)} />
    </View>
  );

  return (
    <View className="flex-1 bg-white pt-16">
      {/* Header */}
      <View className="px-6 pb-4">
        <Text className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
          YOUR
        </Text>
        <Text
          className="text-3xl text-slate-900"
          style={{ fontFamily: "serif" }}
        >
          Drops
        </Text>
        <View className="mt-2 h-px bg-orange-500" />
      </View>

      {/* Tabs */}
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "raine-drops" ? (
        <View className="flex-1">
          <SearchBar
            placeholder="SEARCH DROPS"
            value={search}
            onChangeText={setSearch}
          />
          <FilterPills
            filters={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {filteredDrops.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6 py-20">
              <Text className="text-base text-slate-400">
                No drops found
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredDrops}
              keyExtractor={(item) => item.id}
              renderItem={renderDropCard}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      ) : (
        <MyHeartsList />
      )}
    </View>
  );
}
