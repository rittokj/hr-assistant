import { ThemedText } from "@/components/ThemedText";
import moment from "moment";
import { useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useLeaves } from "./contexts/LeaveContext";
import { primaryColor } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { leaveRequestStatuses } from "./constants/statusColor";
import RequestDetailsLoader from "@/components/RequestDetailsLoader";
import { Toast } from "toastify-react-native";

export default function LeaveFormScreen() {
  const { leaveRequestId } = useLocalSearchParams();
  const [isCancelling, setIsCancelling] = useState(false);
  const {
    selectedLeaveRequest,
    isLoadingDetails,
    setSelectedLeaveRequest,
    getLeaveRequestById,
    cancelLeaveRequestById,
  } = useLeaves();

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (leaveRequestId) getLeaveRequestById(leaveRequestId);
  }, [leaveRequestId]);

  useEffect(() => {
    return () => {
      setSelectedLeaveRequest(null);
    };
  }, []);

  const formData = useMemo(
    () => [
      {
        id: "reqNo",
        label: "Request No.",
        value: selectedLeaveRequest?.transNo,
        type: "static",
      },
      {
        id: "date",
        label: "Date",
        value: selectedLeaveRequest?.transDate,
        type: "date",
      },
      {
        id: "leaveType",
        label: "Leave Type",
        value: selectedLeaveRequest?.leaveTypeDTO?.leaveTypeName,
        type: "static",
      },
      {
        id: "halfDay",
        label: "Half Day",
        value: selectedLeaveRequest?.isHalfDay ? "Yes" : "No",
        type: "static",
      },
      {
        id: "fromDate",
        label: "From Date",
        value: selectedLeaveRequest?.leaveFromDate,
        type: "date",
      },
      {
        id: "toDate",
        label: "To Date",
        value: selectedLeaveRequest?.leaveToDate,
        type: "date",
      },
      {
        id: "leaveDays",
        label: "Leave Days",
        value: selectedLeaveRequest?.leaveDays,
        type: "static",
      },
      {
        id: "reason",
        label: "Reason",
        value: selectedLeaveRequest?.reason || "",
        type: "static",
      },
      {
        id: "attachment",
        label: "Attach Document",
        value: "",
        type: "attachment",
      },
    ],
    [selectedLeaveRequest?.employeeLeaveRequestId, leaveRequestId]
  );

  const cancelLeave = () => {
    setIsCancelling(true);
    cancelLeaveRequestById(selectedLeaveRequest?.employeeLeaveRequestId)
      .then(() => {
        Toast.show({
          type: "success",
          text1: `Your Leave has been cancelled!`,
          position: "bottom",
          visibilityTime: 3000,
        });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: err.message,
          position: "bottom",
          visibilityTime: 3000,
        });
      })
      .finally(() => {
        setIsCancelling(false);
      });
  };

  const renderTypes = (item) => {
    if (item?.type === "date") {
      return (
        <ThemedText style={styles.text}>
          {moment(item?.value).format("DD MMM YYYY")}
        </ThemedText>
      );
    }
    return <ThemedText style={styles.text}>{item?.value}</ThemedText>;
  };

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "#171717" : "#fff",
        }}>
        {isLoadingDetails ? (
          <RequestDetailsLoader />
        ) : (
          <ScrollView>
            {formData.map((item) => (
              <View
                key={item?.id}
                style={styles.container}>
                <View>
                  <ThemedText style={{ fontSize: 14, textAlign: "left" }}>
                    {item?.label}
                  </ThemedText>
                </View>
                <View>{renderTypes(item)}</View>
              </View>
            ))}
            <View style={styles.container}>
              <View>
                <ThemedText style={{ fontSize: 14, textAlign: "left" }}>
                  Status
                </ThemedText>
              </View>
              <View
                style={{
                  backgroundColor:
                    leaveRequestStatuses[
                      selectedLeaveRequest?.wfstateConfigDTO?.wfstateId
                    ]?.color || "#ccc",
                  paddingHorizontal: 10,
                  width: "auto",
                  borderRadius: 6,
                }}>
                <ThemedText
                  style={[
                    styles.text,
                    {
                      color:
                        leaveRequestStatuses[
                          selectedLeaveRequest?.wfstateConfigDTO?.wfstateId
                        ]?.textColor || "#000",
                    },
                  ]}>
                  {selectedLeaveRequest?.wfStateName || ""}
                </ThemedText>
              </View>
            </View>
            {selectedLeaveRequest?.wfstateConfigDTO?.wfstateId !== 36 &&
            selectedLeaveRequest?.wfstateConfigDTO?.wfstateId !== 1054 &&
            moment(selectedLeaveRequest?.leaveFromDate).isAfter(moment()) ? (
              <View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  disabled={isCancelling}
                  onPress={cancelLeave}>
                  <Text style={styles.cancelButtonText}>Cancel leave</Text>
                  {isCancelling ? <ActivityIndicator color='#fff' /> : null}
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    paddingBottom: 15,
    justifyContent: "space-between",
    borderBottomColor: "#ECE9F2",
    borderBottomWidth: 1,
  },
  cancelButton: {
    margin: 20,
    gap: 12,
    marginTop: 30,
    padding: 15,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  text: { fontSize: 14, textAlign: "right" },
});
