import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BASE_URL } from "@/Services/api";

const Connection = () => {
  const router = useRouter();
  const { user } = useUser();

  const [senders, setSenders] = useState([]);
  const [productOwners, setProductOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.error("User not authenticated");
          return;
        }

        const [sendersResponse, ownersResponse] = await Promise.all([
          axios.get(`${BASE_URL}/message/receiver/${user.id}`),
          axios.get(`${BASE_URL}/message/client/${user.id}`),
        ]);
        setSenders(sendersResponse.data);
        setProductOwners(ownersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleProductPressAsProductOwner = (product, clientId) => {
    router.push(
      `/Profil_infos/Chat?productId=${product._id}&productOwnerId=${user?.id}&clientId=${clientId}`
    );
  };

  const handleProductPressAsClient = (product, productOwnerId) => {
    router.push(
      `/Profil_infos/Chat?productId=${product._id}&productOwnerId=${product.userId}&clientId=${user?.id}`
    );
  };

  const handleCreateTransaction = async (product, clientId) => {
    try {
      const transactionData = {
        senderId: clientId,
        receiverId: user?.id,
        productId: product._id,
        status: "pending",
      };

      const response = await axios.post(
        `${BASE_URL}/transaction/add`,
        transactionData
      );
      alert("Transaction successfully created!");
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Please wait, loading data...</Text>
      </View>
    );
  }

  const renderSection = (title, data, renderFunction) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.header}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.emptyListText}>No data available.</Text>
      ) : (
        data.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.senderName || item.receiverName}</Text>
            <Text style={styles.itemText}>{item.senderEmail || item.receiverEmail}</Text>
            {item.products.map((product) => renderFunction(product, item))}
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection("The Clients", senders, (product, item) => (
        <View key={product._id} style={styles.productRow}>
          <Icon name="shopping-cart" size={24} color="#e63946" style={styles.icon} />
          <TouchableOpacity
            onPress={() => handleProductPressAsProductOwner(product, item.senderId)}
          >
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.transactionButton}
            onPress={() => handleCreateTransaction(product, item.senderId)}
          >
            <Text style={styles.buttonText}>Create Transaction</Text>
          </TouchableOpacity>
        </View>
      ))}

      {renderSection("The Product Owners", productOwners, (product, item) => (
        <View key={product._id} style={styles.productRow}>
          <Icon name="shopping-cart" size={24} color="#e63946" style={styles.icon} />
          <TouchableOpacity
            onPress={() => handleProductPressAsClient(product, item.senderId)}
          >
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  sectionContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderColor: "#e63946",
    borderWidth: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e63946",
    marginBottom: 8,
  },
  itemContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#e63946",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 4,
    borderColor: "#e63946",
    borderWidth: 1,
  },
  productName: {
    fontSize: 16,
    color: "#333333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333333",
  },
  emptyListText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    marginTop: 16,
  },
  icon: {
    marginRight: 8,
  },
  transactionButton: {
    marginLeft: "auto",
    backgroundColor: "#e63946",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Connection;
