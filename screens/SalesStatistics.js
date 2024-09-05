import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const SalesStatistics = () => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5000/sales');
        setSalesData(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des statistiques de vente');
        console.log(error);
      }
    };

    fetchSalesData();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistiques de Vente</Text>
      {salesData.length > 0 ? (
        <LineChart
          data={{
            labels: salesData.map(item => item.date),
            datasets: [{
              data: salesData.map(item => item.total_sales)
            }]
          }}
          width={300} // Largeur du graphique
          height={220} // Hauteur du graphique
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // Chiffres après la virgule
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
        />
      ) : (
        <Text>Chargement des données...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default SalesStatistics;
