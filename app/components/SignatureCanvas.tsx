import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, TouchableOpacity, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SignatureCanvas = ({ onSave }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const viewRef = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (e, gestureState) => {
      const { locationX, locationY } = e.nativeEvent;
      setIsDrawing(true);
      setCurrentPath([{ x: locationX, y: locationY }]);
    },
    
    onPanResponderMove: (e, gestureState) => {
      if (!isDrawing) return;
      
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
    },
    
    onPanResponderRelease: () => {
      setIsDrawing(false);
      setPaths(prev => [...prev, currentPath]);
      setCurrentPath([]);
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const saveSignature = () => {
    if (paths.length === 0 && currentPath.length === 0) {
      alert('Por favor, faça uma assinatura antes de salvar');
      return;
    }

    const signatureData = {
      paths: [...paths, ...(currentPath.length ? [currentPath] : [])],
      timestamp: new Date().toISOString()
    };

    if (onSave) {
      onSave(signatureData);
    }
  };

  const renderPath = (path, index) => {
    let pathString = '';
    if (path.length > 0) {
      pathString = `M${path[0].x},${path[0].y}`;
      for (let i = 1; i < path.length; i++) {
        pathString += ` L${path[i].x},${path[i].y}`;
      }
    }

    return (
      <Path
        key={`path-${index}`}
        d={pathString}
        stroke="black"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assine abaixo</Text>
      
      <View
        ref={viewRef}
        style={styles.canvas}
        {...panResponder.panHandlers}
      >
        <Svg style={StyleSheet.absoluteFill}>
          {paths.map((path, index) => renderPath(path, index))}
          {isDrawing && renderPath(currentPath, 'current')}
        </Svg>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={clearCanvas}>
          <Text style={styles.buttonText}>Limpar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveSignature}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  canvas: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'white',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignatureCanvas;