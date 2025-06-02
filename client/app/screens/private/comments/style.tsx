import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-left: 12px;
`;

export const Title = styled.TextInput`
  border: 1px solid #eee;
  background-color: #f4f6f8;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 16px;
`;

export const TextArea = styled.TextInput`
  flex: 1;
  border: 1px solid #eee;
  background-color: #f4f6f8;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 24px;
`;

export const PublishButton = styled.TouchableOpacity`
  background-color: #0094ff;
  padding: 14px;
  align-items: center;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const PublishText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
