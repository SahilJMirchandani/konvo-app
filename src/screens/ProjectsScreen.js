import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, useColorScheme, Modal, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, deleteProject } from '../redux/slices/projectsSlice';
import { logout } from '../redux/slices/authSlice';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, loading, creating } = useSelector((state) => state.projects);
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { dispatch(fetchProjects()); }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a project title.');
      return;
    }
    const result = await dispatch(createProject({ title, description }));
    if (createProject.fulfilled.match(result)) {
      setTitle('');
      setDescription('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', result.payload?.message || 'Failed to create project. Try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: dark ? '#fff' : '#000' }]}>My Projects</Text>
        <TouchableOpacity onPress={() => dispatch(logout())}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              onPress={() => navigation.navigate('Tasks', { projectId: item.id, projectTitle: item.title })}
              onDelete={() => dispatch(deleteProject(item.id))}
              dark={dark}
            />
          )}
          ListEmptyComponent={<Text style={[styles.empty, { color: dark ? '#aaa' : '#888' }]}>No projects yet. Create one!</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: dark ? '#fff' : '#000' }]}>New Project</Text>
            <TextInput
              style={[styles.input, { backgroundColor: dark ? '#2a2a2a' : '#f0f0f0', color: dark ? '#fff' : '#000' }]}
              placeholder="Title" placeholderTextColor={dark ? '#666' : '#aaa'}
              value={title} onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { backgroundColor: dark ? '#2a2a2a' : '#f0f0f0', color: dark ? '#fff' : '#000' }]}
              placeholder="Description" placeholderTextColor={dark ? '#666' : '#aaa'}
              value={description} onChangeText={setDescription}
            />
            <TouchableOpacity 
              style={[styles.button, creating && { opacity: 0.7 }]} 
              onPress={handleCreate}
              disabled={creating}
            >
              {creating 
                ? <ActivityIndicator color="#fff" /> 
                : <Text style={styles.buttonText}>Create</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} disabled={creating}>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heading: { fontSize: 28, fontWeight: 'bold' },
  logout: { color: '#6C63FF', fontSize: 16 },
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
