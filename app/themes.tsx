import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { MotiView } from 'moti';
import Ionicons from 'react-native-vector-icons/Ionicons';

const themes = [
  {
    id: 'light' as const,
    name: 'Light',
    icon: 'sunny-outline',
    colors: {
      primary: '#FFFFFF',
      text: '#1F2937',
      accent: '#3B82F6',
    },
  },
  {
    id: 'dark' as const ,
    name: 'Dark',
    icon: 'moon-outline',
    colors: {
      primary: '#1F2937',
      text: '#F3F4F6',
      accent: '#60A5FA',
    },
  },
  {
    id: 'sepia' as const,
    name: 'Sepia',
    icon: 'book-outline',
    colors: {
      primary: '#F7E5D4',
      text: '#4A3728',
      accent: '#8B4513',
    },
  },
  {
    id: 'night' as const,
    name: 'Night Blue',
    icon: 'cloudy-night-outline',
    colors: {
      primary: '#1A1B2E',
      text: '#E2E8F0',
      accent: '#4F46E5',
    },
  },
  {
    id: 'forest' as const,
    name: 'Forest',
    icon: 'leaf-outline',
    colors: {
      primary: '#E7F0E7',
      text: '#2D3B2D',
      accent: '#3B824B',
    },
  },
];

export default function ThemesScreen() {
  const { theme, setTheme, currentTheme } = useTheme();
  const systemColorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <Stack.Screen
        options={{
          title: 'Themes',
          headerStyle: {
            backgroundColor: theme.bgColor,
          },
          headerTintColor: theme.textColor,
        }}
      />

      <ScrollView className="flex-1 px-4 py-6">
        <Text style={{ color: theme.textColor }} className="mb-6 text-lg font-medium">
          Choose your preferred theme
        </Text>

        {themes.map((themeOption) => (
          <MotiView
            key={themeOption.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: themes.indexOf(themeOption) * 100 }}>
            <TouchableOpacity
              className="mb-4 flex-row items-center rounded-xl p-4"
              style={{
                backgroundColor: themeOption.colors.primary,
                borderWidth: currentTheme === themeOption.id ? 2 : 0,
                borderColor: themeOption.colors.accent,
              }}
              onPress={() => setTheme(themeOption.id)}>
              <View
                className="mr-4 rounded-full p-3"
                style={{ backgroundColor: themeOption.colors.accent + '20' }}>
                <Ionicons name={themeOption.icon} size={24} color={themeOption.colors.accent} />
              </View>

              <View className="flex-1">
                <Text className="text-lg font-medium" style={{ color: themeOption.colors.text }}>
                  {themeOption.name}
                </Text>
                {themeOption.id === 'light' && systemColorScheme === 'light' && (
                  <Text className="text-sm" style={{ color: themeOption.colors.text + '80' }}>
                    System Default
                  </Text>
                )}
                {themeOption.id === 'dark' && systemColorScheme === 'dark' && (
                  <Text className="text-sm" style={{ color: themeOption.colors.text + '80' }}>
                    System Default
                  </Text>
                )}
              </View>

              {currentTheme === themeOption.id && (
                <Ionicons name="checkmark-circle" size={24} color={themeOption.colors.accent} />
              )}
            </TouchableOpacity>
          </MotiView>
        ))}

        <Text style={{ color: theme.textColor + '80' }} className="mt-6 text-center text-sm">
          Choose a theme that's easy on your eyes. You can change it anytime.
        </Text>
      </ScrollView>
    </View>
  );
}
