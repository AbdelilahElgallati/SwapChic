import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-react";

const ProductInfoLayout = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="DetailProduct"
        options={{ title: "Detail de produit" }}
      />
      <Stack.Screen
        name="EditProduct"
        options={{ title: "Modification de produit" }}
      />
      <Stack.Screen name="MyProducts" options={{ title: "Mes produits" }} />
    </Stack>
  );
};

export default ProductInfoLayout;
