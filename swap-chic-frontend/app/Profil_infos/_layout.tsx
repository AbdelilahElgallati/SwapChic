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
      <Stack.Screen name="Chat" options={{ headerShown: false }} />
      <Stack.Screen name="ChatOwnerProduct" options={{ title: "Chatting whit client" }} />
      <Stack.Screen name="Connection" options={{ title: "Mes connections" }} />
      <Stack.Screen name="Favorite" options={{ title: "Favoris" }} />
    </Stack>
  );
};

export default ProfilInfoLayout;
