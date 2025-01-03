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
  Linking,
} from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { getOneProduct, fetchUserById } from "../../Services/api";
import { useFocusEffect, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const DetailProduct = () => {
  const router = useRouter();
  const {user} = useUser();
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [userProduct, setUserProduct] = useState(null);

  const fetchProductId = async () => {
    try {
      // const storedProductId = await AsyncStorage.getItem("productId");
      if (productId) {
        await fetchProduct(productId);
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
      fetchUserId(data.userId);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      Alert.alert("Erreur", "Impossible de charger les détails du produit.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async (userId) => {
    try {
      setLoading(true);
      const data = await fetchUserById(userId);
      setUserProduct(data);
    } catch (error) {
      console.error("Erreur lors de la récupération d'utilisateur:", error);
      Alert.alert("Erreur", "Impossible de charger les détails d'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

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

  const startChat = (receiverId, productId) => {
    const clientId = user?.id; 
    const productOwnerId = receiverId;
    if (!receiverId) {
      Alert.alert(
        "Erreur",
        "Impossible de démarrer une discussion : utilisateur inconnu."
      );
      return;
    }
    router.push(`/Profil_infos/Chat?productId=${productId}&clientId=${clientId}&productOwnerId=${productOwnerId}`);
  };

  const handleShowMoreDescription = () => {
    setShowMoreDescription(!showMoreDescription);
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
      <View style={styles.productImageContainer}>
        {product.photo ? (
          <Image source={{ uri: product.photo }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>
              Image non disponible
            </Text>
          </View>
        )}
      </View>

      <View style={styles.productInfoContainer}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={styles.productDetails}>
          <Text style={styles.productCategory}>
            <FontAwesome name="tags" size={16} color="#3498db" />{" "}
            {product.categoryId?.name || "Non spécifiée"}
          </Text>
          <Text style={styles.productPrice}>
            <FontAwesome name="dollar" size={16} color="#3498db" />{" "}
            {product.price || "0"} €
          </Text>
        </View>

        <View style={styles.productConditionStatus}>
          <Text style={styles.productCondition}>
            <FontAwesome name="check-circle" size={16} color="#2ecc71" />{" "}
            Condition : {product.condition || "Non spécifiée"}
          </Text>
          <Text style={styles.productStatus}>
            <FontAwesome name="info-circle" size={16} color="#e74c3c" /> Statut
            : {product.status || "Inconnu"}
          </Text>
        </View>

        <Text style={styles.productDescription}>
          {showMoreDescription
            ? product.description
            : product.description.slice(0, 150) + "..."}
        </Text>
        {product.description && product.description.length > 150 && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={handleShowMoreDescription}
          >
            <Text style={styles.showMoreText}>
              {showMoreDescription ? "Voir moins" : "Voir plus"}
            </Text>
          </TouchableOpacity>
        )}

        {userProduct && (
          <>
            <Text style={styles.productUser}>
              <FontAwesome name="user" size={16} color="#333" /> Posté par :{" "}
              {userProduct.first_name} {userProduct.last_name}
            </Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => startChat(userProduct.id, product._id)}
            >
              <Text style={styles.chatButtonText}>Démarrer une discussion</Text>
              <FontAwesome name="comment" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
  },
  productImageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  productImage: {
    width: 300,
    height: 250,
    borderRadius: 16,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: 300,
    height: 250,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#333",
  },
  productInfoContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  productDetails: {
    marginBottom: 16,
  },
  productCategory: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 12,
  },
  productConditionStatus: {
    marginBottom: 16,
  },
  productCondition: {
    fontSize: 16,
    color: "#2ecc71",
    marginBottom: 8,
  },
  productStatus: {
    fontSize: 16,
    color: "#e74c3c",
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreText: {
    color: "#3498db",
    fontSize: 16,
  },
  productUser: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  chatButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 8,
  },
});

export default DetailProduct;
