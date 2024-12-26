import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import { getProduct } from "../../Services/api";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProduct();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.photo }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.categoryId.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Prix: {item.price} DH</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.userName}>
            Bienvenue, {user?.firstName || "Utilisateur"}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.productsTitle}>Produits</Text>

        <View style={styles.productList}>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={styles.containerProductList}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F5F7FA",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C3E50",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  productsTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center"
  },
  containerProductList: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: "#F0F0F0", // fallback for missing images
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2C3E50",
  },
  productCategory: {
    color: "#888",
    marginBottom: 5,
  },
  productDescription: {
    color: "#666",
    marginBottom: 5,
  },
  productPrice: {
    fontWeight: "bold",
    color: "#3498DB",
    fontSize: 16,
  },
});

export default Dashboard;
