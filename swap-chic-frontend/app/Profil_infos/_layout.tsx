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
        headerShown: false,
      }}
    >
      <Stack.Screen name="Chat" />
      <Stack.Screen name="Connection" />
      <Stack.Screen name="DemandeDiscussion" />
      <Stack.Screen name="Favorite" />
      <Stack.Screen name="Transaction" />
      <Stack.Screen name="Achat" />
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
