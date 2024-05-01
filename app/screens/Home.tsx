import React, { useState, useEffect } from "react";
import { TouchableOpacity, TextInput, Platform, Keyboard } from "react-native";
import {
  ScrollView,
  View,
  Text,
  Card,
  H3,
  Button,
  Input,
  XStack,
  YStack,
  XGroup,
} from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../_layout";
import {
  ArrowLeftSquare,
  ChevronLeft,
  ChevronRight,
} from "@tamagui/lucide-icons";

interface Transaction {
  id: string;
  dieselType: string;
  quantity: number;
  category: string;
  date: Date;
}

const Home: React.FC = () => {
  const [dieselAvailable, setDieselAvailable] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
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
    fetchTransactions();
  }, []);

  const fetchDieselAvailable = async () => {
    try {
      const dieselDocRef = doc(db, "diesel", "ReYlUUhVdqKl3fqhTBBM"); // Replace 'dieselDocumentId' with the actual document ID
      const dieselDocSnapshot = await getDoc(dieselDocRef);
      if (dieselDocSnapshot.exists()) {
        const dieselData = dieselDocSnapshot.data();
        if (dieselData) {
          setDieselAvailable(dieselData.dieselAvailable);
        }
      } else {
        console.log("Diesel document does not exist");
      }
    } catch (error) {
      console.error("Error fetching diesel available: ", error);
    }
  };

  const groupTransactionsByMonth = () => {
    const groupedTransactions: { [key: string]: Transaction[] } = {};
    transactions.forEach((transaction) => {
      const monthYear = transaction.date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!groupedTransactions[monthYear]) {
        groupedTransactions[monthYear] = [];
      }
      groupedTransactions[monthYear].push(transaction);
    });
    return groupedTransactions;
  };

  const renderGroupedTransactions = () => {
    const groupedTransactions = groupTransactionsByMonth();
    return (
      <ScrollView horizontal={true}>
        <View>
          {Object.entries(groupedTransactions).map(
            ([monthYear, transactions]) => (
              <View key={monthYear}>
                <Text>{monthYear}</Text>
                <View>
                  <Text>Date</Text>
                  <Text>Type</Text>
                  <Text>Quantity</Text>
                  <Text>Category</Text>
                </View>
                {transactions.map((transaction) => (
                  <View key={transaction.id}>
                    {/* <Text style={styles.tableCell}>
                      {transaction.date
                        ? transaction.date.toDateString()
                        : "Invalid Date"}
                    </Text> */}
                    <Text>{transaction.dieselType}</Text>
                    <Text>{transaction.quantity} </Text>
                    <Text>{transaction.category}</Text>
                  </View>
                ))}
              </View>
            )
          )}
        </View>
      </ScrollView>
    );
  };

  const fetchTransactions = async () => {
    try {
      const transactionsCollectionRef = collection(db, "dieselTransactions");
      const querySnapshot = await getDocs(transactionsCollectionRef);
      const fetchedTransactions: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        const { dieselType, quantity, category, date } =
          doc.data() as Transaction; // Destructure only required properties
        fetchedTransactions.push({
          id: doc.id,
          dieselType,
          quantity,
          category,
          date,
        }); // Spread required properties
      });
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };

  const handlePlusPress = () => {
    navigate("components/Transaction");
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
    <View gap="$2">
      <YStack>
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
          <YStack>
            <H3>Diesel Available: {dieselAvailable.toFixed(2)} Liters </H3>
            <Card
              alignItems="center"
            >
              <XGroup margin = "$5">
                <XGroup.Item>
                  <Button icon={ChevronLeft} />
                </XGroup.Item>
                <XGroup.Item>
                  <Button disabled={true} >Month Name</Button>
                </XGroup.Item>
                <XGroup.Item>
                  <Button icon={ChevronRight} />
                </XGroup.Item>
              </XGroup>
            </Card>
            <ScrollView>{renderGroupedTransactions()}</ScrollView>
          </YStack>
          {/* {dieselType && (
          <View>
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
            <Button>Save</Button>
          </View>
        )} */}
        </Card>
        <Button
          margin="$2"
          backgroundColor={"white"}
          color={"black"}
          borderRadius={"$10"}
          onPress={handlePlusPress}
          width={"$4"}
          bottom="0"
          left="87%"
        >
          +
        </Button>
      </YStack>
    </View>
  );
};

export default Home;
