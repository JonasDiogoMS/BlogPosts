import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { usePosts, PostType } from '../../../../context/PostsContext';
import { router } from 'expo-router';
import { Container, FAB } from './style';
import PostCard from '../../../../components/PostCard';
import ScreenHeader from '../../../../components/ScreenHeader';
import SearchBar from '../../../../components/SearchBar';
import { Ionicons } from '@expo/vector-icons';

const POSTS_PER_PAGE = 10;

// Função para normalizar texto (remove acentos e converte para minúsculas)
function normalizeText(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function HomeScreen() {
  const { posts, loading } = usePosts();
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Estado para paginação
  const [page, setPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState<PostType[]>([]);

  // Filtra os posts pelo texto de busca com normalização para busca mais abrangente
  const filteredPosts = posts.filter(post => {
    const normalizedContent = normalizeText(post.content);
    const normalizedDescription = normalizeText(post.description);
    const normalizedSearch = normalizeText(searchText);

    return (
      normalizedContent.includes(normalizedSearch) ||
      normalizedDescription.includes(normalizedSearch)
    );
  });

  // Quando mudar o filtro de busca, resetar paginação
  useEffect(() => {
    setPage(1);
    setDisplayedPosts(filteredPosts.slice(0, POSTS_PER_PAGE));
  }, [searchText, posts]);

  // Carregar mais posts quando a página aumentar
  useEffect(() => {
    if (page === 1) return;

    const nextPosts = filteredPosts.slice(0, page * POSTS_PER_PAGE);
    setDisplayedPosts(nextPosts);
  }, [page]);

  // Função para carregar próxima página ao chegar no fim da lista
  const loadMorePosts = () => {
    if (displayedPosts.length < filteredPosts.length) {
      setPage(prev => prev + 1);
    }
  };

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
        data={displayedPosts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() =>
              router.push({ pathname: '/screens/private/posts/[id]', params: { id: item.id } })
            }
          />
        )}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
      />

      <FAB testID="fab-button" onPress={() => router.push('/comments')}>
        <Ionicons name="add" size={28} color="#fff" />
      </FAB>
    </Container>
  );
}
