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
      <Stack.Screen name="Connection" options={{ headerShown: false }} />
      <Stack.Screen name="DemandeDiscussion" options={{ headerShown: false }} />
      <Stack.Screen name="Favorite" options={{ headerShown: false }} />
      <Stack.Screen name="Transaction" options={{ headerShown: false }} />
      <Stack.Screen name="Achat" options={{ headerShown: false }} />
      {/* <Stack.Screen name="logout"options={{headerShown: false}}/> */}
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
