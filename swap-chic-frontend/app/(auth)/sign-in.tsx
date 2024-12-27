import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../(redux)/authSlice";


const validateSchema = Yup.object().shape({
  email: Yup.string().required().email().label('email'),
  password: Yup.string().required().min(4).label('password'),
})

const SignIn = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const router = useRouter();

  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });

  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      router.push("/(tabs)");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{email:"", password:""}}
        onSubmit={(values) => {
          console.log(values);
          mutation
            .mutateAsync(values)
            .then((data) => {
              console.log("data", data);
              dispatch(loginAction(data));
            })
            .catch((err) => {
              console.log(err);
            });
          router.push("/(tabs)");
        }}
        validationSchema={validateSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <Text style={styles.footerText}>
        Pas encore inscrit ?{' '}
        <Text style={styles.link} onPress={() => router.push('/sign-up')}>
          Créer un compte
        </Text>
      </Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  form: {
    width: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
});

export default SignIn;
