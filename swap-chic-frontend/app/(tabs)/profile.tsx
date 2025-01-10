import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import bg from "@/assets/images/bgPrf.jpg";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export default function Profil() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // const handleLogout = async () => {
  //   try {
  //     console.log("Logging out...");
  //     await signOut();
  //     console.log("User signed out, redirecting...");
  //     // router.replace("/");
  //   } catch (error) {
  //     console.error("Failed to log out:", error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");

      // Redirection avant le signOut
      router.replace("../");

      // Ensuite signOut
      await signOut();

      console.log("User signed out and redirected");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image source={bg} style={styles.headerImage} />
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
        <View style={styles.boxContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => router.push(item.route)}
            >
              <Icon name={item.icon} size={24} color="#1a1a1a" />
              <Text style={styles.boxText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AntDesign name="logout" size={24} color="#1a1a1a" />
            <Text style={styles.boxText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const menuItems = [
  {
    label: "My Products",
    route: "/Product_Info/MyProducts",
    icon: "shopping-bag",
  },
  {
    label: "Favorite",
    route: "/Profil_infos/Favorite",
    icon: "favorite-outline",
  },
  {
    label: "Demande Discussion",
    route: "/Profil_infos/DemandeDiscussion",
    icon: "forum",
  },
  {
    label: "Mes Conversations",
    route: "/Profil_infos/Connection",
    icon: "chat",
  },
  {
    label: "Transaction",
    route: "/Profil_infos/Transaction",
    icon: "swap-horiz",
  },
  { label: "Achat", route: "/Profil_infos/Achat", icon: "shopping-cart" },
];

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
    bottom: 0,
  },
  container: {
    flex: 1,
    // backgroundColor: "#1a1a1a",
    backgroundColor: "#fff",
    marginBottom: 80,
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#da051d",
  },
  userName: {
    fontSize: 24,
    color: "#1a1a1a",
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#bbb",
  },
  boxContainer: {
    padding: 20,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#da051d",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  boxText: {
    color: "#1a1a1a",
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
  },
});
