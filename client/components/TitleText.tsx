import React from 'react';
import { Title } from './styles';

interface TitleTextProps {
  text: string;
}

export function TitleText({ text }: TitleTextProps) {
  return <Title>{text}</Title>;
}
