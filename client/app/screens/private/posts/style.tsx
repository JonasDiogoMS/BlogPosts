import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 16px;
`;


export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 8px;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;

export const Username = styled.Text`
  font-size: 14px;
  color: #555;
  margin-left: 4px;
`;

export const PostTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const CommentCard = styled.View`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

export const CommentUser = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
  padding-right: 40px;
`;

export const CommentAvatar = styled(Avatar)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 8px;
`;

export const CommentText = styled.Text`
  color: #333;
  padding: 5px 10px;
`;

export const CommentInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: auto;
  border-top-width: 1px;
  border-color: #eee;
  padding-top: 8px;
  margin-bottom: 30px;
`;

export const CommentInput = styled.TextInput`
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 8px 12px;
  margin-right: 8px;
`;

export const AddCommentButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 8px 12px;
  border-radius: 20px;
`;

export const AddCommentText = styled.Text`
  color: white;
  font-weight: bold;
`;

export const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
`;
