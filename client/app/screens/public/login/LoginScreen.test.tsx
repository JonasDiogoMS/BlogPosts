import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from './index';
import { useRouter } from 'expo-router';

// Mock do expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children, href }: any) => <>{children}</>, // Simplificando o Link
}));

describe('LoginScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('renderiza os campos e botão corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Endereço de e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Criar nova conta')).toBeTruthy();
  });

  it('navega para /home ao clicar no botão Entrar', () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Entrar'));
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('exibe o link para criar nova conta', () => {
    const { getByText } = render(<LoginScreen />);

    // O link está dentro de um TouchableOpacity, o texto está visível
    expect(getByText('Criar nova conta')).toBeTruthy();
  });
});
