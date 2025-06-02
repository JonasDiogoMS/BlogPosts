import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FavoritesScreen from '../app/screens/private/favorites';
import { usePosts } from '../context/PostsContext';
import { router } from 'expo-router';

// Mock do usePosts para controlar posts, favoritos e loading
jest.mock('../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// Mock do router.push para capturar navegações
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock do PostCard usando React Native components e testID
jest.mock('../components/PostCard', () => {
    const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ post, onPress }: { post: any; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} testID={`post-${post.id}`}>
      <Text>{post.content}</Text>
    </TouchableOpacity>
  );
});

// Mock do ScreenHeader usando React Native components e testID
jest.mock('../components/ScreenHeader', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
  return ({ title, iconName, onIconPress }: any) => (
    <>
      <Text>{title}</Text>
      {iconName && (
        <TouchableOpacity onPress={onIconPress} testID="header-icon">
          <Text>{iconName}</Text>
        </TouchableOpacity>
      )}
    </>
  );
});

// Mock do Ionicons (retorna null, pois só é ícone)
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('FavoritesScreen', () => {
  const mockPosts = [
    { id: '1', content: 'Post 1', description: 'Desc 1' },
    { id: '2', content: 'Post 2', description: 'Desc 2' },
  ];

  beforeEach(() => {
    (usePosts as jest.Mock).mockClear();
    (router.push as jest.Mock).mockClear();
  });

  it('exibe loading quando loading é true', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: [],
      favorites: [],
      loading: true,
    });

    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('exibe mensagem quando não há favoritos', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: mockPosts,
      favorites: [],
      loading: false,
    });

    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('Nenhum favorito encontrado.')).toBeTruthy();
  });

  it('renderiza posts favoritos corretamente', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: mockPosts,
      favorites: ['2'],
      loading: false,
    });

    const { queryByTestId, queryByText } = render(<FavoritesScreen />);
    expect(queryByTestId('post-2')).toBeTruthy();
    expect(queryByTestId('post-1')).toBeNull(); // post 1 não é favorito
    expect(queryByText('Post 2')).toBeTruthy();
  });

  it('navega ao clicar em um post favorito', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: mockPosts,
      favorites: ['1'],
      loading: false,
    });

    const { getByTestId } = render(<FavoritesScreen />);
    fireEvent.press(getByTestId('post-1'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/screens/private/posts/[id]',
      params: { id: '1' },
    });
  });

  it('navega ao clicar no FAB', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: mockPosts,
      favorites: ['1'],
      loading: false,
    });

    const { getByTestId } = render(<FavoritesScreen />);
    fireEvent.press(getByTestId('fab-button'));
    expect(router.push).toHaveBeenCalledWith('/comments');
  });
});
