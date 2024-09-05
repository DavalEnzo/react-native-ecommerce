import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home'; // Écran d'accueil pour choisir l'interface

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Écran d'accueil */}
        <Stack.Screen name="Home" component={Home} options={{ title: 'Easy Shop' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
