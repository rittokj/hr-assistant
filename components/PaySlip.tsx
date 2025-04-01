import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import AngleIcon from "@/assets/svgs/Angle";
import { ThemedText } from "./ThemedText";

function PaySlip({ setOpen }) {
  return (
    <View style={[styles.item, { borderColor: "#F3EBFF", borderWidth: 1 }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#F3EBFF",
          borderBottomWidth: 1,
          padding: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          <ThemedText style={styles.title}>February 2025</ThemedText>
        </View>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedText style={[styles.text, { marginRight: 10 }]}>
              Details
            </ThemedText>
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: "#007AFF",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <View style={{ transform: [{ scale: 0.5 }] }}>
                <AngleIcon color="#fff" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ gap: 6 }}>
          <ThemedText style={styles.text}>Incentive</ThemedText>
          <ThemedText style={styles.textBold}>AED 500</ThemedText>
        </View>
        <View style={{ gap: 6 }}>
          <ThemedText style={styles.textRed}>Deduction</ThemedText>
          <ThemedText style={styles.textRedBold}>AED 100</ThemedText>
        </View>
        <View style={{ gap: 6 }}>
          <ThemedText style={styles.text}>Net Salary</ThemedText>
          <ThemedText style={styles.textBold}>AED 3400</ThemedText>
        </View>
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
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    // fontWeight: "bold",
  },
  text: {
    fontSize: 14,
  },
  textBold: {
    fontSize: 14,
    fontWeight: "600",
  },
  textRed: {
    fontSize: 14,
    color: "#FF0000",
  },
  textRedBold: {
    fontSize: 14,
    color: "#FF0000",
    fontWeight: "600",
  },
});

export default PaySlip;
