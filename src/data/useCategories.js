import { useApi } from './useApi.js';

const VACIO = [];

export function useCategories() {
  const query = useApi('/categorias');
  return { ...query, categories: query.data ?? VACIO };
}
