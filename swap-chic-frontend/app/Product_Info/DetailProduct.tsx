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
import { useLocalSearchParams, useRouter } from "expo-router";
import { getOneProduct, fetchUserById } from "../../Services/api";
import { useFocusEffect } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Color palette
const COLORS = {
  primary: "#E63946", // Vibrant red
  secondary: "#1A1A1A", // Deep black
  white: "#FFFFFF", // White
  lightGray: "#F8F8F8", // Very light gray
  darkGray: "#333333", // Dark gray
  error: "#FF0000", // Error red
  success: "#2ECC71", // Success green
  info: "#3498DB", // Info blue
};

const DetailProduct = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useUser();
  const { productId } = useLocalSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [userProduct, setUserProduct] = useState(null);

  const fetchData = async () => {
    try {
      if (!productId) {
        Alert.alert("Error", "No product ID found.");
        return;
      }

      setLoading(true);
      const productData = await getOneProduct(productId);
      setProduct(productData);

      if (productData?.userId) {
        const userData = await fetchUserById(productData.userId);
        setUserProduct(userData);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      Alert.alert("Error", "Unable to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [productId])
  );

  const startChat = () => {
    if (!userProduct?.id) {
      Alert.alert("Error", "Unable to start chat: unknown user.");
      return;
    }

    router.push(
      `/Profil_infos/Chat?productId=${productId}&clientId=${user?.id}&productOwnerId=${userProduct.id}`
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons
            name="card-account-details-outline"
            size={28}
            color={COLORS.primary}
          />
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
      </View>

      <View style={styles.productImageContainer}>
        {product.photo ? (
          <Image source={{ uri: product.photo }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Image not available</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfoContainer}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <FontAwesome name="tags" size={16} color={COLORS.info} />
            <Text style={styles.infoText}>
              Category: {product.categoryId?.name || "Not specified"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome name="money" size={16} color={COLORS.info} />
            <Text style={styles.infoText}>
              Price: {product.price || "0"} DH
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.infoText}>
              Condition: {product.condition || "Not specified"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome name="info-circle" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Status: {product.status || "Unknown"}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {showMoreDescription
              ? product.description
              : `${product.description?.slice(0, 150)}...`}
          </Text>
          {product.description?.length > 150 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowMoreDescription(!showMoreDescription)}
            >
              <Text style={styles.showMoreText}>
                {showMoreDescription ? "Show less" : "Show more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {userProduct && (
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <FontAwesome name="user" size={16} color={COLORS.darkGray} />
              <Text style={styles.userText}>
                Posted by: {userProduct.first_name} {userProduct.last_name}
              </Text>
            </View>

            {product.userId !== user?.id && (
              <TouchableOpacity style={styles.chatButton} onPress={startChat}>
                <Text style={styles.chatButtonText}>Start Chat</Text>
                <FontAwesome name="comment" size={18} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    textAlign: "center",
  },
  productImageContainer: {
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  productInfoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.darkGray,
    lineHeight: 24,
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreText: {
    color: COLORS.info,
    fontSize: 16,
  },
  userSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});

export default DetailProduct;
