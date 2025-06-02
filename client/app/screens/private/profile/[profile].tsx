import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Container, Header, BackButton, InfoText } from './style';

import { usePosts } from '../../../../context/PostsContext';

import { ProfileHeader } from '../../../../components/ProfileHeader';
import { ProfilePostCard } from '../../../../components/ProfilePostCard';

type PostType = {
  id: string;
  content: string;
  description: string;
};

export default function ProfileScreen() {
  const { name, email, userId } = useLocalSearchParams<{
    name?: string;
    email?: string;
    userId?: string;
  }>();

  const { posts } = usePosts();
  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (!userId) return;

    const FAKE_USER_ID = '0';

    if (userId === FAKE_USER_ID) {
      const filteredPosts = posts.filter(
        (post) => post.userId.toString() === FAKE_USER_ID
      );
      setUserPosts(filteredPosts);
    } else {
      const fetchUserPosts = async () => {
        try {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}/posts`
          );
          const data = await response.json();
          const mappedPosts = data.map((post: any) => ({
            id: post.id.toString(),
            content: post.title,
            description: post.body,
          }));
          setUserPosts(mappedPosts);
        } catch (error) {
          console.error('Erro ao carregar posts do usuário:', error);
          setUserPosts([]);
        }
      };

      fetchUserPosts();
    }
  }, [userId, posts]);

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} />
        </BackButton>
      </Header>

      <ProfileHeader name={name} email={email} />

      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ProfilePostCard name={name} email={email} post={item} />
        )}
        ListEmptyComponent={
          <InfoText style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhuma publicação encontrada.
          </InfoText>
        }
      />
    </Container>
  );
}
