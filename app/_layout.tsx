import '../global.css';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SplashScreen } from 'expo-router';
import RootLayoutContent from '@/components/RootLayoutContent';
import { useEffect } from 'react';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync();
export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <BookmarksProvider>
        <RootLayoutContent />
      </BookmarksProvider>
    </ThemeProvider>
  );
}
