import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login  () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
        const response = await axios.post(
            'http://172.20.10.2:3000/auth/login', 
            { email, password }, 
            { headers: { 'Content-Type': 'application/json' } }
          );
          const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      router.push('home');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
          borderRadius: 5,
        }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 10,
          borderRadius: 5,
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Don't have an account?{' '}
        <Text
          style={{ color: 'blue' }}
          onPress={() => router.push('register')}
        >
          Register here
        </Text>
      </Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
    </View>
  );
};


