// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   RefreshControl,
//   Alert,
// } from "react-native";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useRouter, useFocusEffect } from "expo-router";
// import {
//   getMyProduct,
//   getProductSearchNameUser,
//   getProductByCategoryUser,
//   getCategory,
//   deleteProduct,
// } from "../../Services/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import SearchBar from "@/components/SearchBar";
// import { MaterialIcons } from "@expo/vector-icons";

// const MyProducts = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const { signOut } = useAuth();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       const data = await getMyProduct(user?.id);
//       setProducts(data);
//     } catch (error) {
//       console.error("Error fetching products", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const data = await getCategory();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchProducts();
//       fetchCategories();
//     }, [])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchProducts();
//     await fetchCategories();
//     setRefreshing(false);
//   };

//   const handleSearchByCategory = async (id) => {
//     try {
//       const productSearch = await getProductByCategoryUser(id, user?.id);
//       setProducts(productSearch);
//     } catch (error) {
//       console.error("Erreur lors de la recherche des produits", error);
//     }
//   };

//   const handleSearch = async (searchQuery) => {
//     try {
//       const productSearch = await getProductSearchNameUser(searchQuery, user?.id);
//       setProducts(productSearch);
//     } catch (error) {
//       console.error("Erreur lors de la recherche des produits", error);
//     }
//   };

//   const handleEditProduct = async (productId) => {
//     try {
//       const existingProductId = await AsyncStorage.getItem("productId");
//       if (existingProductId !== null) {
//         await AsyncStorage.removeItem("productId");
//       }
//       await AsyncStorage.setItem("productId", productId);
//       router.push("/Product_Info/EditProduct");
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour du productId:", error);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     setIsDeleting(true);
//     Alert.alert(
//       "Confirmation",
//       "Êtes-vous sûr de vouloir supprimer ce produit ?",
//       [
//         { text: "Annuler", style: "cancel", onPress: () => setIsDeleting(false) },
//         {
//           text: "Supprimer",
//           onPress: async () => {
//             try {
//               const response = await deleteProduct(id);
//               if (response.ok) {
//                 Alert.alert("Succès", "Produit supprimé avec succès.");
//                 await onRefresh();
//               }
//             } catch (error) {
//               console.error("Erreur lors de la suppression du produit:", error);
//             } finally {
//               setIsDeleting(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         contentContainerStyle={styles.contentContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <SearchBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           handleSearch={handleSearch}
//         />

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
//           <View style={styles.categoriesContainer}>
//             {categories.map((category) => (
//               <TouchableOpacity
//                 key={category._id}
//                 style={styles.categoryButton}
//                 onPress={() => handleSearchByCategory(category._id)}
//               >
//                 <Text style={styles.categoryText}>{category.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </ScrollView>

//         <View style={styles.productsContainer}>
//           {products.map((item) => (
//             <View key={item._id} style={styles.productCard}>
//               <Image source={{ uri: item.photo }} style={styles.productImage} />
//               <View style={styles.productInfo}>
//                 <Text style={styles.productName}>{item.name}</Text>
//                 <Text style={styles.productPrice}>${item.price}</Text>
//               </View>
//               <View style={styles.iconContainer}>
//                 <TouchableOpacity
//                   onPress={() => handleEditProduct(item._id)}
//                   style={styles.iconButton}
//                 >
//                   <MaterialIcons name="edit" size={24} color="black" />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => handleDeleteProduct(item._id)}
//                   style={styles.iconButton}
//                 >
//                   <MaterialIcons name="delete" size={24} color="red" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
  
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f8f8",
//     marginBottom: 60,
//   },
//   horizontalScroll: {
//     marginTop: 8,
//     paddingHorizontal: 8,
//   },
//   categoriesContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   categoryButton: {
//     backgroundColor: "#e0e0e0",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginHorizontal: 4,
//   },
//   categoryText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   productsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-around",
//   },
//   productCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     elevation: 4,
//     overflow: "hidden",
//     alignItems: "center",
//     width: 175,
//     marginBottom: 16,
//     position: "relative",
//   },
//   productImage: {
//     width: 180,
//     height: 160,
//     resizeMode: "cover",
//   },
//   productInfo: {
//     padding: 8,
//     alignItems: "center",
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   productPrice: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   iconContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   iconButton: {
//     padding: 5,
//   },
//   productRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     elevation: 3,
//   },
//   searchContainer: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FAFAFAFA",
//     borderRadius: 25,
//     paddingLeft: 15,
//     height: 50,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//     height: 50,
//     paddingVertical: 10,
//   },
//   searchButton: {
//     padding: 12,
//     borderRadius: 25,
//     backgroundColor: "#FAFAFAFA",
//   },
//   notificationButton: {
//     marginRight: 20,
//     borderRadius: 20,
//     padding: 8,
//     backgroundColor: "#F5F5F5F5",
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
 
// });

// export default MyProducts;

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  getMyProduct,
  getProductSearchNameUser,
  getProductByCategoryUser,
  getCategory,
  deleteProduct,
} from "../../Services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "@/components/SearchBar";
import { MaterialIcons } from "@expo/vector-icons";

// Palette de couleurs
const COLORS = {
  primary: '#E63946',     // Rouge vif
  secondary: '#1A1A1A',   // Noir profond
  white: '#FFFFFF',       // Blanc
  lightGray: '#F8F8F8',   // Gris très clair
  darkGray: '#333333',    // Gris foncé
  border: '#DDDDDD',      // Couleur de bordure
};

const MyProducts = () => {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fonctions existantes...
  const fetchProducts = async () => {
    try {
      const data = await getMyProduct(user?.id);
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

  const handleSearchByCategory = async (id) => {
    try {
      setSelectedCategory(id);
      const productSearch = await getProductByCategoryUser(id, user?.id);
      setProducts(productSearch);
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const handleSearch = async (searchQuery) => {
    try {
      if(searchQuery !== null) {
        const productSearch = await getProductSearchNameUser(searchQuery, user?.id);
        setProducts(productSearch);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche des produits", error);
    }
  };

  const handleEditProduct = async (productId) => {
    try {
      const existingProductId = await AsyncStorage.getItem("productId");
      if (existingProductId !== null) {
        await AsyncStorage.removeItem("productId");
      }
      await AsyncStorage.setItem("productId", productId);
      router.push("/Product_Info/EditProduct");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du productId:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    setIsDeleting(true);
    Alert.alert(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer ce produit ?",
      [
        { 
          text: "Annuler",
          style: "cancel",
          onPress: () => setIsDeleting(false)
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await deleteProduct(id);
              if (response.ok) {
                Alert.alert("Succès", "Produit supprimé avec succès");
                await onRefresh();
              }
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
              Alert.alert("Erreur", "Impossible de supprimer le produit");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Produits</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/addProduct")}
        >
          <MaterialIcons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
        >
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category._id && styles.categoryButtonSelected
                ]}
                onPress={() => handleSearchByCategory(category._id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category._id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.productsGrid}>
          {products.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inventory" size={64} color={COLORS.darkGray} />
              <Text style={styles.emptyStateText}>Aucun produit trouvé</Text>
              <Text style={styles.emptyStateSubtext}>
                Commencez à ajouter vos produits
              </Text>
            </View>
          ) : (
            products.map((item) => (
              <View key={item._id} style={styles.productCard}>
                <Image source={{ uri: item.photo }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>{item.price} DH</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleEditProduct(item._id)}
                    style={styles.actionButton}
                  >
                    <MaterialIcons name="edit" size={22} color={COLORS.darkGray} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteProduct(item._id)}
                    style={[styles.actionButton, styles.deleteButton]}
                  >
                    <MaterialIcons name="delete" size={22} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
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
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 8,
  },
  contentContainer: {
    padding: 16,
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  deleteButton: {
    backgroundColor: COLORS.lightGray,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MyProducts;