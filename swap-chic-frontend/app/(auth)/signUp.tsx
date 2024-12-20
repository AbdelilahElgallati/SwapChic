// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import * as ImagePicker from "expo-image-picker";

// const SignUp = () => {
//   const [imagePreview, setImagePreview] = useState(null);

//   const validationSchema = Yup.object().shape({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Passwords must match")
//       .required("Confirm password is required"),
//     phone: Yup.string()
//       .matches(/^\+?[0-9]{10,12}$/, "Phone number is not valid")
//       .required("Phone is required"),
//     localisation: Yup.string().required("City is required"),
//     photo: Yup.object().required("Photo is required"),
//   });

//   const handleImagePick = async (setFieldValue) => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const selectedImage = result.assets[0];
//       setFieldValue("photo", selectedImage);
//       setImagePreview(selectedImage.uri);
//     }
//   };

//   // const pickImage = async () => {
//   //   const result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: [ImagePicker.MediaType.Images], // Updated usage
//   //     allowsEditing: true,
//   //     quality: 1,
//   //   });
  
//   //   if (!result.canceled) {
//   //     console.log(result);
//   //   }
//   // };

//   const handleRegister = async (values) => {
//     const formData = new FormData();
//     formData.append("name", values.name);
//     formData.append("email", values.email);
//     formData.append("password", values.password);
//     formData.append("phone", values.phone);
//     formData.append("localisation", values.localisation);
//     formData.append("photo", {
//       uri: values.photo.uri,
//       type: "image/jpeg", 
//       name: "profile.jpg",
//     });

//     for (let [key, value] of formData.entries()) {
//       console.log(key, value);
//     }

//     try {
//       // const response = await registerUser(formData)
//       const response = await fetch("https://swapchic-api.onrender.com/user/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       });

//       // const response = await fetch("https://your-api-endpoint.com/user/register", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify(formData), // Ensure userData is correctly structured
//       // });

//       if (!response.ok) {
//         const errorText = await response.text(); // Read raw response in case of errors
//         throw new Error(`Server Error: ${errorText}`);
//       }
//       const result = await response.json(); // Parse JSON only if valid
//       console.log("Registration successful:", result);
//     } catch (error) {
//       console.error("Registration error:", error);
//       console.error(error);
//       console.log(error)
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Formik
//         initialValues={{
//           name: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//           phone: "",
//           localisation: "",
//           photo: null,
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleRegister}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           setFieldValue,
//           values,
//           errors,
//           touched,
//         }) => (
//           <>
//             <TextInput
//               placeholder="Name"
//               style={styles.input}
//               onChangeText={handleChange("name")}
//               onBlur={handleBlur("name")}
//               value={values.name}
//             />
//             {touched.name && errors.name && (
//               <Text style={styles.errorText}>{errors.name}</Text>
//             )}

//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               onChangeText={handleChange("email")}
//               onBlur={handleBlur("email")}
//               value={values.email}
//             />
//             {touched.email && errors.email && (
//               <Text style={styles.errorText}>{errors.email}</Text>
//             )}

//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               secureTextEntry
//               onChangeText={handleChange("password")}
//               onBlur={handleBlur("password")}
//               value={values.password}
//             />
//             {touched.password && errors.password && (
//               <Text style={styles.errorText}>{errors.password}</Text>
//             )}

//             <TextInput
//               style={styles.input}
//               placeholder="Confirm Password"
//               secureTextEntry
//               onChangeText={handleChange("confirmPassword")}
//               onBlur={handleBlur("confirmPassword")}
//               value={values.confirmPassword}
//             />
//             {touched.confirmPassword && errors.confirmPassword && (
//               <Text style={styles.errorText}>{errors.confirmPassword}</Text>
//             )}

//             <TextInput
//               placeholder="Phone"
//               style={styles.input}
//               onChangeText={handleChange("phone")}
//               onBlur={handleBlur("phone")}
//               value={values.phone}
//               keyboardType="phone-pad"
//             />
//             {errors.phone && touched.phone ? (
//               <Text style={styles.errorText}>{errors.phone}</Text>
//             ) : null}

//             <TextInput
//               placeholder="City"
//               style={styles.input}
//               onChangeText={handleChange("localisation")}
//               onBlur={handleBlur("localisation")}
//               value={values.localisation}
//             />
//             {errors.localisation && touched.localisation ? (
//               <Text style={styles.errorText}>{errors.localisation}</Text>
//             ) : null}

//             <Button
//               title="Pick an Image"
//               onPress={() => handleImagePick(setFieldValue)}
//             />
//             {imagePreview && (
//               <Image
//                 source={{ uri: imagePreview }}
//                 style={styles.imagePreview}
//               />
//             )}
//             <Button onPress={handleSubmit} title="Register" />
//           </>
//         )}
//       </Formik>
//     </View>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20 },
// //   input: { borderWidth: 1, marginBottom: 10, padding: 10 },
// //   errorText: { color: "red" },
// //   imagePreview: { width: 100, height: 100, marginVertical: 10 },
// // });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 8,
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 10,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginVertical: 10,
//   },
// });

// export default SignUp;

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// const SignUp = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     localisation: '',
//     photo: null,
//   });

//   const handleInputChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handlePickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       base64: true,
//     });

//     if (!result.canceled) {
//       setForm({ ...form, photo: result.assets[0].base64 });
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.photo) {
//       Alert.alert('Error', 'Please select a photo.');
//       return;
//     }

//     try {
//       await axios.post('https://swapchic-api.onrender.com/user/register', form);
//       Alert.alert('Success', 'Account created successfully!');
//     } catch (error) {
//       console.log(error)
//       Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={form.name}
//         onChangeText={(value) => handleInputChange('name', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         value={form.email}
//         onChangeText={(value) => handleInputChange('email', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={form.password}
//         onChangeText={(value) => handleInputChange('password', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone"
//         keyboardType="phone-pad"
//         value={form.phone}
//         onChangeText={(value) => handleInputChange('phone', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Localisation"
//         value={form.localisation}
//         onChangeText={(value) => handleInputChange('localisation', value)}
//       />
//       <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
//         {form.photo ? (
//           <Image
//             source={{ uri: `data:image/png;base64,${form.photo}` }}
//             style={styles.image}
//           />
//         ) : (
//           <Text>Select Photo</Text>
//         )}
//       </TouchableOpacity>
//       <Button title="Sign Up" onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   imagePicker: {
//     height: 150,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default SignUp;


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [photo, setPhoto] = useState(null);

  // Fonction pour sélectionner une photo
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission requise", "Autorisez l'accès à votre galerie pour ajouter une photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Fonction pour soumettre les données
  const handleSignUp = async () => {
    if (!name || !email || !password || !phone || !localisation) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('localisation', localisation);

    

    if (photo) {
      const filename = photo.split('/').pop();
      const type = `image/${filename.split('.').pop()}`;
      formData.append('photo', {
        uri: photo,
        name: filename,
        type,
      });
    }

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await fetch('https://swapchic-api.onrender.com/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Succès", "Utilisateur ajouté avec succès !");
      } else {
        Alert.alert("Erreur", data.message || "Échec de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur", "Un problème est survenu lors de l'inscription.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Localisation"
        value={localisation}
        onChangeText={setLocalisation}
      />
      
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>
          {photo ? "Changer de photo" : "Ajouter une photo"}
        </Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}
      
      <Button title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  photoButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default SignUp;
