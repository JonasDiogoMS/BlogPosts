import React from 'react';
import { FlatList } from 'react-native';
import { usePosts } from '../../../../context/PostsContext';
import { router } from 'expo-router';

import { Container, FAB } from './style';
import PostCard from '../../../../components/PostCard';
import ScreenHeader from '../../../../components/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { posts, favorites, loading } = usePosts();

  const favoritePosts = posts.filter(post => favorites.includes(post.id));

  if (loading) {
    return (
      <Container>
        <ScreenHeader title="Carregando..." />
      </Container>
    );
  }

  return (
    <Container>
      <ScreenHeader
        title="Favoritos"
        iconName="star"
        onIconPress={() => {}}
      />

      {favoritePosts.length === 0 ? (
        <ScreenHeader title="Nenhum favorito encontrado." />
      ) : (
        <FlatList
          data={favoritePosts}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => router.push({ pathname: '/screens/private/posts/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}

      <FAB testID="fab-button" onPress={() => router.push('/comments')}>
        <Ionicons name="add" size={28} color="#fff" />
      </FAB>

    </Container>
  );
}
