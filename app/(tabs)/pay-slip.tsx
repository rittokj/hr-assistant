import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PaySlip from "@/components/PaySlip";
import PaySlipDetails from "@/components/PaySlipDetails";
import { useState } from "react";

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

export default function PaySlipScreen() {
  const [open, setOpen] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "#ECE9F2" }}
    >
      <ThemedView style={styles.requestsContainer}>
        <View style={styles.requestsTitleSection}>
          <ThemedText style={{ fontSize: 20 }} type="defaultSemiBold">
            Pay Slips
          </ThemedText>
        </View>
        <FlatList
          data={data}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={() => <PaySlip open={open} setOpen={setOpen} />}
        />
      </ThemedView>
      <PaySlipDetails open={open} setOpen={setOpen} />
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
    width: "100%",
    paddingHorizontal: 20,
  },
  requestsContainer: {
    paddingVertical: 10,
    paddingTop: 72,
  },
});
