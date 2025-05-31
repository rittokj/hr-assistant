import * as React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { StyleSheet, useColorScheme, View } from "react-native";

function RecentRequestsLoaderItem() {
  const darkTheme = useColorScheme() == "dark";

  return (
    <ShimmerPlaceHolder
      visible
      style={{ opacity: darkTheme ? 0.5 : 1 }}>
      <View
        style={[
          styles.item,
          {
            backgroundColor: darkTheme ? "#373737" : "#F3EBFF",
            padding: 20,
          },
        ]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View
            style={{
              flex: 1,
              alignItems: "flex-start",
            }}>
            <View style={styles.title}></View>
            <View style={[styles.text, { marginTop: 5 }]}></View>
            <View
              style={{
                backgroundColor: darkTheme ? "#171717" : "#fff",
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginTop: 10,
                width: "auto",
                borderRadius: 10,
              }}>
              <View style={styles.text}></View>
            </View>
          </View>
          <View style={styles.icon}></View>
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

function RecentRequestsLoader() {
  return (
    <View style={styles.container}>
      <RecentRequestsLoaderItem />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    width: 120,
    height: 16,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
    marginBottom: 8,
  },
  text: {
    width: 180,
    height: 14,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  icon: {
    width: 20,
    height: 20,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  item: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    backgroundColor: "#F5F5F5",
  },
});

export default RecentRequestsLoader;
