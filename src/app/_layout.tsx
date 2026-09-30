import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataProvider, useData } from '@/context/DataContext';
import { SessionProvider, useSession } from '@/context/SessionContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

void SplashScreen.preventAutoHideAsync();

/** Keeps the splash screen up until settings, session and data are loaded. */
function ReadyGate({ children }: { children: ReactNode }) {
  const settings = useSettings();
  const session = useSession();
  const data = useData();
  const ready = settings.ready && session.ready && data.ready;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  return ready ? <>{children}</> : null;
}

function RootStack() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="add"
          options={{ presentation: 'transparentModal', animation: 'none', contentStyle: { backgroundColor: 'transparent' } }}
        />
        <Stack.Screen name="form/[kind]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="create-profile" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeProvider>
          <SessionProvider>
            <DataProvider>
              <ReadyGate>
                <RootStack />
              </ReadyGate>
            </DataProvider>
          </SessionProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
