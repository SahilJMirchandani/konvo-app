import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProjectCard({ project, onPress, onDelete, dark }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.info}>
        <Text style={[styles.title, { color: dark ? '#fff' : '#000' }]}>{project.title}</Text>
        <Text style={[styles.desc, { color: dark ? '#aaa' : '#666' }]} numberOfLines={2}>
          {project.description || 'No description'}
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 14 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 20 },
});