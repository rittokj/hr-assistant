import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, useColorScheme } from "react-native";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Simulating API call
    const fetchedNotifications = [
      {
        id: "1",
        type: "leave",
        message: "Your leave application has been approved.",
        timestamp: "2025-03-31 10:15 AM",
      },
      {
        id: "2",
        type: "pay_slip",
        message: "Your pay slip for March 2025 is now available.",
        timestamp: "2025-03-31 09:30 AM",
      },
      {
        id: "3",
        type: "leave",
        message: "Your leave application has been rejected.",
        timestamp: "2025-03-30 05:45 PM",
      },
    ];
    setNotifications(fetchedNotifications);
  }, []);

  const renderItem = ({ item }) => (
    <ThemedView
      style={[
        styles.notificationItem,
        { backgroundColor: colorScheme === "dark" ? "#000" : "#eee" },
      ]}
    >
      <ThemedText style={styles.message}>{item.message}</ThemedText>
      <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});

export default NotificationsScreen;
