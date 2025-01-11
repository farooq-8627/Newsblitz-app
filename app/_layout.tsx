import '../global.css';
import { Stack } from 'expo-router';
import { BookmarksProvider } from '@/context/BookmarksContext';
import Toast, { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import { MotiView } from 'moti';
import { ThemeProvider } from '@/context/ThemeContext';
import { View } from 'react-native';

// Separate the RootLayout into its own component file
import RootLayoutContent from '@/components/RootLayoutContent';

export default function Layout() {
  return (
    <ThemeProvider>
      <BookmarksProvider>
        <RootLayoutContent />
      </BookmarksProvider>
    </ThemeProvider>
  );
}
