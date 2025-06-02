import React from 'react';
import { render } from '@testing-library/react-native';
import SignUpScreen from '../app/screens/public/register'; // ajuste o caminho conforme sua estrutura

describe('SignUpScreen', () => {
  it('renderiza título, inputs e botão de cadastro corretamente', () => {
    const { getByText, getByTestId } = render(<SignUpScreen />);

    // Verifica título
    expect(getByText('CADASTRO')).toBeTruthy();

    // Verifica inputs usando testID
    expect(getByTestId('input-username')).toBeTruthy();
    expect(getByTestId('input-email')).toBeTruthy();
    expect(getByTestId('input-password')).toBeTruthy();

    // Verifica botão
    expect(getByText('Criar conta')).toBeTruthy();
  });
});
