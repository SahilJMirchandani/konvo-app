import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, useColorScheme, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, toggleTask, deleteTask } from '../redux/slices/tasksSlice';
import TaskCard from '../components/TaskCard';

export default function TasksScreen({ route }) {
  const { projectId, projectTitle } = route.params;
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.tasks);
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => { dispatch(fetchTasks(projectId)); }, [projectId]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await dispatch(createTask({ projectId, data: { title, due_date: dueDate || null } }));
    setTitle(''); setDueDate(''); setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.heading, { color: dark ? '#fff' : '#000' }]}>{projectTitle}</Text>

      {loading ? <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={() => dispatch(toggleTask({ projectId, taskId: item.id, status: item.status === 'complete' ? 'incomplete' : 'complete' }))}
              onDelete={() => dispatch(deleteTask({ projectId, taskId: item.id }))}
              dark={dark}
            />
          )}
          ListEmptyComponent={<Text style={[styles.empty, { color: dark ? '#aaa' : '#888' }]}>No tasks yet. Add one!</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: dark ? '#fff' : '#000' }]}>New Task</Text>
            <TextInput
              style={[styles.input, { backgroundColor: dark ? '#2a2a2a' : '#f0f0f0', color: dark ? '#fff' : '#000' }]}
              placeholder="Task title" placeholderTextColor={dark ? '#666' : '#aaa'}
              value={title} onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { backgroundColor: dark ? '#2a2a2a' : '#f0f0f0', color: dark ? '#fff' : '#000' }]}
              placeholder="Due date (optional, e.g. 2025-06-01)" placeholderTextColor={dark ? '#666' : '#aaa'}
              value={dueDate} onChangeText={setDueDate}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.cancel, { color: dark ? '#aaa' : '#888' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 16 },
  fab: { position: 'absolute', bottom: 32, right: 24, backgroundColor: '#6C63FF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', fontSize: 16 },
});