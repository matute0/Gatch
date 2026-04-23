import { Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Index() {

  
  return (
    <SafeAreaView style={style.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
      style={style.view}
    >
      <Text style={style.title}>GATCH</Text>
      <Text style={style.textFind}>Find your perfect game</Text>
    </View>
    <View style={style.buttons}>
    <Pressable style={style.button}><Text style={style.buttonText}>Login</Text></Pressable>
    <Pressable onPress={()=> {router.push("/register")}} style={style.button}><Text style={style.buttonText}>Register</Text></Pressable>
    </View>
    
    </SafeAreaView>    
  );
}
const style = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: 'rgb(46, 0, 88)67'
    },
    view: {
      flex: 1,
        alignItems: "center",
    },
    title: {
      fontSize: 60,
      fontWeight: "bold",
      color: 'white',
    },
    textFind: {
      color: 'white',
    },
    buttons: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    button: {
      backgroundColor: 'white',
      borderRadius: 8,
      width: 325,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText:{
      color: 'black',
      fontSize: 20,
    },
  })