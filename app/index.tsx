import { memo } from "react";
import { View, Image, StyleSheet } from "react-native";

const SplashScreen = memo(() => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo-2.png")}
        style={styles.logo}
      />
    </View>
  );
}, []);

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "80%",
    height: 120,
    objectFit: "contain",
  },
});
