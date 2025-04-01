import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import CloseIcon from "@/assets/svgs/Close";

function PaySlipDetails({ open, setOpen, title = "Februry" }) {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["65%"], []);

  // callbacks
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    sheetRef.current?.close();
  }, []);

  useEffect(() => {
    if (open) handleSnapPress(0);
  }, [open]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={null}
        pressBehavior="none"
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      index={-1}
      handleComponent={null}
      backdropComponent={renderBackdrop}
    >
      {/* <View
        style={{
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>February</Text>
        <TouchableOpacity onPress={closeModal}>
          <BellIcon />
        </TouchableOpacity>
      </View> */}
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: 16 }}>{title}</Text>
        <TouchableOpacity
          onPress={closeModal}
          style={{ padding: 10, backgroundColor: "#000", borderRadius: 20 }}
        >
          <CloseIcon color="#fff" />
        </TouchableOpacity>
      </View>
      <BottomSheetScrollView>
        {/* Title Section */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            paddingBottom: 15,
            justifyContent: "space-between",
            borderBottomColor: "#ECE9F2",
            borderBottomWidth: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>Type</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>Addition</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "right" }}>Deduction</Text>
          </View>
        </View>
        {/* Basic Section */}
        <View
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
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>Basic</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>AED 3000</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "right" }}></Text>
          </View>
        </View>
        {/* HRA Section */}
        <View
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
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>HRA</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>AED 2000</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "right" }}></Text>
          </View>
        </View>

        {/* Fine Section */}
        <View
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
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>Fine</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}></Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "right" }}>AED 200</Text>
          </View>
        </View>

        {/* Loan Section */}
        <View
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
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>Loan</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}></Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "right" }}>AED 200</Text>
          </View>
        </View>

        {/* Total Section */}
        <View
          style={{
            flexDirection: "row",
            padding: 20,
            marginTop: -1,
            justifyContent: "space-between",
            backgroundColor: "#ECE9F2",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}>Total</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "left" }}></Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, textAlign: "right" }}>AED 4600</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={{
              margin: 20,
              padding: 15,
              backgroundColor: "#007aff1a",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#007aff" }}>Download Pay Slip</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});

export default PaySlipDetails;
