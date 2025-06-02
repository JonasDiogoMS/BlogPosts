module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    // Ignora tudo, exceto os pacotes abaixo (que são ESM e precisam ser transformados)
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@expo|expo-modules-core|expo-modules-autolinking|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|react-native-screens)/'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
