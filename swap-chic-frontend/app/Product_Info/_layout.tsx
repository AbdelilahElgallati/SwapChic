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
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyProducts" />
      <Stack.Screen name="DetailProduct" />
      <Stack.Screen name="ProductCategory" />
      <Stack.Screen name="EditProduct" />
    </Stack>
  );
};

export default ProductInfoLayout;
