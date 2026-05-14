import { router, Stack } from "expo-router";
import { StyleSheet, Text, Animated, TextInput, View,Pressable, Image,ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { changePassword } from "@/scripts/resetPassword";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

export default function ChangePassword() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHide, setPasswordHide] = useState(true);
  const eyeSvg = passwordHide ? require("../assets/images/eye-closed-bold.png") : require("../assets/images/eye-outline.png");
  const isPasswordInvalid = password.length > 0 && !PASSWORD_REGEX.test(password);
  const [isLoading, setIsLoading] = useState(false);


  const handlePress = async () => {
    if (!code || !password) {
    setError("Please fill in all fields.");
    return;
  }
  
  if (isPasswordInvalid) {
    setError("Password does not meet requirements.");
    return;
  }
    try{
    setError("");
    setIsLoading(true);
    const pwRequest = {
      code: code,
      password: password
    }
    await changePassword(pwRequest);
    setIsLoading(false);
    alert("Password changed.")
    router.replace("/login");
    } catch(error: any){
      setIsLoading(false);
      setError(error.message);
    }
    

  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.textCheck}>
            Check your inbox for the reset code to update your password.
          </Text>
          
          <SmoothInput
            placeholder="Enter UUID code"
            placeholderTextColor="white"
            value={code}
            onChangeText={setCode}
            isInvalid={error}
            autoCapitalize="none"
            style={styles.input}
          />
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
                          isInvalid={isPasswordInvalid}
                        />
                        <Pressable style={styles.passwordH} onPress={() => setPasswordHide(!passwordHide)}>
                          <Image source={eyeSvg} style={styles.iconImage} resizeMode="contain"/>
                        </Pressable>
                        
                      </View>
                      {isPasswordInvalid && (
                        <Text style={styles.helperText}>
                          Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                        </Text>
                      )}
                      
                    </View>

                    <View style={styles.viewButton}>
                              <Pressable onPress={handlePress} style={styles.button} disabled={isLoading}>
                                <Text style={styles.buttonText}>Change Password</Text>
                                
                              </Pressable>
                              
                              {error ? <Text style={styles.error}>{error}</Text> : null}
                            </View>

          
        </View>
      </SafeAreaView>
      {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'rgba(29, 0, 56, 1)',
    flex: 1,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  textCheck: {
    color: 'white',
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
  viewInput:{
    gap: 15,
    marginTop: 20,
  },  password: {
    flexDirection: 'row',    
  },  passinput: {
    width: 275,
  },  input: {
    borderBottomWidth: 1,
    color: 'white',
    width: 325,
    height: 50,
    paddingLeft: 15,
    fontSize: 20,
  },passwordH:{
    alignContent: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  }, error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },  iconImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    tintColor: 'white',
  },  helperText: {
    color: 'rgb(255, 50, 50)',
    fontSize: 12,
    width: 325,
    textAlign: 'left',
    paddingLeft: 15,
    marginTop: -10,
  },  viewButton: {
    alignItems: 'center',
    gap: 15,
  },  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 300,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
  },  buttonText: {
    color: 'black',
    fontSize: 20,
  },  loadingOverlay: {
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
  }
});