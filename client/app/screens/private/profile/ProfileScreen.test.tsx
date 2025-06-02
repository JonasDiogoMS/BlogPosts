import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from './[profile]'; // ajuste o caminho se necessário
import { usePosts } from '../../../../context/PostsContext';
import { router, useLocalSearchParams } from 'expo-router';

// Mock dos ícones Feather
jest.mock('@expo/vector-icons', () => ({
  Feather: () => null,
}));

// Mock do contexto de posts
jest.mock('../../../../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// Mock do router e dos parâmetros
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      name: 'Usuário Teste',
      email: 'teste@email.com',
      userId: '0',
    });

    (usePosts as jest.Mock).mockReturnValue({
      posts: [
        { id: '1', userId: '0', content: 'Título 1', description: 'Descrição 1' },
        { id: '2', userId: '999', content: 'Título 2', description: 'Descrição 2' },
      ],
    });
  });

  it('renderiza o componente e chama router.back ao clicar no botão', () => {
    const { getByTestId } = render(<ProfileScreen />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });

  it('exibe mensagem quando não há posts', () => {
    (usePosts as jest.Mock).mockReturnValue({ posts: [] });
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Nenhuma publicação encontrada.')).toBeTruthy();
  });

  it('exibe posts do contexto quando userId é 0', async () => {
    const { queryByText } = render(<ProfileScreen />);
    await waitFor(() => {
      expect(queryByText('Título 1')).toBeTruthy();
      expect(queryByText('Título 2')).toBeFalsy(); // userId diferente
    });
  });

  it('exibe posts filtrados do contexto quando userId é 0', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      name: 'Usuário Teste',
      email: 'teste@email.com',
      userId: '0',
    });

    (usePosts as jest.Mock).mockReturnValue({
      posts: [
        { id: '1', userId: '0', content: 'Título Contexto 1', description: 'Descrição Contexto 1' },
        { id: '2', userId: '999', content: 'Título Contexto 2', description: 'Descrição Contexto 2' },
      ],
    });

    const { queryByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(queryByText('Título Contexto 1')).toBeTruthy();
      expect(queryByText('Descrição Contexto 1')).toBeTruthy();
      expect(queryByText('Título Contexto 2')).toBeFalsy();
      expect(queryByText('Descrição Contexto 2')).toBeFalsy();
    });
  });
});
