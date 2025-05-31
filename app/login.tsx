import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useAuth } from "./contexts/AuthContext";
import { primaryColor } from "@/constants/Colors";

const LoginScreen = () => {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("hruser");
  const [password, setPassword] = useState("hr123");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      login(username, password)
        .then(() => {
          router.replace("/(tabs)");
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: `Login failed!`,
            position: "bottom",
            visibilityTime: 3000,
          });
        });
    } catch (err) {
      if (err instanceof AxiosError) {
        Toast.show({
          type: "error",
          text1: err.response?.data?.message || "Login failed",
          position: "bottom",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: `An unexpected error occurred!`,
          position: "bottom",
          visibilityTime: 3000,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      />
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>Sign in to your Account</ThemedText>
        <ThemedText style={styles.subTitle}>
          Enter your username and password to log in
        </ThemedText>
      </View>
      <ThemedTextInput
        style={styles.input}
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
      />

      <ThemedTextInput
        style={styles.input}
        placeholder='Password'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "80%",
    height: 120,
    objectFit: "contain",
    marginBottom: 20,
  },
  textContainer: { width: "100%", marginBottom: 40 },
  title: {
    fontSize: 32,
    lineHeight: 46,
    maxWidth: "70%",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: primaryColor,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 10,
    color: primaryColor,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreen;
