import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Task2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    checkToken();
  }, []);

  const isWeb = Platform.OS === 'web';

  const checkToken = async () => {
    try {
      let savedToken;
      if (isWeb) {
        savedToken = localStorage.getItem('auth_token');
      } else {
        savedToken = await SecureStore.getItemAsync('auth_token');
      }
      if (savedToken) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    const mockToken = '12345abcde';
    try {
      if (isWeb) {
        localStorage.setItem('auth_token', mockToken);
      } else {
        await SecureStore.setItemAsync('auth_token', mockToken);
      }
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      if (isWeb) {
        localStorage.removeItem('auth_token');
      } else {
        await SecureStore.deleteItemAsync('auth_token');
      }
      setIsLoggedIn(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoggedIn) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Ви авторизовані!</Text>
        <Button title="Вийти" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Логін (плейсхолдер)"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Пароль (плейсхолдер)"
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Увійти" onPress={handleLogin} />
    </View>
  );
}
