import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './index';
import { usePosts } from '../../../../context/PostsContext';
import { router } from 'expo-router';

// Mock do usePosts para controlar posts e loading
jest.mock('../../../../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// Mock do router.push para capturar navegações
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock do PostCard usando TouchableOpacity e Text do React Native
jest.mock('../../../../components/PostCard', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');

  return ({ post, onPress }: { post: any; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} testID={`post-${post.id}`}>
      <Text>{post.content}</Text>
    </TouchableOpacity>
  );
});

// Mock do ScreenHeader para mostrar o título e botão de busca
jest.mock('../../../../components/ScreenHeader', () => {
    const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, iconName, onIconPress }: any) => (
    <>
      <Text>{title}</Text>
      {iconName && (
        <TouchableOpacity onPress={onIconPress} testID="search-icon">
          <Text>Search Icon</Text>
        </TouchableOpacity>
      )}
    </>
  );
});

// Mock do SearchBar com input e botão cancelar
jest.mock('../../../../components/SearchBar', () => {
  const React = require('react');
  const { TextInput, TouchableOpacity, Text } = require('react-native');

  return ({ value, onChangeText, onCancel }: any) => (
    <>
      <TextInput
        testID="search-input"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onCancel} testID="cancel-button">
        <Text>Cancelar</Text>
      </TouchableOpacity>
    </>
  );
});

// Mock do Ionicons (retorna null)
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('HomeScreen', () => {
  const mockPosts = [
    {
      id: '1',
      content: 'React Native é ótimo',
      description: 'Aprendendo React Native',
    },
    {
      id: '2',
      content: 'Teste post',
      description: 'Descrição do teste',
    },
  ];

  beforeEach(() => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: mockPosts,
      loading: false,
    });
    (router.push as jest.Mock).mockClear();
  });

  it('renderiza posts corretamente', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('post-1')).toBeTruthy();
    expect(getByTestId('post-2')).toBeTruthy();
  });

  it('entra em modo busca e filtra posts', () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen />);

    // Clicar no ícone de busca
    fireEvent.press(getByTestId('search-icon'));

    // O input de busca aparece
    const searchInput = getByTestId('search-input');
    expect(searchInput).toBeTruthy();

    // Digitar texto para filtrar posts
    fireEvent.changeText(searchInput, 'react');

    // Só o post 1 aparece
    expect(queryByTestId('post-1')).toBeTruthy();
    expect(queryByTestId('post-2')).toBeNull();

    // Cancelar busca
    fireEvent.press(getByTestId('cancel-button'));

    // Input desaparece, volta os dois posts
    expect(queryByTestId('search-input')).toBeNull();
    expect(queryByTestId('post-1')).toBeTruthy();
    expect(queryByTestId('post-2')).toBeTruthy();
  });

  it('navega ao clicar no PostCard', () => {
    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId('post-1'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/screens/private/posts/[id]',
      params: { id: '1' },
    });
  });

  it('navega ao clicar no FAB', () => {
    // Para esse teste funcionar, adicione testID no FAB no seu componente:
    // <FAB testID="fab-button" onPress={() => router.push('/comments')}>

    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId('fab-button'));
    expect(router.push).toHaveBeenCalledWith('/comments');
  });
});
