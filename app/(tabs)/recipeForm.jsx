import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeForm = () => {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState('');

  useEffect(() => {
    if (router.query?.recipeId) setRecipeId(router.query.recipeId);
  }, [router.query]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://10.50.85.6:3000/recipes/${recipeId}`);
      setName(data.name || '');
      setIngredients(data.ingredients?.join(', ') || '');
      setInstructions(data.instructions || '');
      setServings(data.servings?.toString() || '');
      setPrepTime(data.prepTime?.toString() || '');
      setCategory(data.category || '');
      setCookingTime(data.cookingTime?.toString() || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recipe details.');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  const handleSubmit = async () => {
    if (!name || !ingredients || !instructions) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You must be logged in.');
        return;
      }
  
      const payload = {
        name,
        ingredients: ingredients.split(',').map((item) => item.trim()),
        instructions,
        servings: Number(servings),
        prepTime: Number(prepTime),
        cookingTime: Number(cookingTime),
        category,
      };
  
      const url = recipeId
        ? `http://172.20.10.2:3000/recipes/${recipeId}`
        : 'http://172.20.10.2:3000/recipes';
      const headers = { Authorization: `Bearer ${token}` };
  
      if (recipeId) {
        await axios.put(url, payload, { headers });
      } else {
        const { data } = await axios.post(url, payload, { headers });
        await AsyncStorage.setItem('lastRecipeId', data._id); // Persist the recipe ID after creation
      }
  
      Alert.alert('Success', 'Recipe saved successfully!');
      router.push('/recipeDetails');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save recipe.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
      />
      <TextInput
        style={styles.input}
        placeholder="Servings"
        value={servings}
        onChangeText={setServings}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preparation Time (minutes)"
        value={prepTime}
        onChangeText={setPrepTime}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cooking Time (minutes)"
        value={cookingTime}
        onChangeText={setCookingTime}
        keyboardType="numeric"
      />
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 8, padding: 8, borderRadius: 4 },
});

export default RecipeForm;
