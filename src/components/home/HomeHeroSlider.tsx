import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useSession } from '@/providers/AuthProvider';
import { brandColors } from '@/theme/colors';

const slides = [
  {
    title: 'Centralized Customer Profiles',
    description:
      'Keep every client’s contact details, notes, and tailoring preferences organized in one place.',
    image: require('@/assets/images/slider/male-suit.jpg'),
  },
  {
    title: 'Tailoring Workflow in One Dashboard',
    description:
      'Manage customer intake, order stages, stitching, and delivery from a single control center.',
    image: require('@/assets/images/slider/digital-icons.jpg'),
  },
  {
    title: 'Reusable Measurement Records',
    description:
      'Store and update body profiles so repeat customers get fast, accurate fittings every time.',
    image: require('@/assets/images/slider/dashboard.jpg'),
  },
  {
    title: 'Clear Order Progress Tracking',
    description: 'See order status from intake to handover, with each stage visible and easy to follow.',
    image: require('@/assets/images/slider/digital-shop.jpg'),
  },
];

type Props = {
  onContactPress: () => void;
};

export function HomeHeroSlider({ onContactPress }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { isAuthenticated } = useSession();
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const slide = slides[index];
  const heroHeight = Math.max(height * 0.72, 520);

  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const ctaHref = useMemo(
    () => (isAuthenticated ? '/customers' : '/login'),
    [isAuthenticated],
  );

  return (
    <View style={[styles.hero, { height: heroHeight }]}>
      <Image
        source={slide.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={350}
      />
      <View style={styles.overlay} />

      <View style={[styles.inner, { paddingTop: insets.top + Spacing.three }]}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>Zynstitch Platform</Text>
        </View>

        <Text style={styles.heroTitle}>Run Your Tailoring Studio with Zynstitch</Text>
        <Text style={styles.heroDescription}>
          Zynstitch helps you track clients, measurements, and deliveries in one focused workspace.
        </Text>

        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>

        <View style={styles.actions}>
          <Link href={ctaHref} asChild>
            <Button mode="contained" buttonColor="#ffffff" textColor={brandColors.light.primary}>
              {isAuthenticated ? 'Open Dashboard' : 'Sign In'}
            </Button>
          </Link>
          <Button mode="outlined" textColor="#ffffff" onPress={onContactPress} style={styles.secondary}>
            Contact Us
          </Button>
        </View>

        <View style={styles.dots}>
          {slides.map((item, i) => (
            <Pressable
              key={item.title}
              onPress={() => setIndex(i)}
              accessibilityRole="button"
              accessibilityLabel={`Show slide ${i + 1}: ${item.title}`}
              accessibilityState={{ selected: i === index }}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: brandColors.light.primary,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 24, 42, 0.62)',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 38,
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 16,
    lineHeight: 24,
  },
  slideTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginTop: Spacing.two,
  },
  slideDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  secondary: {
    borderColor: 'rgba(255,255,255,0.75)',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.four,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#fff',
  },
});
