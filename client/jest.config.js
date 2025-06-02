module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  transformIgnorePatterns: [
    // Aqui dizemos ao Jest que “ignore tudo em node_modules,
    // exceto os pacotes listados abaixo, que devem ser TRANSPILADOS”
    'node_modules/(?!(expo|@expo|react-native|@react-native|expo-modules-core|expo-font|@expo/vector-icons|@react-navigation|@unimodules|unimodules)/)'
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
