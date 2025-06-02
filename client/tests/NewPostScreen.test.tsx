// tests/NewPostScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// ** IMPORTANTE: antes de importar o componente, faça o mock de todos os ícones que vêm de '@expo/vector-icons' **
jest.mock('@expo/vector-icons/AntDesign', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@expo/vector-icons/Feather', () => ({
  __esModule: true,
  default: () => null,
}));

// Em seguida, importe normalmente:
import NewPostScreen from '../app/screens/private/comments'; // ajuste o caminho conforme seu projeto
import { usePosts } from '../context/PostsContext';
import { router } from 'expo-router';

// Mock do usePosts
jest.mock('../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// Mock do router.back
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock de Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('NewPostScreen', () => {
  const mockAddPost = jest.fn();

  beforeEach(() => {
    // Configura usePosts para retornar apenas o addPost e as outras props não usadas
    (usePosts as jest.Mock).mockReturnValue({
      posts: [],
      favorites: [],
      toggleFavorite: jest.fn(),
      addPost: mockAddPost,
      addComment: jest.fn(),
      loading: false,
    });

    (router.back as jest.Mock).mockClear();
    mockAddPost.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('renderiza os campos corretamente', () => {
    const { getByPlaceholderText } = render(<NewPostScreen />);
    expect(getByPlaceholderText('Adicione um título')).toBeTruthy();
    expect(
      getByPlaceholderText('O que gostaria de compartilhar?')
    ).toBeTruthy();
  });

  it('atualiza o texto dos inputs', () => {
    const { getByPlaceholderText } = render(<NewPostScreen />);
    const titleInput = getByPlaceholderText('Adicione um título');
    const descInput = getByPlaceholderText(
      'O que gostaria de compartilhar?'
    );

    fireEvent.changeText(titleInput, 'Meu título');
    fireEvent.changeText(descInput, 'Minha descrição');

    expect(titleInput.props.value).toBe('Meu título');
    expect(descInput.props.value).toBe('Minha descrição');
  });

  it('exibe alerta se título ou descrição estiverem vazios', () => {
    const { getByText, getByPlaceholderText } = render(<NewPostScreen />);
    const publishButton = getByText('Publicar');

    // Título e descrição vazios
    fireEvent.press(publishButton);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Preencha o título e a descrição!'
    );

    // Só título preenchido
    fireEvent.changeText(getByPlaceholderText('Adicione um título'), 'Título');
    fireEvent.press(publishButton);
    expect(Alert.alert).toHaveBeenCalledTimes(2);

    // Só descrição preenchida
    fireEvent.changeText(getByPlaceholderText('Adicione um título'), '');
    fireEvent.changeText(
      getByPlaceholderText('O que gostaria de compartilhar?'),
      'Descrição'
    );
    fireEvent.press(publishButton);
    expect(Alert.alert).toHaveBeenCalledTimes(3);
  });

  it('chama addPost e navega ao publicar', async () => {
    const { getByPlaceholderText, getByText } = render(<NewPostScreen />);
    fireEvent.changeText(getByPlaceholderText('Adicione um título'), 'Título');
    fireEvent.changeText(
      getByPlaceholderText('O que gostaria de compartilhar?'),
      'Descrição'
    );

    fireEvent.press(getByText('Publicar'));

    await waitFor(() => {
      expect(mockAddPost).toHaveBeenCalledWith('Título', 'Descrição');
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('navega ao clicar no botão de fechar', () => {
    // No seu componente, o BackButton deve ter testID="back-button"
    const { getByTestId } = render(<NewPostScreen />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });
});
