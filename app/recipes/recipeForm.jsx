import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../utils/Api';

const RecipeForm = ({ route, navigation }) => {
  const { recipeId } = route.params || {};
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');

  const fetchRecipeDetails = async () => {
    if (!recipeId) return;
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      const { title, ingredients, instructions, servings, cookingTime } = response.data;
      setTitle(title);
      setIngredients(ingredients.join(', '));
      setInstructions(instructions);
      setServings(String(servings));
      setCookingTime(String(cookingTime));
    } catch (error) {
      console.error('Error fetching recipe details:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  const handleSubmit = async () => {
    try {
      const payload = {
        title,
        ingredients: ingredients.split(',').map((item) => item.trim()),
        instructions,
        servings: Number(servings),
        cookingTime: Number(cookingTime),
      };
  
      await api.post('/recipes', payload);
      Alert.alert('Recipe added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating recipe:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
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
