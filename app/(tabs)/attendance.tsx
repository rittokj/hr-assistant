import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CircleAngleDownIcon from "@/assets/svgs/CircleAngleDown";
import BottomSheetSelecter from "@/components/BottomSheetSelecter";
import { useState } from "react";
import DailyAttendence from "@/components/DailyAttendence";

const data = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
  "#F1F1F1",
  "#F1F1F1",
  "#F1F1F1",
  "#F1F1F1",
];

const months = [
  { id: "1", label: "January", value: "January" },
  { id: "2", label: "February", value: "February" },
  { id: "3", label: "March", value: "March" },
  { id: "4", label: "April", value: "April" },
  { id: "5", label: "May", value: "May" },
  { id: "6", label: "June", value: "June" },
  { id: "7", label: "July", value: "July" },
  { id: "8", label: "August", value: "August" },
  { id: "9", label: "September", value: "September" },
  { id: "10", label: "October", value: "October" },
  { id: "11", label: "November", value: "November" },
  { id: "12", label: "December", value: "December" },
];

export default function AttendanceScreen() {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();

  const listHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          columnGap: 8,
          backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2",
          padding: 20,
        }}
      >
        {[
          { id: "1", title: "Total Attendance", value: "21", unit: "Days" },
          { id: "2", title: "Total Leaves", value: "1", unit: "Days" },
          { id: "3", title: "Total Working Hours", value: "21", unit: "Hours" },
        ].map((item) => (
          <View
            key={item.id}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: colorScheme === "dark" ? "#171717" : "#FFF",
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <ThemedText style={{ fontSize: 14, marginRight: 5 }}>
              {item.title}
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                alignItems: "flex-end",
              }}
            >
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
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2",
      }}
    >
      <ThemedView
        style={[
          styles.requestsContainer,
          { backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2" },
        ]}
      >
        <View
          style={[
            styles.requestsTitleSection,
            { backgroundColor: colorScheme === "dark" ? "#000" : "#ECE9F2" },
          ]}
        >
          <ThemedText style={{ fontSize: 20 }} type="defaultSemiBold">
            Attendance
          </ThemedText>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ThemedText
              style={{ fontSize: 18, textAlign: "right", marginRight: 5 }}
            >
              {selectedMonth.label}
            </ThemedText>
            <CircleAngleDownIcon
              color={colorScheme === "dark" ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>
        {listHeader()}
        <FlatList
          data={data}
          contentContainerStyle={{
            backgroundColor: colorScheme === "dark" ? "#171717" : "#FFF",
            paddingBottom: 250,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={() => <DailyAttendence />}
        />
      </ThemedView>
      <BottomSheetSelecter
        list={months}
        title="Select Month"
        onSelect={(item) => {
          setSelectedMonth(item);
        }}
        onClose={() => setOpen(false)}
        selectedItem={selectedMonth}
        open={open}
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
