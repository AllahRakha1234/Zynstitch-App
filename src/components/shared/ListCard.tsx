import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
};

export function ListCard({ title, subtitle, meta, onPress }: Props) {
  return (
    <Card mode="outlined" style={styles.card} onPress={onPress}>
      <Card.Content>
        <Text variant="titleMedium">{title}</Text>
        {subtitle ? (
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <View style={styles.meta}>
            <Text variant="bodySmall">{meta}</Text>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.two,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.75,
  },
  meta: {
    marginTop: Spacing.two,
  },
});
