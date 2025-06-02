import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { usePosts } from '../../../../context/PostsContext';
import { router } from 'expo-router';

import { Container, FAB } from './style';
import PostCard from '../../../../components/PostCard';
import ScreenHeader from '../../../../components/ScreenHeader';
import SearchBar from '../../../../components/SearchBar';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { posts, loading } = usePosts();
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchText.toLowerCase()) ||
    post.description.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <ScreenHeader title="Carregando..." />
      </Container>
    );
  }

  return (
    <Container>
      {searchMode ? (
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onCancel={() => {
            setSearchText('');
            setSearchMode(false);
          }}
        />
      ) : (
        <ScreenHeader
          title="Início"
          iconName="search"
          onIconPress={() => setSearchMode(true)}
        />
      )}

      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => router.push({ pathname: '/screens/private/posts/[id]', params: { id: item.id } })}
          />
        )}
      />

      <FAB testID="fab-button" onPress={() => router.push('/comments')}>
        <Ionicons name="add" size={28} color="#fff" />
      </FAB>

    </Container>
  );
}
