import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import HomeIcon from "@/assets/svgs/Home";
import LeavesIcon from "@/assets/svgs/Leaves";
import AttendenceIcon from "@/assets/svgs/Attendance";
import PaySlipIcon from "@/assets/svgs/PaySlip";
import ProfileIcon from "@/assets/svgs/Profile";

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaves"
        options={{
          title: "Leaves",
          tabBarIcon: ({ color }) => <LeavesIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color }) => <AttendenceIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="pay-slip"
        options={{
          title: "Pay Slip",
          tabBarIcon: ({ color }) => <PaySlipIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
