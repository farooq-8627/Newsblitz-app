import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

// Configure how notifications should be handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show alert when app is in foreground
    shouldPlaySound: true, // Play sound
    shouldSetBadge: true, // Set app badge number
  }),
});

// Define context type
interface NotificationsContextType {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
}

// Create context with default values
const NotificationsContext = createContext<NotificationsContextType>({
  expoPushToken: undefined,
  notification: undefined,
});

// Provider component
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const router = useRouter();

  useEffect(() => {
    // Get push token when component mounts
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const articleId = response.notification.request.content.data.articleId;
      if (articleId) {
        router.push(`/article/${articleId}`);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationsContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  // Create notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check if device is physical (not simulator)
  if (Device.isDevice) {
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Return if permissions not granted
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Get push token
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
  }

  return token?.data;
}

// Hook to use notifications context
export const useNotifications = () => useContext(NotificationsContext);
