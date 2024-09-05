import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ProductDetails from './screens/ProductDetails'; 
import UpdateProduct from './screens/UpdateProduct'; 
import AddProduct from './screens/AddProduct'; 
import SalesStatistics from './screens/SalesStatistics'; // Import des statistiques de vente
import RestockAlerts from './screens/RestockAlerts'; // Import des alertes de réapprovisionnement
import Panier from "./screens/Panier";
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';

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
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerTitle: 'Détails du produit' }} />
        <Stack.Screen name="UpdateProduct" component={UpdateProduct} options={{ headerTitle: 'Modifier le produit' }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerTitle: 'Ajouter un produit' }} />
        <Stack.Screen name="SalesStatistics" component={SalesStatistics} options={{ headerTitle: 'Statistiques de Vente' }} />
        <Stack.Screen name="RestockAlerts" component={RestockAlerts} options={{ headerTitle: 'Alertes de Réapprovisionnement' }} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
