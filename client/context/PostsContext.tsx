import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../../client/store/store';

type CommentType = {
  id: string;
  name: string;
  body: string;
};

export type PostType = {
  userId: number;
  email: string;
  id: string;
  name: string;
  username: string;
  avatar: string;
  content: string;
  description: string;
  comments: CommentType[];
};

type PostsContextType = {
  posts: PostType[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addPost: (title: string, description: string) => void;
  addComment: (postId: string, commentBody: string) => void;
  loading: boolean;
};

const PostsContext = createContext<PostsContextType>({} as PostsContextType);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const POSTS_STORAGE_KEY = 'custom_posts';
  const FAVORITES_STORAGE_KEY = 'favorite_posts';

  const fakeUser = useSelector((state: RootState) => state.fakeUser);


  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  };

  const loadCustomPosts = async () => {
    try {
      const storedCustomPosts = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      return storedCustomPosts ? JSON.parse(storedCustomPosts) : [];
    } catch (error) {
      console.error('Erro ao carregar posts personalizados:', error);
      return [];
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users'),
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/comments')
      ]);

      const users = await usersRes.json();
      const postsData = await postsRes.json();
      const comments = await commentsRes.json();

      const enrichedPosts = postsData.map((post: any) => {
        const user = users.find((u: any) => u.id === post.userId);
        const postComments = comments
          .filter((comment: any) => comment.postId === post.id)
          .map((comment: any) => ({
            id: comment.id.toString(),
            name: comment.name,
            body: comment.body
          }));

        return {
          id: post.id.toString(),
          name: user?.name ?? 'Unknown',
          username: `@${user?.username?.toLowerCase() ?? 'unknown'}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'Unknown')}&size=150&background=random`,
          content: post.title,
          description: post.body,
          comments: postComments,
          userId: post.userId,
          email: user?.email ?? ''
        };
      });

      const customPosts = await loadCustomPosts();
      setPosts([...customPosts, ...enrichedPosts]);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    fetchAllData();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const addPost = async (title: string, description: string) => {
    const newPost: PostType = {
    id: Date.now().toString(),
    name: fakeUser.name,
    username: fakeUser.username,
    avatar: fakeUser.avatar,
    content: title,
    description,
    comments: [],
    userId: fakeUser.userId,
    email: '',
  };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    try {
      const existing = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      const existingPosts = existing ? JSON.parse(existing) : [];
      const newStoredPosts = [newPost, ...existingPosts];
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newStoredPosts));
    } catch (error) {
      console.error('Erro ao salvar post personalizado:', error);
    }
  };

  const addComment = async (postId: string, commentBody: string) => {
  const newComment = {
    id: Date.now().toString(),
    name: fakeUser.name,
    body: commentBody
  };

  const updatedPosts = posts.map(post =>
    post.id === postId
      ? {
          ...post,
          comments: [...(post.comments ?? []), newComment]
        }
      : post
  );

  setPosts(updatedPosts);

  // Atualiza os posts personalizados no AsyncStorage
  try {
    const existing = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
    const existingPosts = existing ? JSON.parse(existing) : [];

    const updatedCustomPosts = existingPosts.map((post: PostType) =>
      post.id === postId
        ? {
            ...post,
            comments: [...(post.comments ?? []), newComment]
          }
        : post
    );

    await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedCustomPosts));
  } catch (error) {
    console.error('Erro ao salvar comentário personalizado:', error);
  }
};


  return (
    <PostsContext.Provider
      value={{ posts, favorites, toggleFavorite, addPost, addComment, loading }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
