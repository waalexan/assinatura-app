// App.js
import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import Signature from 'react-native-signature-canvas';
import { database } from '@/app/config/firebaseConfig'; // Certifique-se de importar corretamente
import { ref as firebaseRef, set } from 'firebase/database'; // Renomeando o `ref` do Firebase
import { useRouter } from 'expo-router';

export default function App() {
  const signatureRef = useRef(); // Renomeando o ref do React para evitar conflito
  const [signatureImage, setSignatureImage] = useState(null);
  const router = useRouter();

  // Função para salvar a assinatura no Firebase
  const saveSignatureToFirebase = (signature) => {
    const userId = 'user123'; // Isso pode ser substituído com um ID de usuário dinâmico
    const signatureRefDB = firebaseRef(database, 'signature1/' + userId); // Usando o ref correto do Firebase

    set(signatureRefDB, {
      signature: signature,
      timestamp: new Date().toISOString(),
    }).then(() => {
      Alert.alert("Assinatura salva com sucesso!");
    }).catch((error) => {
      Alert.alert("Erro ao salvar assinatura:", error.message);
    });
  };

  const handleOK = (signature) => {
    setSignatureImage(signature);
    console.log('Assinatura capturada:', signature);
    // Chama a função para salvar a assinatura no Firebase
    saveSignatureToFirebase(signature);
  };

  const handleClear = () => {
    console.log('Assinatura limpa');
    setSignatureImage(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Assine abaixo:</Text>
      <View style={styles.signatureContainer}>
        <Signature
          ref={signatureRef} // Usando o ref do React
          onOK={handleOK}
          onClear={handleClear}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={style}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button title="Cancelar" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  signatureContainer: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    margin: 10,
  },
  buttonsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

const style = `
  .m-signature-pad--footer
  .button {
    background-color: red;
    color: white;
  }
`;
