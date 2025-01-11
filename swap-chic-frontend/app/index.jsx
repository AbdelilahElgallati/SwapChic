import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
// import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import imgbg from "@/assets/images/swapchic.jpg";
import { useWarmUpBrowser } from "@/hooks/warmUpBrowser";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth, useUser, useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  useWarmUpBrowser();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)/");
    }
  }, [isLoaded, isSignedIn]);

  useFocusEffect(
    useCallback(() => {
      if (isLoaded && user) {
        router.push("/(tabs)");
      }
    }, [isLoaded, user, router]) 
  );

  const handleSignInGoogle = useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL("/", { scheme: "swapchic" });

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl, // URL de redirection
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)"); 
      } else {
        Alert.alert("Erreur", "Veuillez compléter le processus d’authentification.");
      }
    } catch (error) {
      console.error("Erreur d'authentification :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'authentification. Veuillez réessayer.");
    }
  }, [startOAuthFlow, router]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imgbg}
        style={styles.imageSection}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.brandTitle}>
            <Text style={styles.letter}>Swap</Text>Chic
          </Text>
          <Text style={styles.subtitle}>Your Style. Your Marketplace.</Text>
        </View>
      </ImageBackground>

      <View style={styles.whiteSection}>
        <Text style={styles.heading}>Express Yourself Through Style</Text>
        <Text style={styles.description}>
          Shop, discover, and create your perfect look with high-quality
          products tailored to your taste.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSignInGoogle}>
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  imageSection: {
    width: width,
    height: height * 0.6,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 210,
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "#da051d",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "300",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    paddingHorizontal: 20,
    elevation: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: 350,
    marginTop: 10,
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  letter: {
    color: "#da051d",
    fontWeight: "bold",
    fontSize: 50,
    textShadowColor: "#fff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default WelcomeScreen;
