import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Button, ButtonText } from './styles';

interface PrimaryButtonProps extends TouchableOpacityProps {
  text: string;
}

export function PrimaryButton({ text, ...props }: PrimaryButtonProps) {
  return (
    <Button {...props}>
      <ButtonText>{text}</ButtonText>
    </Button>
  );
}
