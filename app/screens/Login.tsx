import { SignInForm } from "@/app/components/SignInForm";
import { SignUpForm } from "@/app/components/SignUpForm";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import type { SizeTokens } from "tamagui";
import {
  Button,
  Form,
  H4,
  Input,
  Spinner,
  View,
  Text,
  H1,
  H3,
  YStack,
  XStack,
  Switch,
  Card,
} from "tamagui";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp((prevState) => !prevState);
  };

  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );

  useEffect(() => {
    if (status === "submitting") {
      const timer = setTimeout(() => setStatus("off"), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

  return (
    <Card
      alignItems="center"
      minWidth={300}
      gap="$2"
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
      margin="$4"
    >
      {/* <View style={styles.container}>
        <View style={styles.background} />
        <View style={styles.formBlock}>
          <Text style={styles.header}>
            {isSignUp ? "Sign Up" : "Welcome back!"}
          </Text>
          <View style={styles.toggleBlock}>
            <Text>{isSignUp ? "Already" : "Don't"} have an account?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isSignUp ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleMode}
              value={isSignUp}
            />
          </View>
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </View>
      </View> */}
      <YStack gap="$2" margin="$2">
        <H1>{isSignUp ? "Sign Up" : "Welcome back!"}</H1>
        <XStack gap="$2">
          <H4>{isSignUp ? "Already" : "Don't"} have an account?</H4>
          <Switch
            size={"$4"}
            value={isSignUp ? "true" : "false"}
            onPress={() => toggleMode()}
          >
            <Switch.Thumb />
          </Switch>
        </XStack>
        <View>{isSignUp ? <SignUpForm /> : <SignInForm />}</View>
      </YStack>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2C497F", // Initial background color
  },
  formBlock: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
    color: "white",
  },
  toggleBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  input: {
    fontSize: 15,
    color: "white",
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, .25)",
    borderRadius: 10,
  },
});

export default Login;
