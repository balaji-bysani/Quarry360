import React, { useState, useEffect } from "react";
import { TextInput, Platform, TouchableOpacity } from "react-native";
import { View, Text, Input, Card, Button, XStack, YStack } from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Login from "@/app/screens/Login";
import { type StackNavigation } from "../_layout";
import { X } from "@tamagui/lucide-icons";

interface TransactionProps {}

interface TransactionData {
  dieselType: string | null;
  quantity: number;
  category: string;
  note: string;
  date: Date;
}

const Transaction: React.FC<TransactionProps> = () => {
  const [dieselAvailable, setDieselAvailable] = useState<number>(0);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [dieselType, setDieselType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date()); // Initialize with current date
  const { navigate } = useNavigation<StackNavigation>();

  useEffect(() => {
    // Check if Firebase is initialized
    if (!db) {
      console.error("Firebase not initialized in HomePage");
    }
    fetchDieselAvailable();
  }, []);

  const fetchDieselAvailable = async () => {
    try {
      const dieselDocRef = doc(db, "diesel", "ReYlUUhVdqKl3fqhTBBM"); // Replace 'dieselDocumentId' with the actual document ID
      const dieselDocSnapshot = await getDoc(dieselDocRef);
      if (dieselDocSnapshot.exists()) {
        const dieselData = dieselDocSnapshot.data();
        setDieselAvailable(dieselData.dieselAvailable);
      } else {
        console.log("Diesel document does not exist");
      }
    } catch (error) {
      console.error("Error fetching diesel available: ", error);
    }
  };

  const handleOptionSelect = (option: string) => {
    setShowOptions(false);
    setDieselType(option);
  };

  const saveDataToFirebase = async (data: TransactionData) => {
    try {
      const docRef = await addDoc(collection(db, "dieselTransactions"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(error);
    }
  };

  const saveDieselAvailable = async (data: { dieselAvailable: number }) => {
    try {
      // Retrieve the existing document
      const dieselDocRef = doc(db, "diesel", "ReYlUUhVdqKl3fqhTBBM");
      const dieselDocSnap = await getDoc(dieselDocRef);
      if (dieselDocSnap.exists()) {
        // Update the existing document with new data
        await setDoc(dieselDocRef, data, { merge: true });
        console.log("Document updated successfully");
      } else {
        console.log("Diesel document does not exist");
      }
    } catch (error) {
      console.error("Error updating diesel document: ", error);
      alert(error);
    }
  };

  const handleCancel = () => {
    navigate("screens/Home");
  };

  const handleSave = () => {
    // Calculate diesel available based on diesel in/out
    let newDieselAvailable = dieselAvailable;
    if (dieselType === "Diesel In") {
      newDieselAvailable += parseFloat(quantity);
    } else if (dieselType === "Diesel Out") {
      newDieselAvailable -= parseFloat(quantity);
    }
    setDieselAvailable(newDieselAvailable);
    // Prepare the data object to be saved to Firebase
    const dataToSave: TransactionData = {
      dieselType,
      quantity: parseFloat(quantity),
      category,
      note,
      date,
    };
    const totalDieselAvailable = {
      dieselAvailable: newDieselAvailable,
    };
    // Call saveDataToFirebase with the data to be saved
    saveDataToFirebase(dataToSave);
    saveDieselAvailable(totalDieselAvailable);
    // Reset form fields after saving
    setDieselType(null);
    setQuantity("");
    setCategory("");
    setNote("");
    setDate(new Date());
    if (navigate) {
      navigate("screens/Home");
    }
  };

  const renderDatePicker = () => {
    if (Platform.OS === "ios" || showOptions) {
      return (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowOptions(false);
            const currentDate = selectedDate || date;
            setDate(currentDate);
          }}
        />
      );
    }
    return null;
  };

  return (
    <View>
      {showOptions ? (
        <View>
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
            <Button
              backgroundColor={"#8bc34a"}
              onPress={() => handleOptionSelect("Diesel In")}
              width={"40%"}
            >
              Diesel In
            </Button>
            <Button
              width={"40%"}
              backgroundColor={"#cc0000"}
              onPress={() => handleOptionSelect("Diesel Out")}
            >
              Diesel Out
            </Button>
          </Card>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowOptions(true)}>
          <Text>+</Text>
        </TouchableOpacity>
      )}

      {dieselType && (
        <View>
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
            <Input
              placeholder="Quantity (liters)"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <Input
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />
            <Input placeholder="Note" value={note} onChangeText={setNote} />
            <Text>Date:</Text>
            <TouchableOpacity onPress={() => setShowOptions(true)}>
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {renderDatePicker()}
            <XStack gap="$2" width={"100%"} justifyContent="center">
              <Button
                icon={X}
                onPress={handleCancel}
                backgroundColor={"#cc0000"}
                borderRadius={"$12"}
              />
              <Button
                backgroundColor={"#8bc34a"}
                borderRadius={"$12"}
                onPress={handleSave}
                width={"40%"}
              >
                Save
              </Button>
            </XStack>
          </Card>
        </View>
      )}
    </View>
  );
};

export default Transaction;
