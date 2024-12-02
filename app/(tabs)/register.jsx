import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://172.20.10.2:3000'; // Replace with your local IP

const Registration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const user = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };

      const response = await axios.post(`${BASE_URL}/users`, user, {
        headers: { 'Content-Type': 'application/json' },
      });

      const token = response.data.token;
      await AsyncStorage.setItem('token', token);

      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred');
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
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
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
          borderRadius: 5,
        }}
        placeholder="Surname"
        value={formData.surname}
        onChangeText={(text) => setFormData({ ...formData, surname: text })}
      />
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
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
          borderRadius: 5,
        }}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
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
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />
      <Button
        title={loading ? 'Registering...' : 'Register'}
        onPress={handleRegister}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>}

      <View style={{ marginTop: 20 }}>
    <Text style={{ textAlign: 'center' }}>Already have an account?</Text>
    <Text
      style={{ color: 'blue', textDecorationLine: 'underline', textAlign: 'center' }}
      onPress={() => navigation.navigate('login')}
    >
      Login here
    </Text>
</View>
    </View>
  );
};

export default Registration;
