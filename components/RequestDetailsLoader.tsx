import * as React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

function RequestDetailsLoaderItem() {
  const darkTheme = useColorScheme() === "dark";

  return (
    <ShimmerPlaceHolder
      visible
      style={{ opacity: darkTheme ? 0.5 : 1 }}>
      <View style={styles.container}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <View
            key={item}
            style={styles.summarySection}>
            <View style={styles.summaryRowLeft}>
              <View style={styles.summaryLabel} />
            </View>

            <View style={styles.summaryRowRight}>
              <View style={styles.summaryLabel} />
            </View>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <View style={styles.button} />
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

function RequestDetailsLoader() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <RequestDetailsLoaderItem />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    width: 80,
    height: 20,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  summarySection: {
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomColor: "#E6F2FF",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryRowLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryRowRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    width: 60,
    height: 18,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
});

export default RequestDetailsLoader;
