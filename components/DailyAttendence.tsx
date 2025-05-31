import * as React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import ArrowLeftIcon from "@/assets/svgs/ArrowLeft";
import ArrowRightIcon from "@/assets/svgs/ArrowRight";
import moment from "moment";
import { primaryColor } from "@/constants/Colors";

function DailyAttendence({ attendance }: any) {
  const colorScheme = useColorScheme();
  const dateBgColor =
    attendance?.attStatus === "A"
      ? "#ffa100"
      : attendance?.attStatus === "H"
      ? "#ff0100"
      : colorScheme === "dark"
      ? "#000"
      : "#f3eeff";
  const dateTextColor =
    attendance?.attStatus === "A"
      ? "#ffffff"
      : attendance?.attStatus === "H"
      ? "#ffffff"
      : colorScheme === "dark"
      ? "#ffffff"
      : "#000000";
  return (
    <View
      style={[
        styles.item,
        {
          borderColor: "#999",
          backgroundColor: colorScheme === "dark" ? "#171717" : "#fff",
          borderBottomWidth: 1,
        },
      ]}>
      <View
        style={{
          flexDirection: "row",
        }}>
        <View
          style={{
            flexDirection: "row",
          }}>
          <View
            style={[
              styles.circleWrapper,
              {
                backgroundColor: dateBgColor,
              },
            ]}>
            <ThemedText style={{ color: dateTextColor, fontSize: 14 }}>
              {moment(attendance.attDate).format("DD")}
            </ThemedText>
          </View>
          <View>
            <View
              style={{
                minWidth: 85,
              }}>
              <ThemedText style={styles.smallText}>
                {moment(attendance.attDate).format("dddd")}
              </ThemedText>
              <ThemedText
                style={
                  styles.text
                }>{`${attendance.totalHour} hours`}</ThemedText>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}>
          <View style={styles.attendanceSection}>
            <View
              style={[
                styles.arrowWrapper,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#272727" : "#E6F2FF",
                },
              ]}>
              <ArrowRightIcon color={primaryColor} />
            </View>
            <View>
              <ThemedText style={styles.smallText}>Check in</ThemedText>
              <ThemedText style={styles.text}>
                {attendance?.startTime
                  ? moment(attendance?.startTime, "HH:mm:ss").format("h:mm A")
                  : "-"}
              </ThemedText>
            </View>
          </View>
          <View style={styles.attendanceSection}>
            <View
              style={[
                styles.arrowWrapper,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#272727" : "#E6F2FF",
                },
              ]}>
              <ArrowLeftIcon color={primaryColor} />
            </View>
            <View>
              <ThemedText style={styles.smallText}>Check out</ThemedText>
              <ThemedText style={styles.text}>
                {attendance?.endTime
                  ? moment(attendance?.endTime, "HH:mm:ss").format("h:mm A")
                  : "-"}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: "center",
    height: "auto",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  smallText: {
    fontSize: 12,
    lineHeight: 12,
  },
  arrowWrapper: {
    backgroundColor: "#E6F2FF",
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  circleWrapper: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  attendanceSection: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default DailyAttendence;
