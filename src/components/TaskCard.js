import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskCard({ task, onToggle, onDelete, dark }) {
  const complete = task.status === 'complete';

  return (
    <View style={[styles.card, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        <Text style={styles.checkboxText}>{complete ? '✅' : '⬜'}</Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.title, { color: dark ? '#fff' : '#000', textDecorationLine: complete ? 'line-through' : 'none' }]}>
          {task.title}
        </Text>
        {task.due_date && (
          <Text style={[styles.due, { color: dark ? '#aaa' : '#888' }]}>
            Due: {new Date(task.due_date).toDateString()}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  checkbox: { marginRight: 12 },
  checkboxText: { fontSize: 22 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '500' },
  due: { fontSize: 13, marginTop: 4 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 20 },
});