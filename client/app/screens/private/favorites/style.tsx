import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const FAB = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 70px;
  background-color: #007aff;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  elevation: 3;
`;
