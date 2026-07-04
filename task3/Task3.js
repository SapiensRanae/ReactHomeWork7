import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function Task3() {
  const [db, setDb] = useState(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        const database = await SQLite.openDatabaseAsync('todo.db');
        await database.execAsync('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);');
        setDb(database);
        loadTasks(database);
      } catch (e) {
        console.error("SQLite error:", e);
      }
    }
    setup();
  }, []);

  const loadTasks = async (database) => {
    if (!database) return;
    try {
      const allRows = await database.getAllAsync('SELECT * FROM tasks');
      setTasks(allRows);
    } catch (e) {
      console.error(e);
    }
  };

  const addTask = async () => {
    if (!db) return;
    try {
      if (editingId) {
        await db.runAsync('UPDATE tasks SET name = ? WHERE id = ?', [task, editingId]);
        setEditingId(null);
      } else {
        await db.runAsync('INSERT INTO tasks (name) VALUES (?)', [task]);
      }
      setTask('');
      loadTasks(db);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (id) => {
    if (!db) return;
    try {
      await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
      loadTasks(db);
    } catch (e) {
      console.error(e);
    }
  };

  const editTask = (item) => {
    setTask(item.name);
    setEditingId(item.id);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Нове завдання"
        value={task}
        onChangeText={setTask}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title={editingId ? "Оновити" : "Додати"} onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => editTask(item)} style={{ marginRight: 10 }}>
                <Text style={{ color: 'blue' }}>Ред.</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={{ color: 'red' }}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
