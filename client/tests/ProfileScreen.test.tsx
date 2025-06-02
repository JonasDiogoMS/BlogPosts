// tests/ProfileScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// 1) Mock completo de expo-font (loadAsync e isLoaded): 
jest.mock('expo-font', () => ({
  __esModule: true,
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

// 2) Mock do ícone Feather (de '@expo/vector-icons/Feather') ANTES de importar o componente:
jest.mock('@expo/vector-icons/Feather', () => ({
  __esModule: true,
  default: () => null,
}));

// 3) Mock do expo-asset (visto que diversos pacotes do Expo importam internamente):
jest.mock('expo-asset', () => ({
  __esModule: true,
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// 4) Agora mockamos o contexto usePosts (caminho relativo ao teste):
jest.mock('../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// 5) Mock do expo-router (useLocalSearchParams e router.back):
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
  },
}));

// Depois de declarar esses mocks de módulos externos, importamos o componente:
import ProfileScreen from '../app/screens/private/profile/[profile]'; // ajuste se necessário
import { usePosts } from '../context/PostsContext';
import { useLocalSearchParams, router } from 'expo-router';

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 1) Parâmetros vindos de useLocalSearchParams
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      name: 'Usuário Teste',
      email: 'teste@email.com',
      userId: '0',
    });

    // 2) O mock de usePosts para quando userId === '0'
    (usePosts as jest.Mock).mockReturnValue({
      posts: [
        { id: '1', userId: 0, content: 'Título 1', description: 'Descrição 1' },
        { id: '2', userId: 999, content: 'Título 2', description: 'Descrição 2' },
      ],
    });
  });

  it('chama router.back ao clicar no botão de voltar', () => {
    const { getByTestId } = render(<ProfileScreen />);
    const backButton = getByTestId('back-button');

    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });

  it('exibe mensagem quando não há posts', () => {
    // Ajusta o mock de usePosts para retornar lista vazia
    (usePosts as jest.Mock).mockReturnValue({ posts: [] });

    const { getByText } = render(<ProfileScreen />);
    // Como userId='0' e não há posts, exibe texto “Nenhuma publicação encontrada.”
    expect(getByText('Nenhuma publicação encontrada.')).toBeTruthy();
  });

  it('exibe apenas posts do contexto quando userId é "0"', async () => {
    // userId já está em '0' e temos dois posts no mock: userId 0 e userId 999
    const { queryByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(queryByText('Título 1')).toBeTruthy();
      expect(queryByText('Título 2')).toBeFalsy();
    });
  });

  it('exibe corretamente posts filtrados vindo do mock quando userId é "0"', async () => {
    // Ajusta useLocalSearchParams para garantir userId='0'
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      name: 'Outro Usuário',
      email: 'outro@email.com',
      userId: '0',
    });
    // Ajusta usePosts para novos dados
    (usePosts as jest.Mock).mockReturnValue({
      posts: [
        { id: '10', userId: 0, content: 'Título Contexto 1', description: 'Descrição Contexto 1' },
        { id: '20', userId: 999, content: 'Título Contexto 2', description: 'Descrição Contexto 2' },
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
