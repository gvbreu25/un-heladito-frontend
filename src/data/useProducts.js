import { useApi } from './useApi.js';

const VACIO = [];

export function useProducts() {
  const query = useApi('/productos');
  return { ...query, products: query.data ?? VACIO };
}
