import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import moment from "moment";

import AngleIcon from "@/assets/svgs/Angle";
import { Link, useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { useLeaves } from "@/app/contexts/LeaveContext";

const { width } = Dimensions.get("window");

function RequestsCarousel() {
  const { recentLeaveRequests } = useLeaves();
  return (
    <Carousel
      loop={false}
      width={width}
      height={258}
      snapEnabled={true}
      pagingEnabled={true}
      autoPlayInterval={2000}
      mode='parallax'
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,
      }}
      data={recentLeaveRequests}
      style={{ width: "100%" }}
      renderItem={({ item }) => <RequestsCarouselItem item={item} />}
    />
  );
}

function RequestsCarouselItem({ item }: { item: string }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const fromDate = moment(item?.fromDateText, "DD/MM/YYYY");
  const toDate = moment(item?.toDateText, "DD/MM/YYYY");
  const formattedRange = `${fromDate.format("D MMMM")} to ${toDate.format(
    "D MMMM"
  )}`;

  const onPressItem = () => {
    router.push({
      pathname: "/request-details",
      params: { leaveRequestId: item.employeeLeaveRequestId },
    });
  };

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colorScheme === "dark" ? "#373737" : "#F3EBFF",
          padding: 20,
        },
      ]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
          }}>
          <ThemedText style={styles.title}>Leave Request</ThemedText>
          <ThemedText style={[styles.text, { marginTop: 5 }]}>{`${
            item?.leaveTypeDTO?.leaveTypeName || ""
          } | ${formattedRange}`}</ThemedText>
          <View
            style={{
              backgroundColor: colorScheme === "dark" ? "#171717" : "#fff",
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 10,
              width: "auto",
              borderRadius: 10,
            }}>
            <ThemedText style={styles.text}>
              {item?.wfStateName || ""}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={onPressItem}>
          <AngleIcon color={colorScheme === "dark" ? "#FFF" : "#171717"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
  },
});

export default RequestsCarousel;
