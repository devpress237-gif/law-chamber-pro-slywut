
import "react-native-reanimated";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Notifications from 'expo-notifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const unstable_settings = {
  initialRouteName: "login",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };
    
    requestPermissions();
  }, []);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#1E40AF",
      background: "#F8FAFC",
      card: "#FFFFFF",
      text: "#1F2937",
      border: "#D1D5DB",
      notification: "#EF4444",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#3B82F6",
      background: "#111827",
      card: "#1F2937",
      text: "#F9FAFB",
      border: "#374151",
      notification: "#F87171",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="add-case" 
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Add New Case",
              }}
            />
            <Stack.Screen 
              name="add-hearing" 
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Add Hearing",
              }}
            />
            <Stack.Screen 
              name="upload-document" 
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Upload Document",
              }}
            />
            <Stack.Screen 
              name="case/[id]" 
              options={{
                headerShown: true,
                title: "Case Details",
              }}
            />
            <Stack.Screen 
              name="hearing/[id]" 
              options={{
                headerShown: true,
                title: "Hearing Details",
              }}
            />
            <Stack.Screen 
              name="document/[id]" 
              options={{
                headerShown: true,
                title: "Document Details",
              }}
            />
          </Stack>
          <SystemBars style="auto" />
        </GestureHandlerRootView>
      </ThemeProvider>
    </>
  );
}
