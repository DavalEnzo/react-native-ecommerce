import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Ionicons from '@expo/vector-icons/Ionicons';
import Panier from "./screens/Panier";
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

export default function App() {
  // État pour stocker le nombre d'articles dans le panier
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Fonction pour ajouter un article au panier
  const incrementCartItems = () => {
    setCartItemsCount(cartItemsCount + 1);
  };

  // Fonction pour retirer un article du panier
  const decrementCartItems = (quantity) => {
    setCartItemsCount(cartItemsCount - quantity);
  };

  const clearCartItems = () => {
    setCartItemsCount(0);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Utiliser 'children' pour passer des props personnalisés */}
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            headerTitle: 'Easy Shop',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Panier')}
                >
                  <Ionicons name="cart" size={30} color="dodgerblue" />
                {cartItemsCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    right: 0,
                    top: -5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                      {cartItemsCount}
                    </Text>
                  </View>
                )}
                </TouchableOpacity>
              </View>
            ),
          })}
        >
          {props => <Home {...props} incrementCartItems={incrementCartItems} />}
        </Stack.Screen>
        <Stack.Screen name="Panier"
          options={{ headerTitle: 'Panier' }}
        >
          {props => <Panier {...props} decrementCartItems={decrementCartItems} clearCartItems={clearCartItems} />}
        </Stack.Screen>
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
