import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{title}</Text>
      {description ? (
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
