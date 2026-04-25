import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, View, Text, TextInput, Pressable, Animated } from "react-native";
import { router, Stack } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { registerFetch } from "./scripts/user";

const USERNAME_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordHide, setPasswordHide] = useState(true);
  
  const eyeSvg = passwordHide ? require("../assets/images/eye-closed-bold.png") : require("../assets/images/eye-outline.png");

  const isUsernameInvalid = username.length > 0 && !USERNAME_REGEX.test(username);
  const isEmailInvalid = email.length > 0 && !EMAIL_REGEX.test(email);
  const isPasswordInvalid = password.length > 0 && !PASSWORD_REGEX.test(password);

  const signon = async () => {
    if (!username || !email || !password) {
      setError("Please complete all fields.");
      return;
    }
    if (isUsernameInvalid || isEmailInvalid || isPasswordInvalid) {
      setError("Please fix the errors in the form before submitting.");
      return;
    }

    try {
      const newUser = { 
        username: username, 
        email: email, 
        password: password 
      };
      setError("");
      await registerFetch(newUser);
      alert("Register complete!");
      router.push("/ActivateAccount");
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
          
          <View style={style.viewInput}>
            <SmoothInput 
            style={style.input} 
            placeholder="Username" 
            placeholderTextColor='white' 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none"
            isInvalid={isUsernameInvalid} 
          />
          {isUsernameInvalid && (
            <Text style={style.helperText}>Must contain letters, numbers, and no spaces.</Text>
          )}
          </View>
          
          <View style={style.viewInput}>
            <SmoothInput 
            style={style.input} 
            placeholder="Email" 
            placeholderTextColor='white' 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none"
            isInvalid={isEmailInvalid}
          />
          {isEmailInvalid && (
            <Text style={style.helperText}>Please enter a valid email address.</Text>
          )}
          </View>

          
          <View style={style.viewInput}>
            <View style={style.password}>
              <SmoothInput 
                style={[style.input, style.passinput]} 
                placeholder="Password" 
                placeholderTextColor='white' 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={passwordHide} 
                autoCapitalize="none"
                isInvalid={isPasswordInvalid}
              />
              <Pressable style={style.passwordH} onPress={() => setPasswordHide(!passwordHide)}>
                <Image source={eyeSvg} style={style.iconImage} resizeMode="contain"/>
              </Pressable>
              
            </View>
            {isPasswordInvalid && (
              <Text style={style.helperText}>
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
              </Text>
            )}
            
          </View>
          
          
          
        </View>
        <View style={style.viewButton}>
          <Pressable onPress={signon} style={style.button}>
            <Text style={style.buttonText}>Join now</Text>
          </Pressable>
          
          {error ? <Text style={style.error}>{error}</Text> : null}
        </View>
        
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(29, 0, 56, 1)',
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
    fontSize: 20,
  },
  inputs: {
    alignItems: 'center',
    height: 220,
  },
  helperText: {
    color: 'rgb(255, 50, 50)',
    fontSize: 12,
    width: 325,
    textAlign: 'left',
    paddingLeft: 15,
    marginTop: -10,
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
    width: 40,
    height: 40,
    marginLeft: 10,
    tintColor: 'white',
  },
  viewButton: {
    alignItems: 'center',
    gap: 15,
  },
  viewInput:{
    flex: 1,
    gap: 15,
  }
});