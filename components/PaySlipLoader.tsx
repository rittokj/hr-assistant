import * as React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { primaryColor } from "@/constants/Colors";

function PaySlipLoaderItem() {
  const darkTheme = useColorScheme() == "dark";

  return (
    <ShimmerPlaceHolder
      visible
      style={{ opacity: darkTheme ? 0.5 : 1 }}>
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}></Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}></Text>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}></View>
            </View>
          </View>
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.text}></Text>
            <Text style={styles.textBold}></Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.textRed}></Text>
            <Text style={styles.textRedBold}></Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.text}></Text>
            <Text style={styles.textBold}></Text>
          </View>
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

export default function PaySlipLoader() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((i) => (
        <PaySlipLoaderItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  item: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    borderColor: "#F3EBFF",
    borderWidth: 1,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#F3EBFF",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    width: 60,
    height: 15,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  text: {
    width: 60,
    marginTop: 10,
    height: 10,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  textBold: {
    width: 80,
    height: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  textRed: {
    width: 60,
    marginTop: 10,
    height: 10,
    backgroundColor: "#ffd6d6",
    borderRadius: 4,
  },
  textRedBold: {
    width: 80,
    marginTop: 10,
    marginBottom: 10,
    height: 15,
    backgroundColor: "#ffd6d6",
    borderRadius: 4,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsText: {
    width: 60,
    height: 10,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
    marginRight: 10,
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
    gap: 6,
  },
});
