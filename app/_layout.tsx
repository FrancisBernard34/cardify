import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

export default function RootLayout() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.cardBackground,
          },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="add"
          options={{
            presentation: "modal",
            title: "Add Card",
            headerStyle: {
              backgroundColor: colors.cardBackground,
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            presentation: "modal",
            title: "Edit Card",
            headerStyle: {
              backgroundColor: colors.cardBackground,
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
      </Stack>
    </>
  );
}
