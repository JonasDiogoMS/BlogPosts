import React, { useEffect, useState } from 'react';
import { FlatList, Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { usePosts } from '../../../../context/PostsContext';

import {
  Container,
  Header,
  BackButton,
  UserInfo,
  Avatar,
  Name,
  Username,
  PostTitle,
  Description,
  SectionTitle,
  CommentCard,
  CommentText,
  CommentUser,
  CommentAvatar,
  DeleteButton,
  CommentInputContainer,
  CommentInput,
  AddCommentButton,
  AddCommentText
} from './style';

type CommentType = {
  id: number;
  name: string;
  email: string;
  body: string;
};

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, loading } = usePosts();

  const post = posts.find(p => p.id === id);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

  const storageKey = `comments_post_${id}`;

  useEffect(() => {
    const loadComments = async () => {
      try {
        // Busca comentários da API
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
        const apiComments: CommentType[] = await response.json();

        // Busca comentários locais no AsyncStorage
        const storedComments = await AsyncStorage.getItem(storageKey);
        const localComments: CommentType[] = storedComments ? JSON.parse(storedComments) : [];

        // Combina os dois
        setComments([...apiComments, ...localComments]);
      } catch (error) {
        console.error('Erro ao carregar comentários:', error);
      }
    };

    loadComments();
  }, [id]);

  const saveComments = async (commentsToSave: CommentType[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(commentsToSave));
    } catch (error) {
      console.error('Erro ao salvar comentários:', error);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') {
      Alert.alert('Erro', 'O comentário não pode estar vazio.');
      return;
    }

    const newCommentObj: CommentType = {
      id: Date.now(),
      name: 'Jonas Diogo',
      email: 'jonasdiogo@email.com',
      body: newComment,
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);

    const localOnly = updatedComments.filter(c => c.id >= 1e12);
    saveComments(localOnly);

    setNewComment('');
  };

  const handleDeleteComment = (commentId: number) => {
    Alert.alert('Excluir comentário', 'Tem certeza que deseja excluir este comentário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const updatedComments = comments.filter(c => c.id !== commentId);
          setComments(updatedComments);

          const localOnly = updatedComments.filter(c => c.id >= 1e12);
          saveComments(localOnly);
        },
      },
    ]);
  };

  if (loading || !post) {
    return (
      <Container>
        <PostTitle>Carregando postagem...</PostTitle>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton testID="back-button" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </BackButton>
      </Header>

      <UserInfo>
        <Avatar source={{ uri: post.avatar }} />
        <Name>{post.name}</Name>
        <Username>{post.username}</Username>
      </UserInfo>

      <PostTitle>{post.content}</PostTitle>
      <Description>{post.description}</Description>

      <SectionTitle>Comentários</SectionTitle>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=50&background=random`;
        const isLocalComment = item.id >= 1e12;

        return (
          <CommentCard>
            <CommentUser 
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
            onPress={() => router.push({ 
            pathname: '/profile', 
            params: { 
              name: item.name, 
              email: item.email, 
              userId: isLocalComment ? '0' : post.userId.toString()
            } 
          })}
          >
            <CommentAvatar source={{ uri: avatarUrl }} />
            <Name style={{ fontSize: 14 }}>{item.name}</Name>
          </CommentUser>

            <CommentText>{item.body}</CommentText>
            {isLocalComment && (
              <DeleteButton
                testID={`delete-button-${item.id}`}
                onPress={() => handleDeleteComment(item.id)}
              >
                <Ionicons name="trash" size={20} color="red" />
              </DeleteButton>
            )}
          </CommentCard>
        );
      }}

        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<CommentText>Nenhum comentário ainda.</CommentText>}
      />

      <CommentInputContainer>
        <CommentInput
          placeholder="Adicione um comentário"
          placeholderTextColor="#999"
          value={newComment}
          onChangeText={setNewComment}
        />
        <AddCommentButton onPress={handleAddComment}>
          <AddCommentText>Enviar</AddCommentText>
        </AddCommentButton>
      </CommentInputContainer>
    </Container>
  );
}
