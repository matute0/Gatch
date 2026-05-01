import React, { useState, useRef } from 'react';
import {ActivityIndicator, View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { activateUser } from './scripts/user';
import { useEmailStore } from './stores/useEmailStore';

export default function VerificationCode() {
  const [code, setCode] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const inputRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const userMail = useEmailStore((state) => state.email);

  const codeLength = 6;
  const digits = new Array(codeLength).fill(0);

const handleBoxPress = (index) => {
    const targetIndex = Math.min(index, code.length);
    setCursorIndex(targetIndex);
    
    inputRef.current?.blur();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50); 
  };
  const handleTextChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setCode(numericText);
  };
  const handlePressed = async () =>{
    try{
      setError("");
      setLoading(true);
      await activateUser(userMail, code)
      setLoading(false);
      alert("Welcome!");
    } catch(error: any){
      setLoading(false);
      setError(error.message);
    }
    
    
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.enterCodeText}>Enter the 6-digit code sent to your email.</Text>
      <View style={styles.boxesContainer}>
        {digits.map((_, index) => {
          const digit = code[index] || '';
          const isCurrentBox = index === cursorIndex;

          return (
            <Pressable 
              key={index} 
              style={[
                styles.box, 
                isCurrentBox && styles.activeBox 
              ]}
              onPress={() => handleBoxPress(index)}
            >
              <Text style={styles.boxText}>{digit}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        keyboardType="number-pad"
        maxLength={codeLength}
        value={code}
        onChangeText={handleTextChange}
        autoFocus={true}
        textContentType="oneTimeCode"
        
        selection={{
          start: cursorIndex,
          end: cursorIndex < code.length ? cursorIndex + 1 : cursorIndex
        }}
        onSelectionChange={(e) => {
          setCursorIndex(e.nativeEvent.selection.start);
        }}
      />
    </View>
    <View style={styles.viewButton}>
      <Pressable
  style={({ pressed }) => [
    styles.submitButton,
    pressed && styles.submitButtonPressed,
    code.length < 6 && styles.submitButtonDisabled
  ]}
  disabled={code.length < 6}
  onPress={() => {
    handlePressed();
  }}
>
  <Text style={styles.submitButtonText}>Verify Code</Text>
</Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}

    </View>
    {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Creating account...</Text>
            </View>
          )}
    
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewButton:{
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, 
    elevation: 10,
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  enterCodeText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: 'rgba(1, 221, 19, 0.88)', 
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
    shadowColor: 'rgba(1, 221, 19, 1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonPressed: {
    backgroundColor: 'rgba(1, 180, 15, 0.88)',
    transform: [{ scale: 0.98 }],
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(82, 82, 82, 0.5)',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  safearea:{
  flex: 1,
    backgroundColor: 'rgba(29, 0, 56, 1)',
  },
  boxesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  box: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: 'rgb(82, 82, 82)', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 34, 51, 0.5)', 
  },
  activeBox: {
    borderColor: 'rgba(1, 221, 19, 0.88)', 
  },
  boxText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});