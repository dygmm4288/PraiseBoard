import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/shared/ui/haptic-tab";
import { IconSymbol } from "@/shared/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='house.fill' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
