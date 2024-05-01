import { useNavigation } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { Alert } from "react-native";
import { Button, Input, View } from "tamagui";
import { type StackNavigation } from "../_layout";
import Home from "@/app/screens/Home";

export const SignInForm = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { navigate } = useNavigation<StackNavigation>();

  const handleSignIn = async () => {
    const email = emailRef.current;
    const password = passwordRef.current;
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Sign In Successful!");
      navigate("screens/Home");
    } catch (error) {
      Alert.alert("Error", (error as any).message);
    }
  };

  return (
    <View gap="$2">
      <Input
        placeholder="Username"
        onChangeText={(text) => (emailRef.current = text)}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => (passwordRef.current = text)}
        secureTextEntry={true}
      />
      <Button
        backgroundColor={"black"}
        color={"white"}
        onPress={() => handleSignIn()}
        //disabled={!emailRef.current || !passwordRef.current}
      >
        Log In
      </Button>
    </View>
  );
};
