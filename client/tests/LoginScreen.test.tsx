import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../app/screens/public/login'; // ajuste o caminho se necessário
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => {
  return {
    useRouter: jest.fn(),
    Link: ({ href, children }: any) => <>{children}</>, // mocka o Link como texto
  };
});

describe('LoginScreen', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renderiza os campos de entrada e botão', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText('LOGIN')).toBeTruthy();
    expect(getByPlaceholderText('Endereço de e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Criar nova conta')).toBeTruthy();
  });

  it('navega para /home ao pressionar o botão Entrar', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Entrar'));

    expect(pushMock).toHaveBeenCalledWith('/home');
  });

  it('renderiza o link para criar nova conta', () => {
    const { getByText } = render(<LoginScreen />);
    const link = getByText('Criar nova conta');
    expect(link).toBeTruthy();
  });
});
