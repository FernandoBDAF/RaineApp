import React from "react";
import { Pressable, Text, View } from "react-native";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <View className="flex-row border-b border-slate-200 px-6">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className={`mr-6 pb-3 ${
            activeTab === tab.id ? "border-b-2 border-orange-500" : ""
          }`}
        >
          <Text
            className={`text-sm font-semibold tracking-wider ${
              activeTab === tab.id ? "text-orange-500" : "text-slate-400"
            }`}
          >
            {tab.label.toUpperCase()}
            {tab.count !== undefined ? ` (${tab.count})` : ""}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
