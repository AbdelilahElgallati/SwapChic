import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useUser } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  addLike,
  getAllLikeUserId,
  getOneLikeByProductIdAndUserId,
  getProductSearchName,
  removeLike,
} from "../../Services/api";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";

// Color palette
const COLORS = {
  primary: "#E63946",
  secondary: "#1A1A1A",
  white: "#FFFFFF",
  lightGray: "#F8F8F8",
  darkGray: "#333333",
  border: "#DDDDDD",
};

const Favorite = () => {
  const router = useRouter();
  const { idCategory } = useLocalSearchParams();
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserLikes = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const likes = await getAllLikeUserId(user.id);
      setLikedProducts(likes || []);
    } catch (error) {
      setError("Erreur lors du chargement des favoris");
      console.error("Error fetching user likes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchUserLikes();
    }, [fetchUserLikes])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserLikes();
    setRefreshing(false);
  }, [fetchUserLikes]);

  const handleLike = useCallback(async (productId) => {
    if (!user?.id) {
      // Handle not logged in state
      return;
    }

    try {
      const existingLike = await getOneLikeByProductIdAndUserId(productId, user.id);

      if (existingLike?.like?._id) {
        await removeLike(existingLike.like._id);
        setLikedProducts(prev => prev.filter(product => product._id !== productId));
      } else {
        const response = await addLike({ userId: user.id, productId });
        if (response?.data?.success) {
          const updatedLikes = await getAllLikeUserId(user.id);
          setLikedProducts(updatedLikes || []);
        }
      }
    } catch (error) {
      console.error("Error handling like:", error?.response?.data || error);
    }
  }, [user?.id]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await getProductSearchName(query);
      setProducts(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToProductDetail = useCallback((productId) => {
    router.push(`/Product_Info/DetailProduct?productId=${productId}`);
  }, [router]);

  const renderEmptyState = useMemo(() => (
    <View style={styles.emptyState}>
      <MaterialIcons name="inventory" size={64} color={COLORS.darkGray} />
      <Text style={styles.emptyStateText}>Aucun produit trouvé</Text>
      <Text style={styles.emptyStateSubtext}>
        Commencez à liker vos produits préférés
      </Text>
    </View>
  ), []);

  const renderProduct = useCallback(({ item: product }) => (
    <TouchableOpacity
      key={product._id}
      style={styles.productCard}
      onPress={() => goToProductDetail(product._id)}
    >
      <Image
        source={{ uri: product.photo }}
        style={styles.productImage}
      />
      <TouchableOpacity
        style={styles.likeBtn}
        onPress={() => handleLike(product._id)}
      >
        <FontAwesome
          name={likedProducts.some(p => p._id === product._id) ? "heart" : "heart-o"}
          size={18}
          color={likedProducts.some(p => p._id === product._id) ? "#E53E3E" : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productType}>{product.type}</Text>
        {product.type !== "exchange" && product.type !== "gift" && (
          <Text style={styles.productPrice}>{product.price} DH</Text>
        )}
      </View>
    </TouchableOpacity>
  ), [goToProductDetail, handleLike, likedProducts]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserLikes}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <AntDesign name="heart" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Mes produits favoris</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <AntDesign name="search1" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher des produits..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <View style={styles.productsGrid}>
            {(searchQuery ? products : likedProducts).length === 0 
              ? renderEmptyState
              : (searchQuery ? products : likedProducts).map(product => renderProduct({ item: product }))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  searchWrapper: {
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    paddingBottom: 80,
    marginBottom: 80,
  },
  productCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  likeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  productDetails: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E53E3E",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    width: "100%",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default Favorite;
