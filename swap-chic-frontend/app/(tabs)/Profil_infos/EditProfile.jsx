import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function EditProfile() {
  const [image, setImage] = useState(null);

  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch user data and set initial state
    // Example:
    // Fetch user data and set initial state
    // setName('salma lk');
    // setEmail('salmalk@example.com');
    // setPassword('password123');
  }, []);

  const handleSave = () => {
    console.log('Saved:', { name, email, password, image });
  };

 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier Votre Profil</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            
              <Ionicons name="person-circle-outline" size={150} color="gray" />

           
          )}
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4682b4',
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
     
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    width: '60%',
    height: 'auto',
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden', 
     fontSize:  30,
  },
});

