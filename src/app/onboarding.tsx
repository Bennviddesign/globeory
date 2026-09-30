import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { AppText } from '@/components/common/AppText';
import { Icon } from '@/components/common/Icon';
import { GlobeView } from '@/components/globe/GlobeView';
import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { PAGE_PADDING, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { useSession } from '@/context/SessionContext';
import type { GlobeData } from '@/services/globe/globeData';

// A decorative route arc so the welcome globe already feels like Globeory.
const WELCOME_GLOBE: GlobeData = {
  markers: [],
  visitedIsoCodes: ['752', '764', '250', '392'],
  routes: [
    { id: 'r1', from: [12.65, 55.6], to: [100.75, 13.7], fromLabel: 'CPH', toLabel: 'BKK', flightIds: [], distanceKm: 0 },
    { id: 'r2', from: [12.65, 55.6], to: [2.55, 49], fromLabel: 'CPH', toLabel: 'CDG', flightIds: [], distanceKm: 0 },
    { id: 'r3', from: [100.75, 13.7], to: [139.8, 35.5], fromLabel: 'BKK', toLabel: 'HND', flightIds: [], distanceKm: 0 },
  ],
};

const SLIDES = [
  { icon: 'book-outline', title: 'Record your journeys', text: 'Trips, flights, hotels, places and memories in one calm personal archive.' },
  { icon: 'earth-outline', title: 'See your world', text: 'Watch your globe fill up with routes, cities and countries, and scroll back through your timeline.' },
  { icon: 'people-outline', title: 'Follow other travelers', text: 'Find people through usernames or the destinations they have really visited. No endless feed.' },
] as const;

/** Splash / onboarding / login-or-demo in one screen (spec sections 55, 56). */
export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const { width } = useWindowDimensions();
  const { startDemo, continueWithLocalProfile } = useSession();
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);
  const slideWidth = width - PAGE_PADDING * 2;
  const globeSize = Math.min(slideWidth, 300);

  const getStarted = async () => {
    const resumed = await continueWithLocalProfile();
    if (resumed) router.replace('/explore');
    else router.push('/create-profile');
  };

  const tryDemo = () => {
    startDemo();
    router.replace('/explore');
  };

  return (
    <Screen scroll={false} edges={['top', 'bottom']}>
      <View style={styles.brand}>
        <AppText variant="label" tone="primary" style={styles.brandText}>
          {APP_NAME.toUpperCase()}
        </AppText>
      </View>

      <View style={styles.globe}>
        <GlobeView data={WELCOME_GLOBE} size={globeSize} center={[60, 30]} interactive={false} showControls={false} />
      </View>

      <AppText variant="display" style={styles.tagline}>
        {APP_TAGLINE}
      </AppText>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        style={{ flexGrow: 0 }}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / slideWidth))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: slideWidth }]}>
            <View style={[styles.slideIcon, { backgroundColor: colors.tintBlue }]}>
              <Icon name={item.icon} size={22} color={colors.primary} />
            </View>
            <AppText variant="title">{item.title}</AppText>
            <AppText tone="secondary" style={{ textAlign: 'center' }}>
              {item.text}
            </AppText>
          </View>
        )}
      />

      <View style={styles.dots} accessibilityLabel={`Page ${page + 1} of ${SLIDES.length}`}>
        {SLIDES.map((s, i) => (
          <View key={s.title} style={[styles.dot, { backgroundColor: i === page ? colors.primary : colors.border, width: i === page ? 20 : 8 }]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Get started" onPress={getStarted} />
        <Button label="Try demo" variant="secondary" icon="play-circle-outline" onPress={tryDemo} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', paddingTop: spacing.lg },
  brandText: { letterSpacing: 4 },
  globe: { alignItems: 'center', marginTop: spacing.md },
  tagline: { textAlign: 'center', marginTop: spacing.md },
  slide: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  slideIcon: { width: 44, height: 44, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  dot: { height: 8, borderRadius: 4 },
  actions: { gap: spacing.md, marginTop: 'auto', paddingBottom: spacing.lg },
});
