import { Stack, router } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  useAnimatedStyle, 
  Easing 
} from 'react-native-reanimated';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Index() {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(200, { duration: 6000, easing: Easing.bezier(0.5, 0, 0.5, 1) }),
      -1,
      true 
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -offset.value * 2 }], 
    };
  });

  return (
    <View style={styles.mainContainer}>
      <AnimatedGradient
        colors={['#b56cdc', '#7713AE', '#510E76', '#2d035b']}
        style={[styles.gradient, animatedStyle]}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 1, y: 0.5 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to{'\n'}Gatch</Text>
          <Text style={styles.subtitle}>Find your next gaming match</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable 
            onPress={() => router.push("/login")} 
            style={({ pressed }) => [
              styles.button, 
              { 
                backgroundColor: pressed ? '#4F259D' : '#936CDC', 
                transform: [{ scale: pressed ? 0.98 : 1 }] 
              }
            ]}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push("/register")} 
            style={({ pressed }) => [
              styles.button, 
              styles.outlineButton,
              { 
                borderColor: pressed ? '#B9B8B9' : '#936CDC', 
                transform: [{ scale: pressed ? 0.98 : 1 }] 
              }
            ]}
          >
            <Text style={styles.outlineButtonText}>Sign up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#1D0038' },
  gradient: {
    position: 'absolute',
    width: '200%',
    height: '100%',
  },
  safeArea: { flex: 1, paddingHorizontal: 20 },
  content: { flex: 1, justifyContent: 'flex-end', marginBottom: 20 },
  title: { fontSize: 48, fontFamily: 'Outfit_900Black', color: 'white', lineHeight: 55 },
  subtitle: { color: 'white', fontSize: 16, marginTop: 10, opacity: 0.9, fontFamily: 'Outfit_400Regular' },
  buttonContainer: { paddingBottom: 120, gap: 15, marginTop: 30 },
  button: { height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: 'white', fontSize: 18, fontFamily: 'Outfit_600SemiBold' },
  outlineButton: { borderWidth: 2, borderColor: '#936CDC' },
  outlineButtonText: { color: 'white', fontSize: 18, fontFamily: 'Outfit_400Regular' },
});