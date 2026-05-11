import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { Alert,ActivityIndicator,StyleSheet, Text, Animated, TextInput, View, Pressable, Image} from "react-native";
import { useState, useRef, useEffect} from "react";
import { login } from "@/scripts/user";


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

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordHide, setPasswordHide] = useState(true);
    const eyeSvg = passwordHide ? require("../assets/images/eye-closed-bold.png") : require("../assets/images/eye-outline.png");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);


const signin = async () => {
    const authRequest = {
        username: username,
        password: password,
    };
    
    try {
        await login(authRequest);
        router.navigate("/home");
    } catch(error) {
        console.log("Error detallado:", error);
        Alert.alert("Error", "No se pudo iniciar sesión. Revisa tus datos.");
    }
}

    return(
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.logintext}>Log in</Text>
            <View style={styles.inputs}>
                <View style={styles.viewInput}>
                        <SmoothInput 
                        style={styles.input} 
                        placeholder="Username" 
                        placeholderTextColor='white' 
                        value={username} 
                        onChangeText={setUsername} 
                        autoCapitalize="none"
                      />
                      
                      </View>
                      <View style={styles.viewInput}>
                                  <View style={styles.password}>
                                    <SmoothInput 
                                      style={[styles.input, styles.passinput]} 
                                      placeholder="Password" 
                                      placeholderTextColor='white' 
                                      value={password} 
                                      onChangeText={setPassword} 
                                      secureTextEntry={passwordHide} 
                                      autoCapitalize="none"
                                      
                                    />
                                    <Pressable style={styles.passwordH} onPress={() => setPasswordHide(!passwordHide)}>
                                      <Image source={eyeSvg} style={styles.iconImage} resizeMode="contain"/>
                                    </Pressable>
                                    
                                  </View>
                                  
                                  
                                </View>
            </View>
            <View style={styles.viewButton}>
                <Pressable onPress={signin} style={styles.button} disabled={isLoading}>
                        <Text style={styles.buttonText}>Enter</Text>
                        
                      </Pressable>
            </View>
            
         {error ? <Text style={styles.error}>{error}</Text> : null}
            
            {isLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <Text style={styles.loadingText}>Login...</Text>
                    </View>
                  )}
        </SafeAreaView>
        </>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(29, 0, 56, 1)',
    },
    logintext:{
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
        marginTop: 20,
    },viewInput:{
    flex: 1,
    gap: 15,
  },input: {
    backgroundColor: 'rgba(17, 34, 51, 0)',
    borderBottomWidth: 1,
    color: 'white',
    width: 325,
    height: 50,
    paddingLeft: 15,
    fontSize: 20,
  },password: {
    flexDirection: 'row',    
  },passwordH:{
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
  },inputs: {
    marginTop: 20,
    alignItems: 'center',
    height: 150,
  },error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  viewButton:{
    alignItems: 'center',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, 
    elevation: 10,
  },loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
})