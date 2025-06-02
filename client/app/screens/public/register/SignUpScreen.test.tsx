import React from 'react';
import { render } from '@testing-library/react-native';
import SignUpScreen from './index';

describe('SignUpScreen', () => {
  it('renderiza os campos e o botão corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    expect(getByPlaceholderText('Nome de usuário')).toBeTruthy();
    expect(getByPlaceholderText('Endereço de e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Adicione uma senha')).toBeTruthy();

    expect(getByText('Criar conta')).toBeTruthy();
  });
});
