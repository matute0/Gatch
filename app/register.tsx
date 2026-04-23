import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet,Image, View, Text, TextInput, Pressable, Animated } from "react-native";
import { Stack } from "expo-router";
import { useState, useRef } from "react";
import { registerFetch } from "./scripts/user";
import EyeVisible from ""

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
  const [error, setError] = useState("");
  const [passwordHide, setPasswordHide] = useState(true);
  const eyeSvg = passwordHide ? require("../assets/images/eye-closed-bold.png") : require("../assets/images/eye-outline.png");

  const signon = async () => {
    if (!username || !email || !password) {
      setError("Please complete all fields.");
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
      setError("");
    } catch (error: any) {
      setError(error.message);
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
          
          <View style={style.password}>
            <SmoothInput 
            style={[style.input, style.passinput]} 
            placeholder="Password" 
            placeholderTextColor='white' 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={passwordHide} 
            autoCapitalize="none" 
          />
          <Pressable style={style.passwordH} onPress={() =>{setPasswordHide(!passwordHide)}}>
            <Image source={eyeSvg} style={style.iconImage} resizeMode="contain"/>
          </Pressable>

          </View>
          

          {error ? <Text style={style.error}>{error}</Text> : null}
          
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
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  password: {
    flexDirection: 'row',    
  },
  passwordH:{
        alignContent: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  passinput: {
    width: 275,
  },
  iconImage: {
    filter:' invert(100%)',
    width: 40,
    height: 40,
    marginLeft: 10,
  }
  
});