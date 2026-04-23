import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import { registerFetch } from "./scripts/user";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const signon = async () => {
    if (!username || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const newUser = { 
        username: username, 
        email: email, 
        password: password 
      };

      const result = await registerFetch(newUser);
      
      console.log("Resultado exitoso:", result);
      alert("¡Usuario registrado con éxito!");
      
    } catch (error: any) {
      console.error("Error en el componente:", error.message);
      alert("Error: " + error.message);
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
                <TextInput style={style.input} placeholder="Username" value={username} onChangeText={setUsername}></TextInput>
                <TextInput style={style.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"></TextInput>
                <TextInput style={style.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true}></TextInput>
            <Pressable onPress={signon} style={style.button}><Text style={style.buttonText}>Register</Text></Pressable>
            </View>
        </SafeAreaView>
        </>
    );
}
const style = StyleSheet.create({
        container: {
        backgroundColor: 'rgb(46, 0, 88)67',
        flex: 1,
        gap: 20,
        },
        view: {
            
        },
        title: {
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        input: {
            backgroundColor: 'white',
            width: 325,
            height: 50,
            borderRadius: 8,
            paddingLeft: 15,
        },
        inputs: {
            flex: 1,
            alignItems: 'center',
            gap: 10,
        },
        button:{
    backgroundColor: 'white',
      borderRadius: 8,
      width: 300,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
        },
        buttonText: {
color: 'black',
      fontSize: 20,
        }
    })