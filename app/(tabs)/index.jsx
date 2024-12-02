import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './index';
// import RecipeForm from './(tabs)/recipes/recipeForm';
// import RecipeDetails from './(tabs)/recipes/recipeDetails';
import Registration from './register'; 
import Login from './login';

const Stack = createStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="register" component={Registration} options={{ headerShown: false }} />
        <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="recipeForm" component={RecipeForm} options={{ headerShown: false }}/> */}
        {/* <Stack.Screen name="recipeDetails" component={RecipeDetails} options={{ headerShown: false }}/> */}
      </Stack.Navigator>
    
  );
}
