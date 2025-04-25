import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { database } from '@/app/config/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import Svg, { Path } from 'react-native-svg';
// import dayjs from 'dayjs';

type SignaturePoint = {
  x: number;
  y: number;
};

type SignatureData = {
  paths: SignaturePoint[][];
  timestamp?: string | number;
};

type FirebaseSignature = {
  [key: string]: {
    signature: SignatureData;
    timestamp?: string | number;
  };
};

const SignaturesScreen = () => {
  const [signatures, setSignatures] = useState<{id: string; signature: SignaturePoint[][]; timestamp: string | number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const signaturesRef = ref(database, 'signature2');
    
    const fetchData = onValue(signaturesRef, (snapshot) => {
      try {
        const data: FirebaseSignature | null = snapshot.val();
        
        if (!data) {
          setSignatures([]);
          setLoading(false);
          return;
        }

        const fetchedSignatures = Object.entries(data).map(([userId, signatureData]) => {
          // Validação rigorosa dos dados da assinatura
          const paths = Array.isArray(signatureData?.signature?.paths)
            ? signatureData.signature.paths.filter(path => 
                Array.isArray(path) && 
                path.every(point => 
                  point && 
                  typeof point.x === 'number' && 
                  typeof point.y === 'number'
                )
            )
            : [];

          return {
            id: userId,
            signature: paths,
            timestamp: signatureData.timestamp || Date.now(),
          };
        });

        setSignatures(fetchedSignatures);
        setError(null);
      } catch (err) {
        console.error('Error fetching signatures:', err);
        setError('Failed to load signatures');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase read failed:', error);
      setError('Connection error');
      setLoading(false);
    });

    return () => off(signaturesRef, 'value', fetchData);
  }, []);

  const renderSignaturePaths = (paths: SignaturePoint[][]) => {
    if (!Array.isArray(paths)) return null;

    return paths.map((path, pathIndex) => {
      if (!Array.isArray(path) || path.length === 0) return null;

      // Filtra pontos inválidos
      const validPoints = path.filter(point => 
        typeof point?.x === 'number' && 
        typeof point?.y === 'number' &&
        !isNaN(point.x) && 
        !isNaN(point.y)
      );

      if (validPoints.length === 0) return null;

      // Constrói a string do path
      const pathString = validPoints.reduce((acc, point, i) => {
        return i === 0 
          ? `M${point.x},${point.y}`
          : `${acc} L${point.x},${point.y}`;
      }, '');

      return (
        <Path
          key={`path-${pathIndex}`}
          d={pathString}
          stroke="black"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    });
  };

  const SignatureItem = React.memo(({ item }: { item: {id: string; signature: SignaturePoint[][]; timestamp: string | number} }) => (
    <View style={styles.signatureItem}>
      <Text style={styles.signatureId}>ID: {item.id}</Text>
      <Text style={styles.signatureDate}>
        {/* {dayjs(item.timestamp).format('DD/MM/YYYY HH:mm')} */}
        {item.timestamp}
      </Text>
      <View style={styles.signatureContainer}>
        {item.signature.length > 0 ? (
          <Svg style={styles.signatureSvg}>
            {renderSignaturePaths(item.signature)}
          </Svg>
        ) : (
          <Text style={styles.invalidSignatureText}>Assinatura inválida ou vazia</Text>
        )}
      </View>
    </View>
  ));

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando assinaturas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (signatures.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nenhuma assinatura encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assinaturas Salvas</Text>
      <FlatList
        data={signatures}
        renderItem={({ item }) => <SignatureItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  signatureItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  signatureId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  signatureDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  signatureContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureSvg: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  invalidSignatureText: {
    color: '#999',
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SignaturesScreen;