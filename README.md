
# 📱 AppBlog - React Native com Expo

Este projeto é um aplicativo mobile desenvolvido com **React Native** utilizando **Expo**. O objetivo do app é listar posts de uma API pública, permitir que o usuário adicione novos posts personalizados, favorite, comente e persista dados localmente.

---

## 🚀 Funcionalidades Implementadas

✅ Listagem de posts de uma API pública (JSONPlaceholder).  
✅ Adição de novos posts personalizados.  
✅ Sistema de favoritos com persistência local usando AsyncStorage.  
✅ Sistema de comentários por post.  
✅ Estado global gerenciado com Redux para usuário fake, permitindo a criação de posts personalizados e persistência dos dados com AsyncStorage.
✅ Otimizações e abrangências em buscas(ex: Like Search).
✅ Paginação para carregar os posts da tela inicial.
✅ Testes Unitários.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** — desenvolvimento mobile
- **Expo** — simplificação do ambiente React Native
- **Redux** — gerenciamento de estado
- **AsyncStorage** — persistência local
- **TypeScript** — tipagem estática
- **JSONPlaceholder** — API pública para listagem de posts

---

## ⚙️ Pré-requisitos

- **Node.js** >= 14.x
- **Expo CLI** instalado globalmente  
  ```bash
  npm install -g expo-cli
  ```
- Um dispositivo com **Expo Go** ou um emulador

---

## 📝 Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/appblog.git
```

2. Acesse a pasta do projeto:

```bash
cd appblog
```

3. Instale as dependências:

```bash
yarn install
# ou
npm install
```

4. Inicie o servidor de desenvolvimento:

```bash
expo start
```

5. Abra o aplicativo no seu celular usando o **Expo Go** ou em um emulador.

---

## 🧩 Principais dependências

- `"@react-native-async-storage/async-storage"`
- `"react-redux"`
- `"redux"`
- `"expo"`
- `"react-native"`

---

## ✅ Funcionalidades desenvolvidas

- 📝 CRUD de posts personalizados
- ⭐ Sistema de favoritos
- 💬 Comentários em posts
- 💾 Persistência local com AsyncStorage

---

## ✅ Configuração para Build Standalone

Se desejar gerar um app standalone:

1. Adicione no `app.json`:

```json
{
  "expo": {
    "scheme": "appblog",
    "extra": {
      "eas": {
        "projectId": "seu-project-id"
      }
    }
  }
}
```

2. Gere a build com:

```bash
eas build --platform android
# ou
eas build --platform ios
```

---

## 🧑‍💻 Como contribuir

1. Faça um fork do projeto.
2. Crie uma branch: `git checkout -b minha-feature`.
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`.
4. Push para sua branch: `git push origin minha-feature`.
5. Abra um Pull Request.

---

## 📞 Contato

Desenvolvido por **jonasdiogo010@gmail.com** 

---
