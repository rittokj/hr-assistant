import React, { useCallback, useState } from "react";
import { View, Text, Image, useColorScheme } from "react-native";

import SwipeButton from "rn-swipe-button";

import ArrowSimpleIcon from "@/assets/svgs/ArrowSimple";

function RnSwipeButton() {
  const colorScheme = useColorScheme();
  return (
    <View>
      <SwipeButton
        railBackgroundColor="#428EFB"
        railBorderColor="#428EFB"
        railStyles={{
          backgroundColor: "#428EFB",
          borderColor: "#428EFB",
        }}
        thumbIconBackgroundColor={
          colorScheme === "dark" ? "#171717" : "#FFFFFF"
        }
        thumbIconBorderColor="#428EFB"
        thumbIconComponent={() => <ArrowSimpleIcon color="#428EFB" />}
        titleColor="#fff"
        titleComponent={() => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              width: "100%",
              paddingLeft: 60,
              paddingRight: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
              Swipe right to check in
            </Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>09:03 AM</Text>
          </View>
        )}
      />
    </View>
  );
}

export default RnSwipeButton;
