// PostDetails.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PostDetails from './[id]';
import { useLocalSearchParams, router } from 'expo-router';
import { usePosts } from '../../../../context/PostsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock router e hooks
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn(), push: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

jest.mock('../../../../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: 1, name: 'Comentador', email: 'a@email.com', body: 'Comentário da API' }
    ]),
  })
) as jest.Mock;

describe('PostDetails', () => {
  const mockPost = {
    id: '1',
    name: 'Diogo',
    username: '@diogo',
    avatar: 'https://teste.com/avatar.png',
    content: 'Post de exemplo',
    description: 'Descrição do post',
    userId: 1,
  };

  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });

    (usePosts as jest.Mock).mockReturnValue({
      posts: [mockPost],
      loading: false,
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('renderiza corretamente os dados do post', async () => {
    const { getByText, getByPlaceholderText } = render(<PostDetails />);

    await waitFor(() => {
      expect(getByText('Post de exemplo')).toBeTruthy();
      expect(getByText('Descrição do post')).toBeTruthy();
      expect(getByPlaceholderText('Adicione um comentário')).toBeTruthy();
    });
  });

  it('adiciona um comentário local', async () => {
    const { getByText, getByPlaceholderText } = render(<PostDetails />);

    const input = getByPlaceholderText('Adicione um comentário');
    fireEvent.changeText(input, 'Comentário de teste');

    const button = getByText('Enviar');
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Comentário de teste')).toBeTruthy();
    });
  });
});
