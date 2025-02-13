import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function Profil() {
  const router = useRouter();
  // const navigation = useNavigation();
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
        setIsSigningOut(true);
        await signOut();
        router.replace("/Redirect/redirect");
    } catch (err) {
        console.error("Logout error:", err);
        Alert.alert("Erreur", "La déconnexion a échoué. Veuillez réessayer.");
    } finally {
        setIsSigningOut(false);
    }
}, [signOut, router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
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
              <Icon name={item.icon} size={24} color="#000" />
              <Text style={styles.boxText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <SimpleLineIcons name="logout" size={24} color="#da051d" />
            <Text style={styles.boxlogout}>Log out</Text>
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
    width: 120,
    height: 120,
    borderRadius: 60,
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
    color: "gray",
  },
  boxContainer: {
    padding: 20,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#da051d",
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.5)",
    // borderRadius: 10,
    // marginBottom: 10,
    // width:"103%",
  },
  boxText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#f5f5f5f5",
    padding: 20,
    // borderRadius: 10,
    // marginTop: 5,
    // marginLeft:5,
    justifyContent: "center",
  },
  boxlogout: {
    color: "#da051d",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 15,
  },
});
