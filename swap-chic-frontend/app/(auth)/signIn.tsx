// import React, { useState } from "react";
// import axios from "axios";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { useRouter } from "expo-router";

// const SignIn = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

//   // Validation des champs
//   const validateFields = () => {
//     const errors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!email) errors.email = "L'email est requis";
//     else if (!emailRegex.test(email)) errors.email = "Email invalide";

//     if (!password) errors.password = "Le mot de passe est requis";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSignIn = async () => {
//     if (!validateFields()) return;

//     try {
//       const response = await axios.post("http://192.168.1.2:3001/user/login", {
//         email,
//         password,
//       });

//       if (response.data.token) {
//         router.push("/(tabs)"); // Redirection en cas de succès
//       }
//     } catch (err) {
//       console.error(err);

//       if (err.response?.data?.error) {
//         const errorMessage = err.response.data.error;

//         if (errorMessage.includes("Email incorrect")) {
//           setFieldErrors({
//             email: "Email incorrect",
//             password: "",
//           });
//         } else if (errorMessage.includes("Mot de passe incorrect")) {
//           setFieldErrors({
//             email: "",
//             password: "Mot de passe incorrect",
//           });
//         } else {
//           Alert.alert(
//             "Erreur",
//             "Un problème est survenu lors de la connexion."
//           );
//         }
//       } else {
//         Alert.alert("Erreur", "Erreur inconnue. Veuillez réessayer.");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />
//       {fieldErrors.email && (
//         <Text style={styles.errorText}>{fieldErrors.email}</Text>
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Mot de passe"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       {fieldErrors.password && (
//         <Text style={styles.errorText}>{fieldErrors.password}</Text>
//       )}

//       <Button title="Login" onPress={handleSignIn} />
//       <Text style={styles.footerText}>
//         Pas encore inscrit ?{" "}
//         <Text style={styles.link} onPress={() => router.push("/signUp")}>
//           Créer un compte
//         </Text>
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//   },
//   button: {
//     backgroundColor: "#6200EE",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "100%",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   footerText: {
//     marginTop: 20,
//     fontSize: 14,
//     color: "#666",
//   },
//   link: {
//     color: "#6200EE",
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginBottom: 10,
//   },
// });

// export default SignIn;

import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) errors.email = "L'email est requis";
    else if (!emailRegex.test(email)) errors.email = "Email invalide";

    if (!password) errors.password = "Le mot de passe est requis";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post("http://192.168.1.2:3001/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        router.push("/(tabs)"); // Redirection en cas de succès
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.error) {
        const errorMessage = err.response.data.error;

        if (errorMessage.includes("Email incorrect")) {
          setFieldErrors({
            email: "Email incorrect",
            password: "",
          });
        } else if (errorMessage.includes("Mot de passe incorrect")) {
          setFieldErrors({
            email: "",
            password: "Mot de passe incorrect",
          });
        } else {
          Alert.alert(
            "Erreur",
            "Un problème est survenu lors de la connexion."
          );
        }
      } else {
        Alert.alert("Erreur", "Erreur inconnue. Veuillez réessayer.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {fieldErrors.email && (
        <Text style={styles.errorText}>{fieldErrors.email}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {fieldErrors.password && (
        <Text style={styles.errorText}>{fieldErrors.password}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Pas encore inscrit ?{" "}
        <Text style={styles.link} onPress={() => router.push("/signUp")}>
          Créer un compte
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6200EE",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  link: {
    color: "#6200EE",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SignIn;

