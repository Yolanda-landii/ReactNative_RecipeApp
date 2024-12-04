import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RecipeDetails = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);  // Array to hold all recipes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);  // To toggle between view and edit mode
  const [editedRecipe, setEditedRecipe] = useState(null); // To store the edited recipe details

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://172.20.10.2:3000/recipes');  // Adjust if necessary
      console.log('API Response:', response);  // Log the entire response for debugging
      
      // Access recipes from the `recipes` field
      const responseData = response.data.recipes;  // Updated to access `recipes`
      console.log('Response Data:', responseData);
  
      if (Array.isArray(responseData) && responseData.length > 0) {
        setRecipes(responseData);  // Populate recipes
      } else {
        console.log('No recipes returned from the API.');
        setError('No recipes available.');
      }
    } catch (err) {
      console.error('Fetch Recipes Error:', err);
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input changes for the edited recipe
const handleInputChange = (field, value) => {
  let updatedValue = value;

  // Convert numeric fields to number, ensuring valid input
  if (['servings', 'prepTime', 'cookingTime'].includes(field)) {
    updatedValue = parseInt(value, 10);
    if (isNaN(updatedValue)) {
      updatedValue = '';  // If the parsed value is NaN, reset to empty
    }
  }

  setEditedRecipe({ ...editedRecipe, [field]: updatedValue });
};

// Save the edited recipe
const handleSaveEdit = async (recipeId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'You must be logged in to edit recipes.');
      return;
    }

    // Ensure that no field is left with NaN or invalid data
    const validRecipe = { ...editedRecipe };

    // Check if numeric fields are valid numbers before sending them
    if (isNaN(validRecipe.servings)) validRecipe.servings = '';
    if (isNaN(validRecipe.prepTime)) validRecipe.prepTime = '';
    if (isNaN(validRecipe.cookingTime)) validRecipe.cookingTime = '';

    // PUT request to update the recipe
    await axios.put(
      `http://172.20.10.2:3000/recipes/${recipeId}`,
      validRecipe,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Alert.alert('Success', 'Recipe updated successfully.');
    setIsEditing(false);  // Exit editing mode
    fetchRecipes();  // Refresh the recipe list
  } catch (err) {
    console.error('Error saving recipe:', err);
    Alert.alert('Error', 'Failed to update recipe.');
  }
};


  // Function to delete a recipe
  const deleteRecipe = async (recipeId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to delete recipes.');
        return;
      }

      await axios.delete(`http://172.20.10.2:3000/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Recipe deleted successfully.');
      fetchRecipes();  // Refetch the recipes after deletion
    } catch (err) {
      console.error('Error deleting recipe:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to delete recipe.');
    }
  };

  // Fetch recipes when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Conditional UI
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Go Back" onPress={() => router.push('/')} />
      </View>
    );
  }

  if (!recipes.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No recipes available. Please try again later.</Text>
        <Button title="Go Back" onPress={() => router.push('/')} />
      </View>
    );
  }

  // Render list of recipes
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Recipes</Text>
      {recipes.map((recipe) => (
        <View key={recipe._id} style={styles.recipeContainer}>
          {isEditing && editedRecipe._id === recipe._id ? (
            <View>
              <Text>Name:</Text>
              <TextInput
                style={styles.input}
                value={editedRecipe.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />

              <Text>Category:</Text>
              <TextInput
                style={styles.input}
                value={editedRecipe.category}
                onChangeText={(value) => handleInputChange('category', value)}
              />

              <Text>Ingredients:</Text>
              <TextInput
                style={styles.input}
                value={editedRecipe.ingredients.join(', ')}
                onChangeText={(value) => handleInputChange('ingredients', value.split(', '))}
              />

              <Text>Instructions:</Text>
              <TextInput
                style={styles.input}
                value={editedRecipe.instructions}
                onChangeText={(value) => handleInputChange('instructions', value)}
              />

              <Text>Servings:</Text>
              <TextInput
                style={styles.input}
                value={String(editedRecipe.servings)}
                onChangeText={(value) => handleInputChange('servings', parseInt(value, 10))}
                keyboardType="numeric"
              />

              <Text>Prep Time:</Text>
              <TextInput
                style={styles.input}
                value={String(editedRecipe.prepTime)}
                onChangeText={(value) => handleInputChange('prepTime', parseInt(value, 10))}
                keyboardType="numeric"
              />

              <Text>Cooking Time:</Text>
              <TextInput
                style={styles.input}
                value={String(editedRecipe.cookingTime)}
                onChangeText={(value) => handleInputChange('cookingTime', parseInt(value, 10))}
                keyboardType="numeric"
              />

              <Button title="Save" onPress={() => handleSaveEdit(recipe._id)} />
              <Button title="Cancel" onPress={() => setIsEditing(false)} color="gray" />
            </View>
          ) : (
            <View>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <Text>Category: {recipe.category || 'Not specified'}</Text>
              <Text>Ingredients: {recipe.ingredients?.join(', ') || 'Not available'}</Text>
              <Text>Instructions: {recipe.instructions || 'Not available'}</Text>
              <Text>Servings: {recipe.servings}</Text>
              <Text>Prep Time: {recipe.prepTime} minutes</Text>
              <Text>Cooking Time: {recipe.cookingTime} minutes</Text>
              <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={() => { setIsEditing(true); setEditedRecipe(recipe); }} />
                <Button title="Delete" onPress={() => deleteRecipe(recipe._id)} color="red" />
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 16, fontSize: 16 },
  recipeContainer: { marginBottom: 16 },
  recipeName: { fontSize: 18, fontWeight: 'bold' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingLeft: 8 },
  buttonContainer: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
});

export default RecipeDetails;
