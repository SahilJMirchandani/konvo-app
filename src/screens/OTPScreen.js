import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../redux/slices/authSlice';

export default function OTPScreen({ route }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const handleVerify = () => {
    dispatch(verifyOTP({ email, otp }));
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: dark ? '#fff' : '#000' }]}>Enter OTP</Text>
      <Text style={[styles.subtitle, { color: dark ? '#aaa' : '#555' }]}>Sent to {email}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: dark ? '#1e1e1e' : '#fff', color: dark ? '#fff' : '#000' }]}
        placeholder="6-digit OTP"
        placeholderTextColor={dark ? '#666' : '#aaa'}
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />
      {error && <Text style={styles.error}>{error.message || 'Invalid OTP'}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
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