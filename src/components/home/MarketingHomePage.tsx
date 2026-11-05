import { useRef, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HomeContact } from '@/components/home/HomeContact';
import { HomeFeatures } from '@/components/home/HomeFeatures';
import { HomeFooter } from '@/components/home/HomeFooter';
import { HomeHeroSlider } from '@/components/home/HomeHeroSlider';
import { useTheme } from '@/hooks/use-theme';

export function MarketingHomePage() {
  const colors = useTheme();
  const scrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null);
  const contactY = useRef(0);

  return (
    <ScrollView
      ref={(node) => {
        scrollRef.current = node;
      }}
      style={[styles.page, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <HomeHeroSlider
        onContactPress={() => {
          scrollRef.current?.scrollTo({ y: contactY.current, animated: true });
        }}
      />
      <HomeFeatures />
      <View
        onLayout={(event) => {
          contactY.current = event.nativeEvent.layout.y;
        }}
      >
        <HomeContact />
      </View>
      <HomeFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
});
