import React from "react";

import { Activity, Airplay } from "@tamagui/lucide-icons";
import {
  Button,
  Theme,
  View,
  XGroup,
  XStack,
  YStack,
  Text,
  Input,
} from "tamagui";
import { app } from "./firebase"; // Import Firebase app instance
import Login from "./app/screens/Login";
import Home from "./app/screens/Home";
import Index from "./app/index";
import Transaction from "@/app/components/Transaction";

const App = () => {
  return <Login />;
};

export default App;
