import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ProductDetails from './screens/ProductDetails'; // Détails du produit
import UpdateProduct from './screens/UpdateProduct'; // Mise à jour d'un produit
import AddProduct from './screens/AddProduct'; // Ajout d'un produit
import Ionicons from '@expo/vector-icons/Ionicons';
import Panier from "./screens/Panier";
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

export default function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const incrementCartItems = () => {
    setCartItemsCount(cartItemsCount + 1);
  };

  const decrementCartItems = (quantity) => {
    setCartItemsCount(cartItemsCount - quantity);
  };

  const clearCartItems = () => {
    setCartItemsCount(0);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            headerTitle: 'Easy Shop',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Panier')}>
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

        {/* Ajouter les nouveaux écrans */}
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerTitle: 'Détails du produit' }} />
        <Stack.Screen name="UpdateProduct" component={UpdateProduct} options={{ headerTitle: 'Modifier le produit' }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerTitle: 'Ajouter un produit' }} />
        <Stack.Screen name="Panier" component={Panier} options={{ headerTitle: 'Panier' }} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
