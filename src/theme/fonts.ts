import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import { configureFonts } from 'react-native-paper';

export const workSansFonts = {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
};

const regular = 'WorkSans_400Regular';
const medium = 'WorkSans_500Medium';
const semiBold = 'WorkSans_600SemiBold';
const bold = 'WorkSans_700Bold';

/** Work Sans across all MD3 variants — mirrors Tailor-Track typography. */
export const paperFonts = configureFonts({
  config: {
    fontFamily: regular,
  },
});

export const FontFamily = {
  regular,
  medium,
  semiBold,
  bold,
} as const;
