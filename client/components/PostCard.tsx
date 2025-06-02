import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { usePosts } from '../context/PostsContext';
import styled from 'styled-components/native';

interface PostCardProps {
  post: {
    id: string;
    avatar: string;
    name: string;
    username: string;
    content: string;
    description: string;
  };
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  const { favorites, toggleFavorite } = usePosts();

  return (
    <Card onPress={onPress}>
      <CardHeader>
        <Avatar source={{ uri: post.avatar }} />
        <UserInfo>
          <Name>{post.name}</Name>
          <Username>{post.username}</Username>
        </UserInfo>
        <StarIcon onPress={() => toggleFavorite(post.id)}>
          <Ionicons
            name={favorites.includes(post.id) ? 'star' : 'star-outline'}
            size={20}
            color={favorites.includes(post.id) ? '#f4c542' : '#999'}
          />
        </StarIcon>
      </CardHeader>
      <ContentText>{post.content}</ContentText>
      <Description>{post.description}</Description>
    </Card>
  );
}

const Card = styled.TouchableOpacity`
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 10px;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  font-weight: bold;
`;

const Username = styled.Text`
  color: #555;
  font-size: 12px;
`;

const StarIcon = styled.TouchableOpacity``;

const ContentText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
`;

const Description = styled.Text`
  color: #666;
  font-size: 13px;
`;
