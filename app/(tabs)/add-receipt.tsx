import { useAuth } from "@/context/AuthContext";
import { createReceipt } from "@/firebase/firestore";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const categories = [
  "Food",
  "Utilities",
  "Technology",
  "Transport",
  "Shopping",
  "Health",
  "Other",
];

export default function AddReceiptScreen() {
  const [storeName, setStoreName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const { user } = useAuth();

  const handleSave = async () => {
    if (!storeName || !amount || !date) {
      Alert.alert(
        "Missing information",
        "Please enter the store name, amount, and date.",
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }

    try {
      await createReceipt({
        userId: user.uid,
        storeName: storeName.trim(),
        amount: numericAmount,
        category,
        date,
        notes: notes.trim(),
        imageUrl: null,
      });

      Alert.alert("Success", "Receipt saved successfully.");

      // Clear form
      setStoreName("");
      setAmount("");
      setCategory("Food");
      setDate("");
      setNotes("");
    } catch (error) {
      console.error("Create receipt error:", error);

      Alert.alert("Error", "Something went wrong while saving the receipt.");
    }
  };

  console.log({
    storeName,
    amount,
    category,
    date,
    notes,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add Receipt</Text>
        <Text style={styles.subtitle}>Record your expense</Text>
      </View>

      {/* Store name */}
      <View style={styles.field}>
        <Text style={styles.label}>Store Name</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Supermarket"
          placeholderTextColor="#8A969A"
          value={storeName}
          onChangeText={setStoreName}
          autoCapitalize="words"
        />
      </View>

      {/* Amount */}
      <View style={styles.field}>
        <Text style={styles.label}>Amount</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currency}>ETB</Text>

          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#8A969A"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.categoryButton,
                category === item && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Date */}
      <View style={styles.field}>
        <Text style={styles.label}>Date</Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#8A969A"
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      {/* Notes */}
      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>

        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Optional notes..."
          placeholderTextColor="#8A969A"
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Photo */}
      <View style={styles.field}>
        <Text style={styles.label}>Receipt Photo</Text>

        <Pressable
          style={({ pressed }) => [
            styles.photoButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            Alert.alert(
              "Receipt Photo",
              "Camera/gallery functionality will be added next.",
            );
          }}
        >
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoText}>Add Receipt Photo</Text>
        </Pressable>
      </View>

      {/* Save */}
      <Pressable
        style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Receipt</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F8",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    color: "#1D3D47",
    fontSize: 30,
    fontWeight: "700",
  },

  subtitle: {
    color: "#6B7C82",
    fontSize: 15,
    marginTop: 5,
  },

  field: {
    marginBottom: 22,
  },

  label: {
    color: "#1D3D47",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1D3D47",
    borderWidth: 1,
    borderColor: "#E1E6E8",
  },

  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E6E8",
    paddingLeft: 15,
  },

  currency: {
    color: "#1D3D47",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  amountInput: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 15,
    fontSize: 16,
    color: "#1D3D47",
  },

  categoryContainer: {
    gap: 8,
  },

  categoryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E1E6E8",
  },

  categoryButtonActive: {
    backgroundColor: "#1D3D47",
    borderColor: "#1D3D47",
  },

  categoryText: {
    color: "#526268",
    fontSize: 14,
    fontWeight: "500",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  notesInput: {
    height: 100,
  },

  photoButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D7E0E3",
    borderStyle: "dashed",
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  photoIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  photoText: {
    color: "#1D3D47",
    fontSize: 15,
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#FF8A00",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 5,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.7,
  },
});
