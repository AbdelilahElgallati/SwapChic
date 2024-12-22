import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import imgbg from "@/assets/images/bg.jpg";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
import { useWarmUpBrowser } from "@/hooks/warmUpBrowser";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";


WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = () => {
  useWarmUpBrowser();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleSignInGoogle = React.useCallback(async () => {
    try {
      // Utilisation de `expo-linking` pour créer l'URL de redirection
      const redirectUrl = Linking.createURL("/", { scheme: "swapchic" });

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: redirectUrl, // Utilisez l'URL créée avec expo-linking
      });

      // Si le flux d'authentification est réussi
      if (createdSessionId) {
        setActive({ session: createdSessionId }); // Définit la session comme acti
        router.replace("/(tabs)"); // Redirige l'utilisateur vers la page du tableau de bord
      } else {
        alert("Veuillez compléter le processus d’authentification.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur d’authentification. Veuillez réessayer.");
    }
  }, [startOAuthFlow]);

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/(tabs)");
    }
  }, [isLoaded, user]);

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
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 210,
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "#1466b8",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "300",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 3 },
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
    color: "#1466b8",
    fontWeight: "bold",
    fontSize: 50,
    textShadowColor: "#fff",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
  },
});

export default WelcomeScreen;
{/* <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Link style={styles.buttonText} href="/(auth)/signIn">Sign In Whit Google</Link>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Link style={styles.buttonText} href="/(auth)/signUp">Sign Up</Link>
        </Pressable> */}