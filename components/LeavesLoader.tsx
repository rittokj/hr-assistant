import * as React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

function LeavesLoaderItem() {
  const darkTheme = useColorScheme() == "dark";

  return (
    <ShimmerPlaceHolder
      visible
      style={{ opacity: darkTheme ? 0.5 : 1 }}>
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}></Text>
            <Text style={styles.subTitle}></Text>
          </View>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}></View>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}></Text>
          </View>
          <View style={styles.badgeContainer}></View>
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

export default function LeavesLoader() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((i) => (
        <LeavesLoaderItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 0,
  },
  item: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    borderColor: "#F3EBFF",
    borderWidth: 1,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    width: 60,
    height: 15,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  subTitle: {
    width: 180,
    height: 10,
    marginTop: 10,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  iconContainer: {
    width: 15,
    height: 15,
    backgroundColor: "#E6F2FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: 5,
  },
  iconWrapper: {
    transform: [{ scale: 0.5 }],
  },
  badgeContainer: {
    width: 75,
    height: 20,
    backgroundColor: "#E6F2FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    padding: 5,
  },
});
