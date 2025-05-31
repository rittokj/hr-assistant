import * as React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

function PayslipDetailsLoaderItem() {
  const darkTheme = useColorScheme() === "dark";

  return (
    <ShimmerPlaceHolder
      visible
      style={{ opacity: darkTheme ? 0.5 : 1 }}>
      <View style={styles.container}>
        <View style={styles.detailsSection}>
          <View style={styles.label} />
          <View style={styles.label} />
          <View style={styles.label} />
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowRight}>
            <View style={styles.summaryLabel} />
          </View>
        </View>
        <View style={styles.summarySection}>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowRight}>
            <View style={styles.summaryLabel} />
          </View>
        </View>
        <View style={styles.summarySection}>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowRight}>
            <View style={styles.summaryLabel} />
          </View>
        </View>
        <View style={styles.summarySection}>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowRight}>
            <View style={styles.summaryLabel} />
          </View>
        </View>
        <View style={styles.summarySection}>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowLeft}>
            <View style={styles.summaryLabel} />
          </View>
          <View style={styles.summaryRowRight}>
            <View style={styles.summaryLabel} />
          </View>
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

function PayslipDetailsLoader() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <PayslipDetailsLoaderItem />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    width: 80,
    height: 20,
    backgroundColor: "#E6F2FF",
    borderRadius: 4,
  },
  summarySection: {
    borderTopWidth: 1,
    paddingTop: 20,
    borderTopColor: "#E6F2FF",
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
});

export default PayslipDetailsLoader;
