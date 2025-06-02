// tests/PostDetails.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// 1) Mock completo de expo-font (loadAsync e isLoaded)
jest.mock('expo-font', () => ({
  __esModule: true,
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

// 2) Mock do Ionicons (e de quaisquer outros ícones do @expo/vector-icons) ANTES de importar o componente:
jest.mock('@expo/vector-icons/Ionicons', () => ({
  __esModule: true,
  default: () => null,
}));

// 3) Mock do expo-asset (muitos pacotes do Expo importam internamente expo-asset)
jest.mock('expo-asset', () => ({
  __esModule: true,
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// 4) Mock do AsyncStorage (PostDetails usa @react-native-async-storage/async-storage)
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

// 5) Mock do expo-router (useLocalSearchParams e router.back/push)
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
}));

// 6) Mock do contexto usePosts
jest.mock('../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// Mock de Alert.alert para capturar chamadas de alerta. Se houver botões, chama o onPress do “Excluir” automaticamente.
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (Array.isArray(buttons) && buttons[1] && typeof buttons[1].onPress === 'function') {
    buttons[1].onPress!();
  }
});

// Agora que todos os mocks acima estão declarados, importamos o componente:
import PostDetails from '../app/screens/private/posts/[id]';
import { useLocalSearchParams, router } from 'expo-router';
import { usePosts } from '../context/PostsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock global.fetch para retornar um comentário “da API”
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        // Comentário vindo da API
        { id: 1, name: 'Comentador', email: 'a@email.com', body: 'Comentário da API' },
      ]),
  })
) as jest.Mock;

describe('PostDetails', () => {
  const fixedId = 1234567890000; // ID fixo para comentários locais
  const mockPost = {
    id: '1',
    name: 'Diogo',
    username: '@diogo',
    avatar: 'https://teste.com/avatar.png',
    content: 'Post de exemplo',
    description: 'Descrição do post',
    userId: 1,
  };

  beforeAll(() => {
    // “Congela” Date.now() para sempre retornar `fixedId`
    jest.spyOn(Date, 'now').mockReturnValue(fixedId);
  });

  afterAll(() => {
    // Restaura Date.now original
    (Date.now as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    // 1) useLocalSearchParams retorna { id: '1' }
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });

    // 2) usePosts retorna o post desejado e loading=false
    (usePosts as jest.Mock).mockReturnValue({
      posts: [mockPost],
      favorites: [],
      toggleFavorite: jest.fn(),
      addPost: jest.fn(),
      addComment: jest.fn(),
      loading: false,
    });

    // 3) AsyncStorage.getItem resolve null (sem comentários locais inicialmente)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    // Limpa chamadas anteriores de router.push e Alert.alert
    (router.push as jest.Mock).mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('renderiza corretamente os dados do post e o campo de comentário', async () => {
    const { getByText, getByPlaceholderText } = render(<PostDetails />);

    // Espera que o comentário vindo da API seja carregado, antes de qualquer asserção
    await waitFor(() => {
      expect(getByText('Comentário da API')).toBeTruthy();
    });

    // Agora confere título, descrição e input
    expect(getByText('Post de exemplo')).toBeTruthy();
    expect(getByText('Descrição do post')).toBeTruthy();
    expect(getByPlaceholderText('Adicione um comentário')).toBeTruthy();
  });

  it('exibe alerta se tentar enviar comentário vazio', async () => {
    const { getByText } = render(<PostDetails />);

    // Aguarda comentário da API aparecer (para estabilizar o componente)
    await waitFor(() => {
      expect(getByText('Comentário da API')).toBeTruthy();
    });

    // Pressiona “Enviar” sem digitar texto
    fireEvent.press(getByText('Enviar'));

    // Deve ter sido chamado Alert.alert com título e mensagem corretos
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'O comentário não pode estar vazio.');
  });

  it('adiciona um comentário local, exibe e depois exclui ao clicar no trash', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId } = render(<PostDetails />);

    // 1) Aguarda o comentário da API aparecer
    await waitFor(() => {
      expect(getByText('Comentário da API')).toBeTruthy();
    });

    // 2) Digita um comentário novo
    const input = getByPlaceholderText('Adicione um comentário');
    fireEvent.changeText(input, 'Comentário de teste');

    // 3) Pressiona botão “Enviar”
    fireEvent.press(getByText('Enviar'));

    // 4) Aguarda o novo comentário local aparecer na lista
    await waitFor(() => {
      expect(getByText('Comentário de teste')).toBeTruthy();
    });

    // 5) Agora que ele apareceu, deve haver um DeleteButton com testID="delete-button-1234567890000"
    const deleteButton = getByTestId(`delete-button-${fixedId}`);
    fireEvent.press(deleteButton);

    // 6) Após confirmar a exclusão no Alert, o comentário local deve desaparecer
    await waitFor(() => {
      expect(queryByText('Comentário de teste')).toBeNull();
    });
  });

  it('navega para perfil ao clicar no nome de usuário de um comentário da API', async () => {
    const { getByText } = render(<PostDetails />);

    // Aguarda renderização inicial dos comentários da API
    await waitFor(() => {
      expect(getByText('Comentário da API')).toBeTruthy();
    });

    // Clica no texto do nome “Comentador”
    fireEvent.press(getByText('Comentador'));

    // Espera que router.push tenha sido chamado com os parâmetros corretos
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/profile',
      params: {
        name: 'Comentador',
        email: 'a@email.com',
        userId: mockPost.userId.toString(),
      },
    });
  });
});
