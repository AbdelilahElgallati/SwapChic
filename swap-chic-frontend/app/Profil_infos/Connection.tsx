import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const exampleVendors = [
  { id: 1, name: "Vendeur 1" },
  { id: 2, name: "Vendeur 2" },
  { id: 3, name: "Vendeur 3" },
  { id: 4, name: "Vendeur 4" },
  { id: 5, name: "Vendeur 5" },
];

const Connection = () => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const filteredVendors = exampleVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleVendorSelect = (vendor) => {
    navigation.navigate("Chat", { vendor });
    // Fetch and display the latest messages for the selected vendor
    // This is a placeholder for the actual implementation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Connections</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Rechercher un vendeur"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          onPress={() => {
            /* Trigger search action */
          }}
          style={styles.icon}
        >
          <MaterialCommunityIcons
            name="account-search"
            size={35}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleVendorSelect(item)}>
            <Text style={styles.vendorName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff", // Light blue background color
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4682b4", // Steel blue text color
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#4682b4", // Steel blue text color
  },
  vendorName: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#2f4f4f", // Dark slate gray text color
  },
  input: {
    height: 40,
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: "#fff", // White background color for input
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 2,
  },
});

export default Connection;
