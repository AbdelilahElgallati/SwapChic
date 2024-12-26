import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-react";

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
      <Stack.Screen name="Chat" options={{ title: "Chat" }} />
      <Stack.Screen
        name="MyProduct"
        options={{ title: "Mes produits partagés" }}
      />
      <Stack.Screen name="Connection" options={{ title: "Mes connections" }} />
    </Stack>
  );
};

export default ProfilInfoLayout;
