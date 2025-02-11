import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
          options={({ navigation }) => ({
            title: "Cardify",
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('settings')}
                style={{ marginRight: 15 }}
              >
                <Ionicons 
                  name="settings-outline" 
                  size={24} 
                  color={colorScheme === 'dark' ? '#ffffff' : '#000000'} 
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="add"
          options={{
            title: "Add Card",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
