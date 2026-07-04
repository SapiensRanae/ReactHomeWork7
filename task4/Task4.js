import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function Task4() {
  const [db, setDb] = useState(null);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function setup() {
      try {
        const database = await SQLite.openDatabaseAsync('notes.db');
        await database.execAsync('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, category TEXT);');
        setDb(database);
        loadNotes(database, '');
      } catch (e) {
        console.error("SQLite error:", e);
      }
    }
    setup();
  }, []);

  const loadNotes = async (database, query) => {
    if (!database) return;
    try {
      let allRows;
      if (query) {
        allRows = await database.getAllAsync('SELECT * FROM notes WHERE content LIKE ? OR category LIKE ?', [`%${query}%`, `%${query}%`]);
      } else {
        allRows = await database.getAllAsync('SELECT * FROM notes');
      }
      setNotes(allRows);
    } catch (e) {
      console.error(e);
    }
  };

  const addNote = async () => {
    if (!db) return;
    try {
      await db.runAsync('INSERT INTO notes (content, category) VALUES (?, ?)', [note, category]);
      setNote('');
      setCategory('');
      loadNotes(db, search);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (db) {
      loadNotes(db, text);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Пошук..."
        value={search}
        onChangeText={handleSearch}
        style={{ backgroundColor: '#eee', padding: 5, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Текст нотатки"
        value={note}
        onChangeText={setNote}
        style={{ borderBottomWidth: 1, marginBottom: 5 }}
      />
      <TextInput
        placeholder="Категорія"
        value={category}
        onChangeText={setCategory}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Додати нотатку" onPress={addNote} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10, borderBottomWidth: 0.5, paddingBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>[{item.category}]</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}
