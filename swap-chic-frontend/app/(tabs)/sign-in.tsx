import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, Button, View, Alert } from 'react-native';
import React from 'react';

export default function SignIn() {
  
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    setIsLoading(true); // Start loading

    try {
      // Attempt sign-in with the provided email and password
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in is complete, set the session as active and navigate to home
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // Handle incomplete sign-in (e.g., multi-factor authentication required)
        setErrorMessage('Une erreur est survenue pendant la connexion.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // Handle sign-in error (e.g., invalid credentials)
      setErrorMessage('Erreur de connexion, veuillez réessayer.');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false); // End loading
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Connexion</Text>

      <TextInput
        style={{
          width: '100%',
          padding: 15,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          marginBottom: 15,
          backgroundColor: '#fff',
        }}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Entrez votre e-mail"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={{
          width: '100%',
          padding: 15,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          marginBottom: 15,
          backgroundColor: '#fff',
        }}
        value={password}
        placeholder="Entrez votre mot de passe"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <Button title={isLoading ? 'Chargement...' : 'Se connecter'} onPress={onSignInPress} disabled={isLoading} />

      <View style={{ marginTop: 20 }}>
        <Text>Vous n'avez pas de compte ?</Text>
        <Link href="/sign-up">
          <Text style={{ color: '#6200EE', fontWeight: 'bold' }}>S'inscrire</Text>
        </Link>
      </View>
    </View>
  );
}
