// hooks/useFavorites.ts
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = useCallback(async () => {
    const stored = await AsyncStorage.getItem('@favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = async (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    await AsyncStorage.setItem('@favorites', JSON.stringify(updated));
  };

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    toggleFavorite,
    loadFavorites,
  };
};
