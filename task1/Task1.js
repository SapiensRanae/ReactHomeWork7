import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Task1() {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');

  useEffect(() => {
    loadName();
  }, []);

  const loadName = async () => {
    try {
      const value = await AsyncStorage.getItem('user_name');
      if (value !== null) {
        setSavedName(value);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveName = async () => {
    try {
      await AsyncStorage.setItem('user_name', name);
      setSavedName(name);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text>Збережене ім'я: {savedName}</Text>
      <TextInput
        placeholder="Введіть ім'я"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Зберегти" onPress={saveName} />
    </View>
  );
}
