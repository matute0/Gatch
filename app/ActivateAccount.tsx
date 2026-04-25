import {StyleSheet, Text} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";

export default function ActivateAccount(){
    return(
        <>
      <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={style.content}>
            <Text>Check your email and put the code</Text>
        </SafeAreaView>
        </>
        
    );
}
const style = StyleSheet.create({
    content:{

    }
})