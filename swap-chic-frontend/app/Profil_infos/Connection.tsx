import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const Connection = () => {
  const router = useRouter();
  const [senders, setSenders] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        if (!user) {
          console.error("User not authenticated");
          return;
        }
        const response = await axios.get(
          `http://192.168.167.74:3001/message/receiver/${user.id}`
        );
        setSenders(response.data);
      } catch (error) {
        console.error("Error fetching senders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSenders();
  }, [user]);

  const handleProductPress = (product, clientId) => {
    router.push(`/Profil_infos/Chat?productId=${product._id}&productOwnerId=${user?.id}&clientId=${clientId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <Text style={styles.subHeader}>Users who sent you messages:</Text>
      <FlatList
        data={senders}
        keyExtractor={(item) => item.senderId}
        ListEmptyComponent={<Text style={styles.emptyListText}>No messages found.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.senderItem}
            onPress={() => setSelectedSender(item)}
          >
            <Text style={styles.senderName}>{item.senderName}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedSender && (
        <View style={styles.productsContainer}>
          <Text style={styles.selectedHeader}>
            Products discussed with {selectedSender.senderName}:
          </Text>
          <FlatList
            data={selectedSender.products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => handleProductPress(item, selectedSender.senderId)}
              >
                <Text style={styles.productName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
  },
  senderItem: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  selectedHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 8,
  },
  productItem: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 4,
  },
  productName: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  emptyListText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});

export default Connection;