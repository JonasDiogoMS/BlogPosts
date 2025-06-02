import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  PostCard as PostCardStyle,
  PostHeader,
  Avatar,
  PostUsername,
  PostTitle,
  PostBody,
} from './styles';

type PostCardProps = {
  name?: string;
  email?: string;
  post: {
    id: string;
    content: string;
    description: string;
  };
  onPress?: () => void;
};

export function ProfilePostCard({ name, email, post, onPress }: PostCardProps) {
  return (
    <PostCardStyle onPress={onPress}>
      <PostHeader>
        <Avatar
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name || 'Usuário'
            )}&size=150&background=random`,
          }}
          style={{ width: 40, height: 40 }}
        />
        <PostUsername>
          {name || 'Usuário'}
          {'\n'}@{email?.split('@')[0] || 'usuario'}
        </PostUsername>
        <Feather name="star" size={20} style={{ marginLeft: 'auto' }} />
      </PostHeader>
      <PostTitle>{post.content}</PostTitle>
      <PostBody>{post.description}</PostBody>
    </PostCardStyle>
  );
}
