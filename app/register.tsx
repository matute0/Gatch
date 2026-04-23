import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TextInput, Pressable, Animated } from "react-native";
import { Stack } from "expo-router";
import { useState, useRef } from "react";
import { registerFetch } from "./scripts/user";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const SmoothInput = (props: any) => {
  const transition = useRef(new Animated.Value(0)).current;

  const animateBorder = (toValue: number) => {
    Animated.timing(transition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  };

  const borderColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(82, 82, 82)', 'rgba(1, 221, 19, 0.88)']
  });

  return (
    <AnimatedTextInput
      {...props}
      onFocus={() => animateBorder(1)}
      onBlur={() => animateBorder(0)}
      style={[props.style, { borderColor }]}
    />
  );
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signon = async () => {
    if (!username || !email || !password) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const newUser = { 
        username: username, 
        email: email, 
        password: password 
      };

      await registerFetch(newUser);
      alert("Register complete!");
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={style.container}>
        <View style={style.view}>
          <Text style={style.title}>Register</Text>
        </View>
        <View style={style.inputs}>
          <SmoothInput 
            style={style.input} 
            placeholder="Username" 
            placeholderTextColor='white' 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none" 
          />
          
          <SmoothInput 
            style={style.input} 
            placeholder="Email" 
            placeholderTextColor='white' 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none" 
          />
          
          <SmoothInput 
            style={style.input} 
            placeholder="Password" 
            placeholderTextColor='white' 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={true} 
            autoCapitalize="none" 
          />
          
          <Pressable onPress={signon} style={style.button}>
            <Text style={style.buttonText}>Register</Text>
          </Pressable>
          
        </View>
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(29, 0, 56, 67)', 
    flex: 1,
    gap: 20,
  },
  view: {
    marginTop: 20,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    elevation: 5,
  },
  input: {
    backgroundColor: 'rgba(17, 34, 51, 0)',
    borderBottomWidth: 1,
    color: 'white',
    width: 325,
    height: 50,
    paddingLeft: 15,
    
  },
  inputs: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 300,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  }
  
});