import React from 'react';
import styled from 'styled-components/native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
}

export default function SearchBar({ value, onChangeText, onCancel }: SearchBarProps) {
  return (
    <SearchHeader>
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar posts..."
      />
      <CancelButton onPress={onCancel}>
        <CancelText>Cancelar</CancelText>
      </CancelButton>
    </SearchHeader>
  );
}

const SearchHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 50px 16px 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 0 12px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-left: 12px;
`;

const CancelText = styled.Text`
  color: #007aff;
  font-size: 16px;
`;
