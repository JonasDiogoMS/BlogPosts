import React from 'react';
import { Container } from './style';
import { useRouter, Link } from 'expo-router';
import { InputField } from '../../../../components/InputField';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { TitleText } from '../../../../components/TitleText';
import { TouchableOpacity } from 'react-native';
import { LinkText } from './style';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <Container>
      <TitleText text="LOGIN" />
      <InputField label="E-mail" placeholder="Endereço de e-mail" />
      <InputField label="Senha" placeholder="Senha" secureTextEntry />

      <PrimaryButton text="Entrar" onPress={() => router.push('/home')} />

      <TouchableOpacity>
        <LinkText>
          <Link href="/register">Criar nova conta</Link>
        </LinkText>
      </TouchableOpacity>
    </Container>
  );
}
