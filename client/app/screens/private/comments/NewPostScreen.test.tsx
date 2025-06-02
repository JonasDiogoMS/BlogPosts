import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewPostScreen from './index';
import { usePosts } from '../../../../context/PostsContext';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// Mock do usePosts
jest.mock('../../../../context/PostsContext', () => ({
  usePosts: jest.fn(),
}));

// Mock do router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock do Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('NewPostScreen', () => {
  const mockAddPost = jest.fn();

  beforeEach(() => {
    (usePosts as jest.Mock).mockReturnValue({
      addPost: mockAddPost,
    });
    (router.back as jest.Mock).mockClear();
    mockAddPost.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('renderiza os campos corretamente', () => {
    const { getByPlaceholderText } = render(<NewPostScreen />);

    expect(getByPlaceholderText('Adicione um título')).toBeTruthy();
    expect(getByPlaceholderText('O que gostaria de compartilhar?')).toBeTruthy();
  });

  it('atualiza o texto dos inputs', () => {
    const { getByPlaceholderText } = render(<NewPostScreen />);
    const titleInput = getByPlaceholderText('Adicione um título');
    const descInput = getByPlaceholderText('O que gostaria de compartilhar?');

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
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Preencha o título e a descrição!');

    // Só título preenchido
    fireEvent.changeText(getByPlaceholderText('Adicione um título'), 'Título');
    fireEvent.press(publishButton);
    expect(Alert.alert).toHaveBeenCalledTimes(2);

    // Só descrição preenchida
    fireEvent.changeText(getByPlaceholderText('Adicione um título'), '');
    fireEvent.changeText(getByPlaceholderText('O que gostaria de compartilhar?'), 'Descrição');
    fireEvent.press(publishButton);
    expect(Alert.alert).toHaveBeenCalledTimes(3);
  });

  it('chama addPost e navega ao publicar', async () => {
    const { getByPlaceholderText, getByText } = render(<NewPostScreen />);

    fireEvent.changeText(getByPlaceholderText('Adicione um título'), 'Título');
    fireEvent.changeText(getByPlaceholderText('O que gostaria de compartilhar?'), 'Descrição');

    fireEvent.press(getByText('Publicar'));

    await waitFor(() => {
      expect(mockAddPost).toHaveBeenCalledWith('Título', 'Descrição');
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('navega ao clicar no botão de fechar', () => {
    // Para esse teste funcionar, adicione um testID no botão BackButton no seu componente:
    //
    // <BackButton testID="back-button" onPress={() => router.back()}>
    //   <AntDesign name="close" size={24} color="black" />
    // </BackButton>

    const { getByTestId } = render(<NewPostScreen />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });
});
