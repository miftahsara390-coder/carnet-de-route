import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F05A45', // L'orange/corail du design
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

