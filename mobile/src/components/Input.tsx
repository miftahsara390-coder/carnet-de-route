import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

type InputProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  iconColor?: string;
  iconFamily?: 'Feather' | 'Ionicons';
  maxLength?: number;
};

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  multiline = false,
  iconName,
  iconColor = '#F05A45',
  iconFamily = 'Feather',
  maxLength
}: InputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {iconName && iconFamily === 'Feather' && <Feather name={iconName} size={16} color={iconColor} style={styles.icon} />}
        {iconName && iconFamily === 'Ionicons' && <Ionicons name={iconName as any} size={16} color={iconColor} style={styles.icon} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholderTextColor="#B0B0B0"
        maxLength={maxLength}
      />
      {maxLength && (
        <Text style={styles.maxLengthText}>
          {value?.length || 0} / {maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, width: '100%' },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { marginRight: 6 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 14,
    color: '#333',
  },
  multiline: { height: 100, textAlignVertical: 'top' },
  maxLengthText: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: 5,
  }
});
