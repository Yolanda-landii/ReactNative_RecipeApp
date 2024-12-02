import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../utils/Api';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes'); 
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Add Recipe" onPress={() => navigation.navigate('recipeForm')} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate('recipeDetails', { recipeId: item._id })}
            >
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  recipeCard: { padding: 16, backgroundColor: '#f8f8f8', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;
