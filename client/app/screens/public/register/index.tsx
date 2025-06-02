import React from 'react';
import { Container } from './style';
import { InputField } from '../../../../components/InputField';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { TitleText } from '../../../../components/TitleText';

export default function SignUpScreen() {
  return (
    <Container>
      <TitleText text="CADASTRO" />

      <InputField label="Nome de usuário" placeholder="Nome de usuário" />
      <InputField label="E-mail" placeholder="Endereço de e-mail" keyboardType="email-address" />
      <InputField label="Senha" placeholder="Adicione uma senha" secureTextEntry />

      <PrimaryButton text="Criar conta" />
    </Container>
  );
}
