// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import * as ImagePicker from "expo-image-picker";

// const SignUp = () => {
//   const [imagePreview, setImagePreview] = useState(null);

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     phone: Yup.string().matches(
//       /^\+?[0-9]{10,12}$/,
//       "Phone number is not valid"
//     ),
//     localisation: Yup.string().required("City is required"),

//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Passwords must match")
//       .required("Confirm password is required"),
//     photo: Yup.string().required("Photo is required"),
//   });

//   const handleImagePick = async (setFieldValue) => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const selectedImage = result.assets[0].uri;
//       setFieldValue("photo", selectedImage); // Set the value in Formik
//       setImagePreview(selectedImage); // Update preview
//     }
//   };

//   const handleRegister = async (values) => {
//     const formData = new FormData();
//     formData.append("email", values.email);
//     formData.append("password", values.password);
//     formData.append("photo", {
//       uri: values.photo,
//       type: "image/jpeg",
//       name: "profile.jpg",
//     });

//     try {
//       const response = await fetch("http://localhost:3001/user/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       console.log("Registration response:", result);
//     } catch (error) {
//       console.error("Registration error:", error);
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
//           photo: "",
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
//               placeholder="Username"
//               style={styles.input}
//               onChangeText={handleChange("name")}
//               onBlur={handleBlur("name")}
//               value={values.name}
//             />
//             {errors.name && touched.name ? (
//               <Text style={styles.errorText}>{errors.name}</Text>
//             ) : null}

//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               onChangeText={handleChange("email")}
//               onBlur={handleBlur("email")}
//               value={values.email}
//             />
//             {touched.email && errors.email && (
//               <Text style={styles.error}>{errors.email}</Text>
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
//               <Text style={styles.error}>{errors.password}</Text>
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
//               <Text style={styles.error}>{errors.confirmPassword}</Text>
//             )}

// <TextInput
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
//             {touched.photo && errors.photo && (
//               <Text style={styles.error}>{errors.photo}</Text>
//             )}

//             <Button onPress={handleSubmit} title="Register" />
//           </>
//         )}
//       </Formik>
//     </View>
//   );
// };

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
//   error: {
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

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import {registerUser} from "../(services)/api/api"

const SignUp = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phone: Yup.string()
      .matches(/^\+?[0-9]{10,12}$/, "Phone number is not valid")
      .required("Phone is required"),
    localisation: Yup.string().required("City is required"),
    photo: Yup.object().required("Photo is required"),
  });

  const handleImagePick = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setFieldValue("photo", selectedImage);
      setImagePreview(selectedImage.uri);
    }
  };

  const handleRegister = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("localisation", values.localisation);
    formData.append("photo", {
      uri: values.photo.uri,
      type: "image/jpeg", 
      name: "profile.jpg",
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // const response = await registerUser(formData)
      const response = await fetch("https://swapchic-api.onrender.com/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Registration successful:", result);
    } catch (error) {
      console.error("Registration error:", error);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          localisation: "",
          photo: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="Name"
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TextInput
              placeholder="Phone"
              style={styles.input}
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
              value={values.phone}
              keyboardType="phone-pad"
            />
            {errors.phone && touched.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}

            <TextInput
              placeholder="City"
              style={styles.input}
              onChangeText={handleChange("localisation")}
              onBlur={handleBlur("localisation")}
              value={values.localisation}
            />
            {errors.localisation && touched.localisation ? (
              <Text style={styles.errorText}>{errors.localisation}</Text>
            ) : null}

            <Button
              title="Pick an Image"
              onPress={() => handleImagePick(setFieldValue)}
            />
            {imagePreview && (
              <Image
                source={{ uri: imagePreview }}
                style={styles.imagePreview}
              />
            )}
            <Button onPress={handleSubmit} title="Register" />
          </>
        )}
      </Formik>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   input: { borderWidth: 1, marginBottom: 10, padding: 10 },
//   errorText: { color: "red" },
//   imagePreview: { width: 100, height: 100, marginVertical: 10 },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});

export default SignUp;
