import * as React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

function NotificationLoaderItem() {
  const darkTheme = useColorScheme() == "dark";

  return (
    <ShimmerPlaceHolder
      visible
      style={{ opacity: darkTheme ? 0.5 : 1 }}>
      <View style={styles.notificationItem}>
        <View style={styles.messageWrapper}>
          <View style={styles.title} />
          <View style={styles.text} />
        </View>
        <View style={styles.timestamp} />
      </View>
    </ShimmerPlaceHolder>
  );
}

function NotificationLoader() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {[
        "skl1",
        "skl2",
        "skl3",
        "skl4",
        "skl5",
        "skl6",
        "skl7",
        "skl8",
        "skl9",
        "skl10",
      ].map((i) => (
        <NotificationLoaderItem key={i} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  notificationItem: {
    padding: 20,
    marginVertical: 5,
    borderRadius: 5,
    borderBottomColor: "#E6F2FF",
    borderBottomWidth: 1,
  },
  messageWrapper: {
    marginBottom: 10,
  },
  title: {
    width: "70%",
    height: 16,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
    marginBottom: 8,
  },
  text: {
    width: "90%",
    height: 14,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  timestamp: {
    width: "30%",
    height: 12,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
});

export default NotificationLoader;
