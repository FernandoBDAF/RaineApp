import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useIntroductionsStore } from "../../store/introductionsStore";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: "🏠",
    Introductions: "👥",
    Communities: "💬",
    Drops: "📄",
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? "•"}
    </Text>
  );
}

export default function TabsLayout() {
  const pendingCount = useIntroductionsStore(
    (state) => state.pendingRequests.length
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E8613C",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          borderTopColor: "#E5E5E5",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="introductions"
        options={{
          title: "Introductions",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Introductions" focused={focused} />
          ),
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: "Communities",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Communities" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: "Drops",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Drops" focused={focused} />
          ),
        }}
      />
      {/* Hide old tabs from navigation */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
