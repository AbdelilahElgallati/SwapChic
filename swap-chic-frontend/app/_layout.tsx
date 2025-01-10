// import React from "react";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

// export default function RootLayout() {
//   return (
//     <ClerkProvider publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA">
//       <StatusBar style="auto" />
      
//       <SignedIn>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="(tabs)" />
//         </Stack>
//       </SignedIn>

//       <SignedOut>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="index" />
//         </Stack>
//       </SignedOut>
//     </ClerkProvider>
//   );
// }


import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey="pk_test_YWJsZS1kb25rZXktMjMuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <StatusBar style="auto" />
      
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="(tabs)" 
            options={{
              animation: 'none'
            }}
          />
        </Stack>
      </SignedIn>

      <SignedOut>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="index" 
            options={{
              animation: 'none'
            }}
          />
        </Stack>
      </SignedOut>
      
    </ClerkProvider>
  );
}