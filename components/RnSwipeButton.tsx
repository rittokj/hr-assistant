import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { View, Text, useColorScheme } from "react-native";
import moment from "moment";
import SwipeButton from "rn-swipe-button";
import { Toast } from "toastify-react-native";

import ArrowSimpleIcon from "@/assets/svgs/ArrowSimple";
import { useAttendance } from "@/app/contexts/AttendanceContext";
import { primaryColor } from "@/constants/Colors";

function RnSwipeButton() {
  const colorScheme = useColorScheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { markAttendance, currentDayAttendance } = useAttendance();

  const forceResetLastButton = useRef<(() => void) | null>(null);

  const forceResetButtonCallback = useCallback(() => {
    forceResetLastButton.current?.();
  }, []);

  const handleSwipeSuccess = useCallback(async () => {
    try {
      const typeId = currentDayAttendance.checkIn.time ? 2 : 1;
      await markAttendance(typeId, currentDayAttendance.checkIn.id);
      forceResetButtonCallback();

      Toast.show({
        type: "success",
        text1: `Successfully ${
          currentDayAttendance.checkIn.time ? "checked out" : "checked in"
        }!`,
        position: "bottom",
        visibilityTime: 4000,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Failed to mark attendance. Please try again.`,
        position: "bottom",
        visibilityTime: 4000,
      });
    }
  }, [currentDayAttendance.checkIn.time]);

  const handleForceReset = useCallback((reset: () => void) => {
    forceResetLastButton.current = reset;
  }, []);

  const titleComponent = useMemo(() => {
    return () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          width: "100%",
          paddingLeft: 80,
          paddingRight: 20,
        }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
            lineHeight: 20,
            fontWeight: "600",
          }}>
          {`Swipe right to `}
          {currentDayAttendance?.checkIn?.time ? "check out" : "check in"}
        </Text>
        <Text style={{ color: "#fff", fontSize: 12, lineHeight: 20 }}>
          {moment(currentTime).format("LT")}
        </Text>
      </View>
    );
  }, [currentDayAttendance.checkIn, currentTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentTime]);

  return (
    <SwipeButton
      disableResetOnTap
      forceReset={handleForceReset}
      railBackgroundColor={colorScheme === "dark" ? "#373737" : primaryColor}
      railBorderColor={colorScheme === "dark" ? "#373737" : primaryColor}
      railStyles={{
        backgroundColor: colorScheme === "dark" ? "#171717" : primaryColor,
        borderColor: colorScheme === "dark" ? "#171717" : primaryColor,
        height: 60,
      }}
      thumbIconBackgroundColor={colorScheme === "dark" ? "#171717" : "#FFFFFF"}
      thumbIconBorderColor={colorScheme === "dark" ? "#373737" : primaryColor}
      thumbIconComponent={() => <ArrowSimpleIcon color={primaryColor} />}
      thumbIconWidth={60}
      thumbIconHeight={60}
      thumbIconStyles={{
        height: 60,
        minHeight: 60,
      }}
      titleColor='#fff'
      onSwipeSuccess={handleSwipeSuccess}
      titleComponent={titleComponent}
    />
  );
}

export default React.memo(RnSwipeButton);
