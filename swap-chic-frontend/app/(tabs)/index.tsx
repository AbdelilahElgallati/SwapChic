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
  fetchUsers,
} from "../../Services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  fetchUsers();

  const handeleSignOut = async () => {
    try {
      await signOut();
      // navigation.navigate('index')
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
      <View style={styles.header}>
        <Text style={styles.title}>SWAP-CHIC</Text>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handeleSignOut}>
            <Image
              source={require("../../assets/images/logout.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
        </View>
      </View>

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    // backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: "#333",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 4,
    marginBottom: 10,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 12,
  },
  searchButton: {
    marginLeft: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#3498db",
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
    justifyContent: "space-between",
  },
});

export default Dashboard;
