import React, { useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import {
  Container,
  Header,
  Title,
  TextArea,
  PublishButton,
  PublishText,
  BackButton,
  HeaderTitle
} from './style';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';

import { usePosts } from '../../../../context/PostsContext';

const NewPostScreen = () => {
  const { addPost } = usePosts();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handlePublish = () => {
    if (title.trim() === '' || description.trim() === '') {
      Alert.alert('Erro', 'Preencha o título e a descrição!');
      return;
    }

    addPost(title, description);
    router.back();
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      <Header>
        <BackButton onPress={() => router.back()}>
          <AntDesign name="close" size={24} color="black" />
        </BackButton>
        <HeaderTitle>Nova publicação</HeaderTitle>
      </Header>

      <Title
        placeholder="Adicione um título"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />

      <TextArea
        placeholder="O que gostaria de compartilhar?"
        placeholderTextColor="#ccc"
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <PublishButton onPress={handlePublish}>
        <Feather name="send" size={15} color="#fff" />
        <PublishText>Publicar</PublishText>
      </PublishButton>
    </Container>
  );
};

export default NewPostScreen;
