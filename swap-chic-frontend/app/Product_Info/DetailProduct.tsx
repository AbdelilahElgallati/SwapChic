import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOneProduct } from "../../Services/api";
import { useFocusEffect } from "expo-router";
// import { clerkClient } from "@clerk/clerk-sdk-node";

const DetailProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // const [poster, setPoster] = useState("");

  const fetchProductId = async () => {
    try {
      const storedProductId = await AsyncStorage.getItem("productId");
      if (storedProductId) {
        await fetchProduct(storedProductId); 
      } else {
        Alert.alert("Erreur", "Aucun ID de produit trouvé.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'ID du produit:",
        error
      );
    }
  };

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      const data = await getOneProduct(productId);
      setProduct(data);
      // const posterName = await clerkClient.users.getUser(data.userId);
      // setPoster(posterName.firstName);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      Alert.alert("Erreur", "Impossible de charger les détails du produit.");
    } finally {
      setLoading(false);
    }
  };

  // const fetchUserName = async (userId) => {
  //   try {
  //     const user = await clerkClient.users.getUser(userId);
  //     return user.firstName || "Utilisateur inconnu";
  //   } catch (error) {
  //     console.error("Erreur:", error);
  //     return "Erreur";
  //   }
  // };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProductId();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProductId();
    }, [])
  );

  const startChat = (userId) => {
    console.log("Démarrer une discussion avec:", userId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produit non trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {product.photo ? (
        <Image source={{ uri: product.photo }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Image non disponible</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>
          Catégorie : {product.categoryId?.name || "Non spécifiée"}
        </Text>
        <Text style={styles.price}>Prix : {product.price || "0"} €</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.condition}>
          Condition : {product.condition || "Non spécifiée"}
        </Text>
        <Text style={styles.status}>
          Statut : {product.status || "Inconnu"}
        </Text>
        {product.userId && (
          <Text style={styles.user}>Posté par : {product.userId}</Text>
        )}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => startChat(product.userId)}
        >
          <Text style={styles.chatButtonText}>Démarrer une discussion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    backgroundColor: "#E9ECEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholderText: {
    color: "#6C757D",
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#212529",
  },
  category: {
    fontSize: 16,
    marginBottom: 10,
    color: "#6C757D",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#28A745",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#495057",
  },
  condition: {
    fontSize: 16,
    marginBottom: 10,
    color: "#495057",
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    color: "#17A2B8",
  },
  user: {
    fontSize: 16,
    marginBottom: 10,
    color: "#343A40",
  },
  chatButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  errorText: {
    fontSize: 18,
    color: "#DC3545",
    fontWeight: "bold",
  },
});

export default DetailProduct;
