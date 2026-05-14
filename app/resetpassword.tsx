import {router, Stack} from 'expo-router';
import { genCode } from '@/scripts/resetPassword';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from "react";
import { ActivityIndicator,StyleSheet, View, Text, TextInput, Pressable, Animated } from "react-native";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const SmoothInput = ({ isInvalid, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const transition = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
    let toValue = 0;
    if (isInvalid) {
      toValue = 2;
    } else if (isFocused) {
      toValue = 1;
    }

    Animated.timing(transition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, isInvalid]);

  const borderColor = transition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['rgb(82, 82, 82)', 'rgba(1, 221, 19, 0.88)', 'rgb(255, 50, 50)']
  });

  return (
    <AnimatedTextInput
      {...props}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[props.style, { borderColor }]}
    />
  );
};

export default function ResetPassword(){
    const [email, setEmail] = useState("");
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailInvalid = email.length > 0 && !EMAIL_REGEX.test(email);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handlePressed = async () =>{
        try{
            setError("");
            setLoading(true);
            await genCode(email);
            setLoading(false);
            router.navigate("/changepassword");
        } catch(error: any){
            setLoading(false);
            setError(error.message);
            throw error;
        }
    }

    return(
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.enterText}>Enter your email to send a password reset code.</Text>
        
        <View style={styles.viewInput}>
                    <SmoothInput 
                    style={styles.input} 
                    placeholder="Email" 
                    placeholderTextColor='white' 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address" 
                    autoCapitalize="none"
                    isInvalid={isEmailInvalid}
                  />
                  {isEmailInvalid && (
                    <Text style={styles.helperText}>Please enter a valid email address.</Text>
                  )}
                  </View>
        <View style={styles.viewButton}>
              <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
          ]}
        
          onPress={() => {
            handlePressed();
          }}
        >
          <Text style={styles.submitButtonText}>Send code</Text>
        </Pressable>
                  {error ? <Text style={styles.error}>{error}</Text> : null}
        
            </View>
        </SafeAreaView>
        {isLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <Text style={styles.loadingText}>Activating account...</Text>
                    </View>
                  )}
        </>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex:1,
        backgroundColor: 'rgba(29, 0, 56, 1)',
    },
    enterText:{
        color: 'white',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 30,
    }, helperText: {
    color: 'rgb(255, 50, 50)',
    fontSize: 12,
    width: 325,
    textAlign: 'left',
    paddingLeft: 15,
    marginTop: -10,
  },
  input: {
    backgroundColor: 'rgba(17, 34, 51, 0)',
    borderBottomWidth: 1,
    color: 'white',
    width: 325,
    height: 50,
    paddingLeft: 15,
    fontSize: 20,
  },  viewInput:{
    marginTop: 25,
    gap: 15,
    alignSelf: 'center',
  },viewButton:{
    alignItems: 'center',
  }, submitButton: {
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
  },submitButtonPressed: {
    backgroundColor: 'rgba(1, 180, 15, 0.88)',
    transform: [{ scale: 0.98 }],
  },submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },loadingOverlay: {
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
})