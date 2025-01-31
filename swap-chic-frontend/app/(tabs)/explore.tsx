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
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useUser } from "@clerk/clerk-react";
import { useRouter, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getCategoriesWithProductCount, getCategorySearchName } from "../../Services/api";

const COLORS = {
  primary: '#E63946',     // Rouge vif
  secondary: '#1A1A1A',   // Noir profond
  white: '#FFFFFF',       // Blanc
  lightGray: '#F8F8F8',   // Gris très clair
  darkGray: '#333333',    // Gris foncé
  error: '#FF0000',       // Rouge erreur
};

const Explore = () => {
  const router = useRouter();
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesWithProductCount();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const handleSearchByCategory = async (id) => {
    try {
      router.push(`/Product_Info/ProductCategory?idCategory=${id}`);
    } catch (error) {
      console.error("Error fetching products by category", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const searchResults = await getCategorySearchName(query);
      setCategories(searchResults);
    } catch (error) {
      console.error("Error searching products by name", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Improved Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome name="compass" size={30} color={COLORS.primary} style={styles.logoIcon} />
          <Text style={styles.headerTitle}>Categories</Text>
        </View>
        <View style={styles.userActions}>
          {/* <TouchableOpacity style={styles.notificationBtn}>
            <MaterialIcons name="notifications-none" size={24} color="#000" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity> */}+
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <AntDesign name="search1" size={24} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch(searchQuery)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Categories Grid */}
        <View style={styles.categoriesWrapper}>
          { 
            categories.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="inventory"
                  size={64}
                  color={COLORS.darkGray}
                />
                <Text style={styles.emptyStateText}>Aucun categorie trouvé</Text>
              </View>
            ) :
            (categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryCard}
              onPress={() => handleSearchByCategory(category._id)}
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryImage}
                imageStyle={styles.backgroundImage}
              >
                <View style={styles.overlay} />
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={styles.productCount}>
                    <MaterialIcons name="shopping-bag" size={16} color={COLORS.white} />
                    <Text style={styles.countText}>{category.productCount} Products</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
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
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.secondary,
  },
  categoriesWrapper: {
    padding: 10,
    paddingBottom: 80,
  },
  categoryCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
  categoryContent: {
    padding: 16,
    backgroundColor:"rgba(0,0,0,0.3)",
    elevation:0.5,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  productCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
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


//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.contentContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View>
//           <View style={styles.header}>
//             <Text style={styles.brandTitle}>Categories</Text>
//             <View style={styles.userInfo}>
//               <TouchableOpacity style={styles.notificationButton}>
//                 <MaterialIcons
//                   name="notifications-none"
//                   size={22}
//                   color="black"
//                 />
//               </TouchableOpacity>
//               <Image
//                 source={{ uri: user?.imageUrl }}
//                 style={styles.profileImage}
//               />
//             </View>
//           </View>
//           <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//             <View style={styles.searchBar}>
//               <TouchableOpacity
//                 onPress={() => handleSearch(searchQuery)}
//                 style={styles.searchButton}
//               >
//                 <AntDesign name="search1" size={24} color="black" />
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search Categories"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>
//           </TouchableWithoutFeedback>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.horizontalScroll}
//           >
//             <View style={styles.container}>
//               {categories.map((category) => (
//                 <TouchableOpacity
//                   key={category._id}
//                   style={styles.productCard}
//                   onPress={() => handleSearchByCategory(category._id)}
//                 >
//                   <ImageBackground
//                     source={{ uri: category.image }}
//                     style={styles.productImage}
//                   >
//                     <View style={styles.textContainer}>
//                       <Text style={styles.categoryText}>{category.name}</Text>
//                       <Text style={styles.nb}>
//                         {category.productCount} Products
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     marginBottom: 40,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     elevation: 3,
//   },
//   brandTitle: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#da051d",
//     marginLeft: -15,
//     marginTop: -10,
//     padding: 5,
//     width: "70%",
//     textShadowColor: "gray",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 5,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   notificationButton: {
//     marginRight: 20,
//     borderRadius: 20,
//     padding: 8,
//     backgroundColor: "#F5F5F5",
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   searchBar: {
//     height: 50,
//     marginTop: 20,
//     flexDirection: "row",
//     padding: 5,
//     alignItems: "center",
//     backgroundColor: "#FAFAFAFA",
//     marginBottom: 10,
//     borderRadius: 40,
//     paddingHorizontal: 15,
//     justifyContent: "space-between",
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     marginLeft: -10,
//     marginBottom: -4,
//     paddingVertical: 12,
//   },
//   searchButton: {
//     padding: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   horizontalScroll: {
//     marginTop: 8,
//     paddingHorizontal: 8,
//   },
//   productCard: {
//     flex: 1,
//     margin: 8,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     elevation: 5,
//     overflow: "hidden",
//     width: 350,
//     height: 200,
//   },
//   productImage: {
//     width: 350,
//     height: 210,
//     resizeMode: "cover",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   textContainer: {
//     position: "absolute",
//     bottom: 10,
//     left: 0,
//     right: 0,
//     padding: 10,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     borderRadius: 10,
//   },
//   categoryText: {
//     fontSize: 22,
//     color: "#fff",
//     fontWeight: "400",
//   },
//   nb: {
//     fontSize: 16,
//     color: "#F5F5F5F5",
//   },
//   contentContainer: {
//     padding: 10,
//   },
//   rowContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
// });

export default Explore;
