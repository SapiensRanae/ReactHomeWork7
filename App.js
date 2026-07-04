import React from 'react';
import { View, ScrollView } from 'react-native';
import Task1 from './task1/Task1';
import Task2 from './task2/Task2';
import Task3 from './task3/Task3';
import Task4 from './task4/Task4';

export default function App() {
  return (
    <ScrollView style={{ flex: 1, paddingTop: 50 }}>
      <Task1 />
      <View style={{ height: 20 }} />
      <Task2 />
      <View style={{ height: 20 }} />
      <Task3 />
      <View style={{ height: 20 }} />
      <Task4 />
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
