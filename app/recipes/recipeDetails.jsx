import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import api from '../utils/Api';

const RecipeDetails = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);

  const fetchRecipeDetails = async () => {
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe details:', error.response?.data || error.message);
    }
  };

  const deleteRecipe = async () => {
    try {
      await api.delete(`/recipes/${recipeId}`);
      Alert.alert('Recipe deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting recipe:', error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    fetchRecipeDetails();
  }, []);

  if (!recipe) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text>Ingredients: {recipe.ingredients.join(', ')}</Text>
      <Text>Instructions: {recipe.instructions}</Text>
      <Text>Servings: {recipe.servings}</Text>
      <Text>Cooking Time: {recipe.cookingTime} mins</Text>
      <Button title="Edit" onPress={() => navigation.navigate('RecipeForm', { recipeId })} />
      <Button title="Delete" onPress={deleteRecipe} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});

export default RecipeDetails;
