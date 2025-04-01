import { ThemedText } from "@/components/ThemedText";
import moment from "moment";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";

const formDataModel = [
  {
    id: "reqNo",
    label: "Request No.",
    value: "REQ/2025/009",
    type: "static",
  },
  {
    id: "date",
    label: "Date",
    value: new Date(),
    type: "date",
  },
  {
    id: "leaveType",
    label: "Leave Type",
    value: "Sick Leave",
    type: "static",
  },
  { id: "halfDay", label: "Half Day", value: "No", type: "static" },
  {
    id: "fromDate",
    label: "From Date",
    value: new Date(),
    type: "date",
  },
  {
    id: "toDate",
    label: "To Date",
    value: new Date(),
    type: "date",
  },
  { id: "leaveDays", label: "Leave Days", value: "5", type: "static" },
  { id: "reason", label: "Reason", value: "Medical", type: "static" },
  {
    id: "attachment",
    label: "Attach Document",
    value: "",
    type: "attachment",
  },
];

export default function LeaveFormScreen() {
  const colorScheme = useColorScheme();
  const [formData, setFormData] = useState(formDataModel);

  const renderTypes = (item) => {
    switch (item.type) {
      case "date":
        return (
          <View>
            <ThemedText style={{ fontSize: 14, textAlign: "right" }}>
              {moment().format("DD MMM YYYY")}
            </ThemedText>
          </View>
        );
      case "static":
        return (
          <View>
            <ThemedText style={{ fontSize: 14, textAlign: "right" }}>
              {item.value}
            </ThemedText>
          </View>
        );
      default:
        return (
          <View>
            <ThemedText style={{ fontSize: 14, textAlign: "right" }}>
              {item.value}
            </ThemedText>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "#171717" : "#fff",
        }}
      >
        <ScrollView>
          {formData.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 20,
                paddingBottom: 15,
                justifyContent: "space-between",
                borderBottomColor: "#ECE9F2",
                borderBottomWidth: 1,
              }}
            >
              <View>
                <ThemedText style={{ fontSize: 14, textAlign: "left" }}>
                  {item.label}
                </ThemedText>
              </View>
              {renderTypes(item)}
            </View>
          ))}

          <View>
            <TouchableOpacity
              style={{
                margin: 20,
                marginTop: 30,
                padding: 15,
                backgroundColor: "#007AFF",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 16 }}>
                Cancel leave
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
