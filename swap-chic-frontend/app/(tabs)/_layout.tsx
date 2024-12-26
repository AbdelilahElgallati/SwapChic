import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome6, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { TouchableOpacity, Text } from "react-native";

const Layout = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerLeft: () => (
          <BackButton
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else if (isSignedIn) {
                router.replace("/(tabs)"); // Redirige vers la page d'accueil
              } else {
                router.replace("/"); // Redirige vers la page de bienvenue
              }
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addProduct"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="add" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

const BackButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
    <Text style={{ color: "blue" }}>Retour</Text>
  </TouchableOpacity>
);

export default Layout;
