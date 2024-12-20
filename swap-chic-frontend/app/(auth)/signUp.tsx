import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";

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

  // const handleImagePick = async (setFieldValue) => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     const selectedImage = result.assets[0];
  //     setFieldValue("photo", selectedImage);
  //     setImagePreview(selectedImage.uri);
  //   }
  // };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images], // Updated usage
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log(result);
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
      // const response = await fetch("https://swapchic-api.onrender.com/user/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      //   body: formData,
      // });

      const response = await fetch("https://your-api-endpoint.com/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Ensure userData is correctly structured
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read raw response in case of errors
        throw new Error(`Server Error: ${errorText}`);
      }
      const result = await response.json(); // Parse JSON only if valid
      console.log("Registration successful:", result);
    } catch (error) {
      console.error("Registration error:", error);
      console.error(error);
      console.log(error)
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
