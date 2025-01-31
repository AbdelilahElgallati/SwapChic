import React, { useState, useCallback, useEffect } from "react";
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
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getProduct,
  getProductSearchName,
  getCategory,
  getProductByCategory,
  addLike,
  removeLike,
  getOneLikeByProductIdAndUserId,
  getAllLikeUser,
} from "../../Services/api";
import { FontAwesome } from "@expo/vector-icons";

// Palette de couleurs
const COLORS = {
  primary: "#E63946", // Rouge vif
  secondary: "#1A1A1A", // Noir profond
  white: "#FFFFFF", // Blanc
  lightGray: "#F8F8F8", // Gris très clair
  darkGray: "#333333", // Gris foncé
  border: "#DDDDDD", // Couleur de bordure
};

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  const fetchUserLikes = useCallback(async () => {
    if (!user?.id) return;
    try {
      const likes = await getAllLikeUser(user.id);
      setLikedProducts(likes.map((like) => like.productId));
    } catch (error) {
      console.error("Error fetching user likes", error);
    }
  }, [user?.id]);

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
      const fetchData = async () => {
        setLoading(true);
        await fetchUserLikes();
        await fetchCategories();
        await fetchProducts();
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserLikes();
    await fetchCategories();
    await fetchProducts();
    setRefreshing(false);
  };

  const handleLike = async (productId) => {
    try {
      const existingLike = await getOneLikeByProductIdAndUserId(
        productId,
        user?.id
      );

      if (existingLike && existingLike.like && existingLike.like._id) {
        await removeLike(existingLike.like._id);
        setLikedProducts((prevLikedProducts) =>
          prevLikedProducts.filter((id) => id !== productId)
        );
      } else {
        const like = { userId: user?.id, productId };
        const response = await addLike(like);

        if (response.data.success) {
          setLikedProducts((prevLikedProducts) => [
            ...prevLikedProducts,
            productId,
          ]);
        }
      }
    } catch (error) {
      console.error(
        "Error handling like",
        error.response ? error.response.data : error
      );
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

  const handleSearchByCategory = async (id) => {
    try {
      setSelectedCategory(id);
      const productSearch = await getProductByCategory(id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Error searching products by category", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Improved Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* <FontAwesome
            name="exchange"
            size={24}
            color="#E53E3E"
            style={styles.logoIcon}
          /> */}
          <Text style={styles.brandName}>
            <Text style={styles.brandAccent}>Swap</Text>Chic
          </Text>
        </View>
        <View style={styles.userActions}>
          {/* <TouchableOpacity style={styles.notificationBtn}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="#000"
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity> */}
          <Image source={{ uri: user?.imageUrl }} style={styles.userAvatar} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Enhanced Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <AntDesign name="search1" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={() => {
                handleSearch();
                Keyboard.dismiss();
              }}
            />
          </View>
        </View>

        {/* Improved Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={[
                styles.categoryBtn,
                selectedCategory === category._id && styles.categoryBtnActive,
              ]}
              onPress={() => handleSearchByCategory(category._id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category._id &&
                    styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Enhanced Products Grid */}
        <View style={styles.productsGrid}>
          {/* {products.map((product) => (
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
                  name={
                    likedProducts.includes(product._id) ? "heart" : "heart-o"
                  }
                  size={18}
                  color={
                    likedProducts.includes(product._id) ? "#E53E3E" : "#fff"
                  }
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
          ))} */}
          {products.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="inventory"
                size={64}
                color={COLORS.darkGray}
              />
              <Text style={styles.emptyStateText}>Aucun produit trouvé</Text>
              <Text style={styles.emptyStateSubtext}>
                Commencez à ajouter vos produits
              </Text>
            </View>
          ) : (
            products.map((product) => (
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
                    name={likedProducts.includes(product._id) ? "heart" : "heart-o"}
                    size={18}
                    color={likedProducts.includes(product._id) ? "#E53E3E" : "#fff"}
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
            ))
          )}
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    marginRight: 8,
  },
  brandName: {
    fontSize: 30,
    fontWeight: "bold",
    elevation: 3,
  },
  brandAccent: {
    color: "#E53E3E",
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBtn: {
    position: "relative",
    marginRight: 16,
    // borderWidth:1,
    padding:3,
    borderRadius:16,
    backgroundColor:"#F5F5F5F5",
  },
  notificationBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#E53E3E",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E53E3E",
  },
  searchWrapper: {
    padding: 20,
    width:"102%",
  },
  searchBar: {
    height:55,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: "#000",
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  categoryBtnActive: {
    backgroundColor: "#E53E3E",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    justifyContent: "space-between",
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
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
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
    textAlign:"right",
    fontSize: 16,
    fontWeight: "600",
    color: "green",
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
});

export default Dashboard;
