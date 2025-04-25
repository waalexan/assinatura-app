import React from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { database } from '@/app/config/firebaseConfig'; // Certifique-se de importar corretamente
import { ref as firebaseRef, set } from 'firebase/database'; // Renomeando o `ref` do Firebase
import SignatureCanvas from './components/SignatureCanvas';
import { useRouter } from 'expo-router';

const App = () => {
  const router = useRouter()
  // Função para salvar a assinatura no Firebase
  const saveSignatureToFirebase = (signature) => {
    const userId = 'user456'; // Isso pode ser substituído com um ID de usuário dinâmico
    const signatureRefDB = firebaseRef(database, 'signature2/' + userId); // Usando o ref correto do Firebase

    set(signatureRefDB, {
      signature: signature,
      timestamp: new Date().toISOString(),
    }).then(() => {
      Alert.alert("Assinatura salva com sucesso!");
    }).catch((error) => {
      Alert.alert("Erro ao salvar assinatura:", error.message);
    });
  };

  const handleSave = (signatureData) => {
    console.log('Dados da assinatura:', signatureData);
    saveSignatureToFirebase(signatureData)
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas onSave={handleSave} />
      <Button title="Cancelar" onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});

export default App;