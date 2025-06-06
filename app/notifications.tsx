import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import moment from "moment";
import { useRouter } from "expo-router";

import NotificationLoader from "@/components/NotificationLoader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { primaryColor } from "@/constants/Colors";
import { useNotification } from "./contexts/NotificationContext";
import { PUSH_NOTIFICATION_TYPES } from "@/constants/pushNotificationTypes";

interface Notification {
  notificationLogId: number;
  subject: string;
  notificationMessage: string;
  createDate: string;
  sourceTypeCd: number;
  sourceId: number;
}

const NotificationsScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isNotificationsLoading,
    getNotifications,
    readNotificationsById,
    notifications,
    hasMore,
    currentPage,
  } = useNotification();
  const colorScheme = useColorScheme();

  useEffect(() => {
    getNotifications(1);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getNotifications(1);
    setRefreshing(false);
  }, []);

  const loadMore = useCallback(() => {
    if (!isNotificationsLoading && hasMore) {
      getNotifications(currentPage + 1);
    }
  }, [isNotificationsLoading, hasMore, currentPage]);

  const onPressNotification = (item: Notification) => {
    readNotificationsById(item.notificationLogId);
    switch (item.sourceTypeCd) {
      case PUSH_NOTIFICATION_TYPES.HR_Memo_Source_Type:
        router.push({
          pathname: "/(tabs)/my-profile",
          params: { memoId: item.sourceId },
        });
        break;
      case PUSH_NOTIFICATION_TYPES.HR_Warning_Source_Type:
        router.push({
          pathname: "/(tabs)/my-profile",
          params: { warningId: item.sourceId },
        });
        break;
      // case PUSH_NOTIFICATION_TYPES.Lead_Source_Type:
      // 	router.push({
      // 		pathname: '/(tabs)/my-profile',
      // 		params: { leadId: item.sourceId },
      // 	});
      // 	break;
      case PUSH_NOTIFICATION_TYPES.HR_LeaveRequest_Source_Type:
        router.push({
          pathname: "/request-details",
          params: { leaveRequestId: item.sourceId },
        });
        break;
      case PUSH_NOTIFICATION_TYPES.HR_Payslip_Source_Type:
        router.push({
          pathname: "/(tabs)/pay-slip",
          params: { payslipId: item.sourceId },
        });
        break;
      // case PUSH_NOTIFICATION_TYPES.HR_EmployeeRequest_Source_Type:
      // 	router.push({
      // 		pathname: '/(tabs)/my-profile',
      // 		params: { employeeRequestId: item.sourceId },
      // 	});
      // 	break;
      case PUSH_NOTIFICATION_TYPES.HR_AdditionalLeaveRequest_Source_Type:
        router.push({
          pathname: "/request-details",
          params: { leaveRequestId: item.sourceId },
        });
        break;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity
        key={item.notificationLogId}
        onPress={() => onPressNotification(item)}>
        <ThemedView
          style={[
            styles.notificationItem,
            { borderColor: colorScheme === "dark" ? "#000" : "#eee" },
          ]}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <ThemedText style={styles.messageTitle}>
                {item.subject}
              </ThemedText>
            </View>
            <ThemedText style={styles.message}>
              {moment(item.createDate).startOf("hour").fromNow()}
            </ThemedText>
          </View>
          <ThemedText style={styles.message}>
            {item.notificationMessage}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () =>
    !isNotificationsLoading ? (
      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyStateText}>
          No notifications yet
        </ThemedText>
      </View>
    ) : null;

  const renderFooter = () =>
    isNotificationsLoading ? <NotificationLoader /> : null;

  return (
    <ThemedView style={styles.container}>
      <FlatList<Notification>
        data={notifications}
        keyExtractor={(item) => item.notificationLogId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[primaryColor]}
            tintColor={primaryColor}
          />
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    margin: 20,
    fontSize: 16,
  },
  headerContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontWeight: "600", fontSize: 16 },
  closeButton: { padding: 10, backgroundColor: "#000", borderRadius: 20 },
  notificationItem: {
    padding: 20,
    marginVertical: 5,
    borderBottomWidth: 1,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 16,
    marginBottom: 10,
  },
  message: {
    lineHeight: 16,
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
  },
});

export default NotificationsScreen;
