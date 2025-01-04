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
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import { getProductByCategory, getProductSearchName } from "../../Services/api";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const ProductCategory = () => {
  const router = useRouter();
  const { idCategory } = useLocalSearchParams();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getProductByCategory(idCategory);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
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

  const handleLike = (productId) => {
    setLikedProducts((prevLikedProducts) =>
      prevLikedProducts.includes(productId)
        ? prevLikedProducts.filter((id) => id !== productId)
        : [...prevLikedProducts, productId]
    );
  };

  const goToProductDetail = async (productId) => {
    try {
      router.push(`/Product_Info/DetailProduct?productId=${productId}`);
    } catch (error) {
      console.error("Error navigating to product detail", error);
    }
  };

  const handleSearch = async (searchQuery) => {
    try {
      const productSearch = await getProductSearchName(searchQuery);
      setProducts(productSearch);
    } catch (error) {
      console.error("Error searching products", error);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>
          <Text style={styles.letter}>Swap</Text>Chic
        </Text>
        <View style={styles.userInfo}>
          <TouchableOpacity
            style={{
              marginRight: 20,
              borderRadius: 20,
              padding: 8,
              backgroundColor: "#F5F5F5",
            }}
          >
            <MaterialIcons name="notifications-none" size={22} color="black" />
          </TouchableOpacity>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => handleSearch(searchQuery)}
          style={styles.searchButton}
        >
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Product"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderHeader()}
        <View style={styles.row}>
          {products.map((item) => (
            <View key={item._id} style={styles.productCard}>
              <TouchableOpacity onPress={() => goToProductDetail(item._id)}>
                <Image
                  key={item._id}
                  source={{ uri: item.photo }}
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} DH</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleLike(item._id)}
                style={styles.likeButton}
              >
                <FontAwesome
                  name={likedProducts.includes(item._id) ? "heart" : "heart-o"}
                  size={16}
                  color={likedProducts.includes(item._id) ? "#fff" : "gray"}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    elevation: 3,
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
  searchBar: {
    height: 50,
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
    borderRadius: 40,
    paddingHorizontal: 15,
  },
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 15,
    justifyContent: "center",
    marginLeft: -10,
    marginBottom: -4,
    paddingVertical: 12,
  },
  searchButton: {
    marginLeft: 4,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    overflow: "hidden",
    alignItems: "center",
    width: "45%",
    height: 300,
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
    color: "#da051d",
    marginLeft: -15,
    marginTop: -10,
    padding: 5,
    width: "70%",
    textShadowColor: "gray",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default ProductCategory;
