import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

export default function ScreenHeader({ title, iconName, onIconPress }: ScreenHeaderProps) {
  return (
    <Header>
      <HeaderText>{title}</HeaderText>
      {iconName && (
        <TouchableOpacity onPress={onIconPress}>
          <Ionicons name={iconName} size={24} color="black" />
        </TouchableOpacity>
      )}
    </Header>
  );
}

const Header = styled.View`
  padding: 50px 20px 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderText = styled.Text`
  font-size: 22px;
  font-weight: bold;
`;
