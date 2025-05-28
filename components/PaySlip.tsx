import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import moment from "moment";

import AngleIcon from "@/assets/svgs/Angle";
import { ThemedText } from "./ThemedText";
import { primaryColor } from "@/constants/Colors";

interface PaySlipProps {
  setOpen: (id: string) => void;
  slip: {
    payrollMonth?: number;
    payrollYear?: number;
    payrollGenerationId: string;
    addition?: number;
    deduction?: number;
    totalAmount?: number;
  };
}

function PaySlip({ setOpen, slip }: PaySlipProps) {
  return (
    <View style={styles.item}>
      <View style={styles.itemContainer}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>
            {`${
              slip?.payrollMonth
                ? moment()
                    .month(slip.payrollMonth - 1)
                    .format("MMMM")
                : ""
            } ${slip?.payrollYear ? slip.payrollYear : ""}`}
          </ThemedText>
        </View>
        <TouchableOpacity onPress={() => setOpen(slip.payrollGenerationId)}>
          <View style={styles.detailsContainer}>
            <ThemedText style={styles.detailsText}>Details</ThemedText>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <AngleIcon color="#fff" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.text}>Incentive</ThemedText>
          <ThemedText style={styles.textBold}>{`AED ${
            slip?.addition || "0.00"
          }`}</ThemedText>
        </View>
        <View style={[styles.summaryItem, { alignItems: "center" }]}>
          <ThemedText style={styles.textRed}>Deduction</ThemedText>
          <ThemedText style={styles.textRedBold}>{`AED ${
            slip?.deduction || "0.00"
          }`}</ThemedText>
        </View>
        <View style={[styles.summaryItem, { alignItems: "flex-end" }]}>
          <ThemedText style={styles.text}>Net Salary</ThemedText>
          <ThemedText style={styles.textBold}>{`AED ${
            slip?.totalAmount || "0.00"
          }`}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    borderColor: "#F3EBFF",
    borderWidth: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#F3EBFF",
    borderBottomWidth: 1,
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  text: {
    fontSize: 12,
  },
  textBold: {
    fontSize: 12,
    fontWeight: "500",
  },
  textRed: {
    fontSize: 12,
    color: "#FF0000",
  },
  textRedBold: {
    fontSize: 12,
    color: "#FF0000",
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsText: {
    marginRight: 10,
    fontSize: 12,
  },
  iconContainer: {
    width: 15,
    height: 15,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: 5,
  },
  iconWrapper: {
    transform: [{ scale: 0.5 }],
  },
  summaryContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    gap: 2,
    flex: 1,
  },
});

export default PaySlip;
