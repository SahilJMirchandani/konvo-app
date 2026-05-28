import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP } from '../redux/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const handleSendOTP = async () => {
    const result = await dispatch(sendOTP(email));
    if (sendOTP.fulfilled.match(result)) {
      navigation.navigate('OTP', { email });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: dark ? '#fff' : '#000' }]}>Welcome to Konvo</Text>
      <Text style={[styles.subtitle, { color: dark ? '#aaa' : '#555' }]}>Enter your email to continue</Text>
      <TextInput
        style={[styles.input, { backgroundColor: dark ? '#1e1e1e' : '#fff', color: dark ? '#fff' : '#000' }]}
        placeholder="Email address"
        placeholderTextColor={dark ? '#666' : '#aaa'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error && <Text style={styles.error}>{error.message || 'Something went wrong'}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 32 },
  input: { borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: 'red', marginBottom: 12 },
});