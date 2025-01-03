import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { AntDesign } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";

const ProfilInfoLayout = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="EditProfile"
        options={{ title: "Modifier mon profil" }}
      />
      <Stack.Screen name="Chat" options={{ headerShown: false }} />
      <Stack.Screen name="Connection" options={{ title: "Discussions" }} />
      <Stack.Screen
        name="Favorite"
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <AntDesign name="heart" size={24} color="red" />
              <Text style={styles.titleText}> Mes Produits Favoris</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen name="Transaction" options={{ title: "Transaction" }} />
    </Stack>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    marginLeft: 8,
    color: "#000",
    fontWeight: "bold",
  },
});

export default ProfilInfoLayout;
