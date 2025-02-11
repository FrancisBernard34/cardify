import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#f0f0f0',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Cardify",
          }}
        />
      </Stack>
    </>
  );
}
