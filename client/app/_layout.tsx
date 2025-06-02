import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from 'styled-components/native';
import { DefaultTheme } from 'styled-components';
import { PostsProvider } from '@/context/PostsContext';
import { store } from '../store/store';
import { Provider } from 'react-redux';

const defaultTheme: DefaultTheme = {
  colors: {
    primary: '#008cff',
    background: '#ffffff',
    text: '#333',
  },
};

export default function RootLayout() {

  return (
    <Provider store={store}>
      <PostsProvider>
      <ThemeProvider theme={defaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='login'/>
          <Stack.Screen name='register'/>
          <Stack.Screen name='home'/>
          <Stack.Screen name='favorite'/>
          <Stack.Screen name='comments'/>
          <Stack.Screen name='posts'/>
          <Stack.Screen name='profile'/>
        </Stack>
      </ThemeProvider>
    </PostsProvider>
    </Provider>
  );
}

