import moment from "moment";
import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Toast } from "toastify-react-native";

import SmallAngleIcon from "@/assets/svgs/SmallAngle";
import BottomSheetSelecter from "@/components/BottomSheetSelecter";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import PlusIcon from "@/assets/svgs/Plus";
import CloseIcon from "@/assets/svgs/Close";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useLeaves } from "./contexts/LeaveContext";
import { useAuth } from "./contexts/AuthContext";
import { useNavigation } from "expo-router";
import { primaryColor } from "@/constants/Colors";

interface FormItem {
  id: string;
  label: string;
  type: string;
  value?: any;
  metaData?: any;
}

const formDataModel = [
  {
    id: "date",
    label: "Date",
    type: "static",
  },
  {
    id: "leaveType",
    label: "Leave Type",
    value: null,
    type: "dropdown",
  },
  { id: "halfDay", label: "Half Day", value: "No", type: "toggle" },
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
  { id: "leaveDays", label: "Leave Days", value: "", type: "dynamic" },
  { id: "reason", label: "Reason", value: "", type: "text" },
  {
    id: "attachment",
    label: "Attach Document",
    value: "",
    type: "attachment",
  },
];

export default function LeaveFormScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const {
    leaveTypesList,
    checkLeaveAvailability,
    getLeaveRequests,
    applyLeave,
  } = useLeaves();
  const { profileInfo } = useAuth();
  const [formData, setFormData] = useState(formDataModel);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableLeaveCount, setAvailableLeaveCount] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [pickedDocument, setPickedDocument] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);

  const getDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPickedDocument(result);
        const updatedFormData = formData.map((data) => {
          if (data.id === "attachment") {
            return { ...data, value: result.assets[0].name };
          }
          return data;
        });
        setFormData(updatedFormData);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Toast.show({
        type: "error",
        text1: "Failed to pick document",
        position: "bottom",
      });
    }
  };

  const removeDocument = () => {
    setPickedDocument(null);
    const updatedFormData = formData.map((data) => {
      if (data.id === "attachment") {
        return { ...data, value: "" };
      }
      return data;
    });
    setFormData(updatedFormData);
  };

  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
        length: fileInfo.size,
      });

      if (!base64) {
        throw new Error("Failed to read file content");
      }
      return base64;
    } catch (error) {
      throw error;
    }
  };

  const renderTypes = (item: FormItem) => {
    switch (item.type) {
      case "static":
        return (
          <View>
            <ThemedText style={{ fontSize: 14, textAlign: "right" }}>
              {moment().format("DD MMM YYYY")}
            </ThemedText>
          </View>
        );
      case "dropdown":
        return (
          <TouchableOpacity onPress={() => setOpen(true)}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText
                style={{ fontSize: 14, textAlign: "right", marginRight: 5 }}>
                {item.value}
              </ThemedText>
              <SmallAngleIcon
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </View>
            {item.value ? (
              <ThemedText
                style={{
                  fontSize: 12,
                  textAlign: "right",
                  marginRight: 5,
                  color: "#999",
                }}>{`Available: ${
                availableLeaveCount || availableLeaveCount === 0
                  ? availableLeaveCount
                  : "..."
              }`}</ThemedText>
            ) : null}
          </TouchableOpacity>
        );
      case "toggle":
        return (
          <View>
            <Switch
              trackColor={{ false: "#DADADA", true: primaryColor }}
              thumbColor='#FFFFFF'
              ios_backgroundColor='#DADADA'
              onValueChange={() => {
                const fromDate = formData.find((i) => i.id === "fromDate");
                const updatedFormData = formData.map((data) => {
                  if (data.id === "halfDay") {
                    return {
                      ...data,
                      value: data.value === "Yes" ? "No" : "Yes",
                    };
                  }
                  if (data.id === "toDate") {
                    return {
                      ...data,
                      value: fromDate?.value || new Date(),
                    };
                  }
                  if (data.id === "leaveDays") {
                    return {
                      ...data,
                      value: "0.5",
                    };
                  }

                  return data;
                });
                setFormData(updatedFormData);
              }}
              value={
                formData.find((data) => data.id === "halfDay").value === "Yes"
              }
            />
          </View>
        );
      case "date":
        return (
          <View>
            {Platform.OS === "ios" || openDatePicker === item.id ? (
              <RNDateTimePicker
                onChange={(e, date: Date) => {
                  const updatedFormData = JSON.parse(JSON.stringify(formData));
                  const index = updatedFormData.findIndex(
                    (i) => i.id === openDatePicker
                  );

                  if (index > -1) {
                    updatedFormData[index] = {
                      ...updatedFormData[index],
                      value: date,
                    };
                    if (updatedFormData[index].id === "fromDate") {
                      const toDateIndex = updatedFormData.findIndex(
                        (i) => i.id === "toDate"
                      );
                      if (toDateIndex > -1) {
                        updatedFormData[toDateIndex] = {
                          ...updatedFormData[toDateIndex],
                          value: date,
                        };
                      }
                    }
                  }
                  setFormData(updatedFormData);
                  if (date) setOpenDatePicker(false);
                }}
                onTouchCancel={() => setOpenDatePicker(false)}
                mode='date'
                value={item.value || new Date()}
                minimumDate={
                  item.id === "fromDate"
                    ? new Date()
                    : formData[3].value || new Date()
                }
                maximumDate={moment().add(1, "year").toDate()}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setOpenDatePicker(item.id)}
                style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText
                  style={{
                    fontSize: 14,
                    textAlign: "right",
                    marginRight: 5,
                    color: primaryColor,
                  }}>
                  {moment(item.value || new Date()).format("DD MMM YYYY")}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        );
      case "dynamic":
        const halfDay = formData.find((i) => i.id === "halfDay");

        const startDate = moment(formData[3].value);
        const endDate = moment(formData[4].value);
        const daysCount =
          endDate.diff(startDate, "days") +
          (halfDay?.value === "Yes" ? 0.5 : 1);

        return (
          <View>
            <ThemedText style={{ fontSize: 14, textAlign: "right" }}>
              {daysCount}
            </ThemedText>
          </View>
        );
      case "text":
        return (
          <View>
            <ThemedTextInput
              multiline
              style={{
                width: "100%",
                height: 80,
                borderRadius: 5,
                paddingHorizontal: 10,
                borderColor: "#444",
                borderWidth: 0.5,
              }}
              onChangeText={(text) => setReason(text)}
              placeholderTextColor='#999'
              placeholder='Please enter the reason'
            />
          </View>
        );
      case "attachment":
        return (
          <View>
            {pickedDocument && !pickedDocument.canceled ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                }}>
                <ThemedText
                  ellipsizeMode='tail'
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    width: 150,
                    marginRight: 10,
                  }}>
                  {item.value}
                </ThemedText>

                <TouchableOpacity
                  onPress={removeDocument}
                  style={{ marginLeft: 5 }}>
                  <CloseIcon />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={getDocument}
                style={{ flexDirection: "row", alignItems: "center" }}>
                <PlusIcon />
              </TouchableOpacity>
            )}
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

  const toggleLeave = (leave) => {
    setCheckingAvailability(true);
    setAvailableLeaveCount(null);
    checkLeaveAvailability(profileInfo.employeeID, leave.leaveTypeId)
      .then((res) => {
        const { result } = res.data;
        const availableLeave = result.allocatedCount - result.reservedCount;
        setAvailableLeaveCount(availableLeave);
        if (!availableLeave) {
          Toast.show({
            type: "error",
            text1: `You have used all your ${leave.leaveTypeName || ""} days.`,
            position: "bottom",
            visibilityTime: 8000,
          });
        }
        const updatedFormData = formData.map((data) => {
          if (data.id === "leaveType") {
            return { ...data, value: leave.leaveTypeName, metaData: leave };
          }
          return data;
        });
        setFormData(updatedFormData);
      })
      .finally(() => setCheckingAvailability(false));
  };

  const showToast = (field) => {
    Toast.show({
      type: "error",
      text1: `Please fill '${field}' field before submitting.`,
      position: "bottom",
    });
    setIsLoading(false);
  };

  const submitLeaveRequest = async () => {
    setIsLoading(true);
    const fromDate = formData.find((item) => item.id === "fromDate")?.value;
    const toDate = formData.find((item) => item.id === "toDate")?.value;
    const leaveType = formData.find(
      (item) => item.id === "leaveType"
    )?.metaData;
    const isHalfDay =
      formData.find((item) => item.id === "halfDay")?.value === "Yes";
    const leaveDays =
      moment(toDate).diff(moment(fromDate), "days") + (isHalfDay ? 0.5 : 1);
    if (!fromDate) {
      showToast("From Date");
      return;
    }
    if (!toDate) {
      showToast("To Date");
      return;
    }
    if (!leaveType) {
      showToast("Leave Type");
      return;
    }
    if (!reason) {
      showToast("Reason");
      return;
    }
    if (!availableLeaveCount || availableLeaveCount === 0) {
      Toast.show({
        type: "error",
        text1: `You have used all your ${leaveType?.leaveTypeName || ""} days.`,
        position: "bottom",
      });
      setIsLoading(false);
      return;
    }

    let attachmentBase64 = null;
    if (pickedDocument && !pickedDocument.canceled) {
      try {
        attachmentBase64 = await convertToBase64(pickedDocument.assets[0].uri);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Failed to process attachment",
          position: "bottom",
        });
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      EmployeeLeaveRequestId: 0,
      EmployeeId: profileInfo?.employeeID,
      LeaveTypeId: leaveType.leaveTypeId,
      LeaveFromDate: moment(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      LeaveToDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ss"),
      Reason: reason,
      IsDeleted: false,
      EmployeeName: profileInfo?.employeeName,
      TransDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
      TransNo: `TX${Date.now()}`,
      LeaveDays: leaveDays,
      IsHalfDay: isHalfDay,
      ActionNotes: "Submitted",
      fileName: pickedDocument?.assets?.[0]?.name || null,
      fileBytes: attachmentBase64 || null,
    };

    try {
      applyLeave(payload)
        .then(async (res) => {
          setIsLoading(false);
          await getLeaveRequests({
            offset: 0,
            limit: 10,
            search: "",
            isExpired: 0,
            filterList: [],
          });
          setFormData(formDataModel);
          navigation.goBack();
          Toast.show({
            type: "success",
            text1: "Leave request submitted successfully.",
            position: "bottom",
          });
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.show({
            type: "error",
            text1: "Submission failed",
            text2: err.message || "Something went wrong.",
            position: "bottom",
          });
        });
    } catch (err) {
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: err.message,
        position: "bottom",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "#171717" : "#fff",
        }}>
        <ScrollView>
          {formData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.container,
                {
                  flexDirection: item.id === "reason" ? "column" : "row",
                },
              ]}>
              <View>
                <ThemedText
                  style={{
                    fontSize: 14,
                    textAlign: "left",
                    paddingBottom: item.id === "reason" ? 10 : 0,
                  }}>
                  {item.label}
                </ThemedText>
              </View>
              {renderTypes(item)}
            </View>
          ))}

          <View>
            <TouchableOpacity
              onPress={submitLeaveRequest}
              disabled={isLoading}
              style={styles.applyeaveButton}>
              <ThemedText style={styles.applyeaveButtonText}>
                Apply Leave
              </ThemedText>
              {isLoading ? <ActivityIndicator color='#fff' /> : null}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomSheetSelecter
        list={leaveTypesList}
        title='Select Leave Type'
        onSelect={toggleLeave}
        onClose={() => setOpen(false)}
        selectedItem={formData.find((item) => item.id === "leaveType")}
        valueName='leaveTypeName'
        valueId='leaveTypeId'
        open={open}
        loading={checkingAvailability}
      />
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
  applyeaveButton: {
    margin: 20,
    marginTop: 30,
    padding: 15,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    borderRadius: 10,
  },
  applyeaveButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
