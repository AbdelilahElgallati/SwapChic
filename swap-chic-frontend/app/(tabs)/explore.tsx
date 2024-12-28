import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getProduct,
  getProductSearchName,
  getCategory,
  getProductByCategory,
} from "../../Services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";

const explore = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getProduct();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      fetchCategories();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    await fetchCategories();
    setRefreshing(false);
  };

  const handleLike = (productId) => {
    setLikedProducts((prevLikedProducts) =>
      prevLikedProducts.includes(productId)
        ? prevLikedProducts.filter((id) => id !== productId)
        : [...prevLikedProducts, productId]
    );
  };

  const handleSearchByCategory = async (id) => {
    try {
      const productSearch = await getProductByCategory(id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const goToProductDetail = async (productId) => {
    try {
      await AsyncStorage.setItem("productId", productId);
      router.push(`/Product_Info/DetailProduct`);
    } catch (error) {
      console.error("Error navigating to product detail", error);
    }
  };

  const handleSearch = async (searchQuery: String) => {
    try {
      const productSearch = await getProductSearchName(searchQuery);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => goToProductDetail(item._id)}>
        <Image source={{ uri: item.photo }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleLike(item._id)}
        style={styles.likeButton}
      >
        <FontAwesome
          name={likedProducts.includes(item._id) ? "heart" : "heart-o"}
          size={24}
          color={likedProducts.includes(item._id) ? "red" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryButton}
              onPress={() => handleSearchByCategory(category._id)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  horizontalScroll: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  contentContainer: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
    alignItems: "center",
    width: 200,
    marginBottom: 16,
  },
  productImage: {
    width: 200,
    height: 180,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 8,
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  likeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 4,
  },
  row: {
    flex: 1,
    justifyContent: "space-around", // Maintient les cartes centrées même pour une seule
    // marginBottom: 16,
  },
});

export default explore;
