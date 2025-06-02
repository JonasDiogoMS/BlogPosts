import React from 'react';
import { TextInputProps } from 'react-native';
import { Label, Input } from './styles';

interface InputFieldProps extends TextInputProps {
  label: string;
}

export function InputField({ label, ...props }: InputFieldProps) {
  return (
    <>
      <Label>{label}</Label>
      <Input placeholderTextColor="#999" {...props} />
    </>
  );
}
