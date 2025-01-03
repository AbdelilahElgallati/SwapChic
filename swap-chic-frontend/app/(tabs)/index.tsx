import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  Keyboard,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getProduct,
  getProductSearchName,
  getCategory,
  getProductByCategory,
  fetchUsers,
} from "../../Services/api";
import { FontAwesome } from "@expo/vector-icons";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  fetchUsers();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

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
      router.push(`/Product_Info/DetailProduct?productId=${productId}`);
    } catch (error) {
      console.error("Error navigating to product detail", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const productSearch = await getProductSearchName(searchQuery);
        setProducts(productSearch);
      } catch (error) {
        console.error("Error searching products", error);
      }
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>
          <Text style={styles.letter}>Swap</Text>Chic
        </Text>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications-none" size={22} color="black" />
          </TouchableOpacity>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              handleSearch();
              Keyboard.dismiss();
            }}
            style={styles.searchButton}
          >
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
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

     
      <View style={styles.productsContainer}>
        {Array.from({ length: Math.ceil(products.length / 2) }, (_, i) => (
          <View key={`row-${i}`} style={styles.productRow}>
            {products.slice(i * 2, (i + 1) * 2).map((product) => (
              <View key={product._id} style={styles.productCard}>
                <TouchableOpacity onPress={() => goToProductDetail(product._id)}>
                  <Image source={{ uri: product.photo }} style={styles.productImage} />
                </TouchableOpacity>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleLike(product._id)}
                  style={styles.likeButton}
                >
                  <FontAwesome
                    name={likedProducts.includes(product._id) ? "heart" : "heart-o"}
                    size={16}
                    color={likedProducts.includes(product._id) ? "#fff" : "gray"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
  productsContainer: {
    padding: 8,
    paddingBottom: 90,
    
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    elevation: 3,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFAFA",
    borderRadius: 25,
    paddingLeft: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: 50,
    paddingVertical: 10,
  },
  searchButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#FAFAFAFA",
  },
  notificationButton: {
    marginRight: 20,
    borderRadius: 20,
    padding: 8,
    backgroundColor: "#F5F5F5F5",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: "#FAFAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    height: 40,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    overflow: "hidden",
    alignItems: "center",
    maxWidth: "48%",
  },
  productImage: {
    width: 180,
    height: 180,
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  productInfo: {
    padding: 8,
    alignItems: "center",
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#4FBF26",
    marginTop: 4,
  },
  likeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 6,
  },
  letter: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 35,
    textShadowColor: "#da051d",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#da051d",
    marginLeft: -15,
    marginTop: -10,
    padding: 5,
    width: "70%",
    textShadowColor: "gray",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  emptyCard: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
});

export default Dashboard;