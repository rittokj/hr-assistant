import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  useColorScheme,
  RefreshControl,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CircleAngleDownIcon from "@/assets/svgs/CircleAngleDown";
import BottomSheetSelecter from "@/components/BottomSheetSelecter";
import { useEffect, useState } from "react";
import DailyAttendence from "@/components/DailyAttendence";
import { useAttendance } from "../contexts/AttendanceContext";
import DailyAttendenceLoader from "@/components/DailyAttendenceLoader";
import { primaryColor } from "@/constants/Colors";

export default function AttendanceScreen() {
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const {
    months: contextMonths,
    selectedMonth,
    setSelectedMonth,
    attendanceList,
    isLoading,
    summary,
    fetchAttendanceData,
  } = useAttendance();

  const listHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          columnGap: 8,
          backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2",
          padding: 20,
        }}>
        {[
          {
            id: "1",
            title: "Total Attendance",
            value: summary?.totalAttendance.toString(),
            unit: "Days",
          },
          {
            id: "2",
            title: "Total Leaves",
            value: summary?.totalLeaves.toString(),
            unit: "Days",
          },
          {
            id: "3",
            title: "Total Working Hours",
            value: summary?.totalWorkingHours.toString(),
            unit: "",
          },
        ].map((item) => (
          <View
            key={item.id}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: colorScheme === "dark" ? "#171717" : "#FFF",
              padding: 10,
              justifyContent: "space-between",
            }}>
            <ThemedText
              style={{ fontSize: 14, marginRight: 5, fontWeight: "400" }}>
              {item.title}
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                alignItems: "flex-end",
              }}>
              <ThemedText style={{ fontSize: 20, marginRight: 5 }}>
                {item.value}
              </ThemedText>
              <ThemedText style={{ fontSize: 12 }}>{item.unit}</ThemedText>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth]);

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2",
      }}>
      <ThemedView
        style={[
          styles.requestsContainer,
          { backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2" },
        ]}>
        <View
          style={[
            styles.requestsTitleSection,
            { backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2" },
          ]}>
          <ThemedText
            style={{ fontSize: 20 }}
            type='defaultSemiBold'>
            Attendance
          </ThemedText>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <ThemedText
              style={{ fontSize: 16, textAlign: "right", marginRight: 5 }}>
              {selectedMonth.label}
            </ThemedText>
            <CircleAngleDownIcon
              color={colorScheme === "dark" ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>
        {listHeader()}
        <FlatList
          data={attendanceList}
          contentContainerStyle={{
            backgroundColor: colorScheme === "dark" ? "#171717" : "#FFF",
            paddingBottom: 250,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primaryColor}
              colors={[primaryColor]}
            />
          }
          renderItem={({ item }) => <DailyAttendence attendance={item} />}
          ListEmptyComponent={
            isLoading ? (
              <DailyAttendenceLoader />
            ) : (
              <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
                No attendance records found
              </ThemedText>
            )
          }
        />
      </ThemedView>
      <BottomSheetSelecter
        list={contextMonths}
        title='Select Month'
        onSelect={(item) => {
          if (item?.id !== selectedMonth?.id)
            setSelectedMonth({ ...item, metaData: item });
        }}
        onClose={() => setOpen(false)}
        selectedItem={selectedMonth}
        open={open}
        valueName={"label"}
        valueId={"id"}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
  },
  requestsTitleSection: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#ECE9F2",
  },
  requestsContainer: {
    paddingVertical: 10,
    backgroundColor: "#ECE9F2",
    paddingTop: 72,
  },
});
