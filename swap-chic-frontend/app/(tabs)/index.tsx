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
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react"; 
import { useRouter, useFocusEffect } from "expo-router";
import CategoryScroll from "../../components/CategoryScroll";
import { getProduct } from "../(services)/api/api";
import ProductCard from "../../components/productCard";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const fetchProducts = async () => {
    try {
      const data = await getProduct();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des porduit", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Gestion du rafraîchissement (Pull-to-Refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleSearch = (query) => {
    Alert.alert("Recherche", `Vous avez recherché : ${query}`);
  };

  const navigateToProductDetails = (product) => {
    console.log(product);
    // router.push(`/product/${product._id}`);
  };

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

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(searchQuery)}
          >
            <Image
              source={require("../../assets/images/search.png")}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        <CategoryScroll />

        <View style={styles.productList}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onPress={navigateToProductDetails}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 10,
  },
  searchButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#3498DB",
  },
  productList: {
    marginTop: 20,
  },
});

export default Dashboard;
