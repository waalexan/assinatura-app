// SignaturesScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Alert } from 'react-native';
import { database } from '@/app/config/firebaseConfig';  // Importe a configuração do Firebase
import { ref, onValue } from 'firebase/database';  // Importe o ref e onValue do Firebase

const SignaturesScreen = () => {
  const [signatures, setSignatures] = useState([]);  // Estado para armazenar as assinaturas
  const [loading, setLoading] = useState(true);  // Estado para controlar o carregamento

  // Função para buscar assinaturas do Firebase
  useEffect(() => {
    const signaturesRef = ref(database, 'signature1');  // Referência para o nó 'signatures'
    
    // Escutando as alterações no Realtime Database
    const unsubscribe = onValue(signaturesRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedSignatures = [];
      
      // Organizando as assinaturas em um array
      for (let userId in data) {
        fetchedSignatures.push({
          id: userId,
          signature: data[userId].signature,
          timestamp: data[userId].timestamp,
        });
      }

      setSignatures(fetchedSignatures);  // Atualiza o estado com as assinaturas
      setLoading(false);  // Desativa o carregamento
    });

    // Cleanup para parar de ouvir quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Renderizar a assinatura
  const renderItem = ({ item }) => (
    <View style={styles.signatureItem}>
      <Text style={styles.signatureText}>ID: {item.id}</Text>
      <Text style={styles.signatureText}>Timestamp: {item.timestamp}</Text>
      <Image source={{ uri: item.signature }} style={styles.signatureImage} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando assinaturas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assinaturas Salvas</Text>
      <FlatList
        data={signatures}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  signatureItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  signatureText: {
    fontSize: 16,
    marginBottom: 10,
  },
  signatureImage: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});

export default SignaturesScreen;
