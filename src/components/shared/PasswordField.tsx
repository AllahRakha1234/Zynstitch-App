import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native-paper';

type Props = Omit<TextInputProps, 'secureTextEntry' | 'right'> & {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

export function PasswordField({
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      {...props}
      mode={props.mode ?? 'outlined'}
      secureTextEntry={!visible}
      right={
        <TextInput.Icon
          icon={visible ? 'eye-off' : 'eye'}
          accessibilityLabel={visible ? hidePasswordLabel : showPasswordLabel}
          onPress={() => setVisible((prev) => !prev)}
        />
      }
    />
  );
}
