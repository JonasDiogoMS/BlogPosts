import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  ProfileInfo,
  Avatar,
  Name,
  Username,
  InfoRow,
  IconText,
  InfoText,
} from './styles';

type ProfileHeaderProps = {
  name?: string;
  email?: string;
};

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  return (
    <ProfileInfo>
      <Avatar
        source={{
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name || 'Usuário'
          )}&size=150&background=random`,
        }}
      />
      <Name>{name || 'Usuário Desconhecido'}</Name>
      <Username>{email ? `@${email.split('@')[0]}` : '@usuario'}</Username>

      <InfoRow>
        <IconText>
          <Feather name="mail" size={16} />
          <InfoText>{email || 'email@desconhecido.com'}</InfoText>
        </IconText>
        <IconText>
          <Feather name="map-pin" size={16} />
          <InfoText>Rua lorem ipsum, Fortaleza-CE</InfoText>
        </IconText>
        <IconText>
          <Feather name="briefcase" size={16} />
          <InfoText>Lorem Ipsum Dolor</InfoText>
        </IconText>
        <IconText>
          <Feather name="phone" size={16} />
          <InfoText>(85) 9 9999-9999</InfoText>
        </IconText>
      </InfoRow>
    </ProfileInfo>
  );
}
