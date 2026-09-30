import { Tabs } from 'expo-router/js-tabs';
import { AppTabBar } from '@/components/navigation/AppTabBar';

/** Explore | Trips | (+) | Places | Profile. The "+" is drawn by AppTabBar. */
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="trips" options={{ title: 'Trips' }} />
      <Tabs.Screen name="places" options={{ title: 'Places' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
