import { useNavigation } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRef } from "react";
import { Alert } from "react-native";
import { Button, Input, View } from "tamagui";

export const SignUpForm = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    const email = emailRef.current;
    const password = passwordRef.current;
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sign Up Successful!");
      // navigation.navigate("EmailSignIn");
    } catch (error) {
      Alert.alert("Error", (error as any).message);
    }
  };

  return (
    <View gap = "$2">
      <Input
        placeholder="Email"
        onChangeText={(text) => (emailRef.current = text)}
        keyboardType="email-address"
      />
      <Input
        placeholder="Create Password"
        onChangeText={(text) => (passwordRef.current = text)}
        secureTextEntry={true}
      />
      <Button
        backgroundColor={"black"}
        color={"white"}
        onPress={handleSignUp}
        //disabled={!emailRef.current || !passwordRef.current}
      >
        Sign Up
      </Button>
    </View>
  );
};
