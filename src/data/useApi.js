import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function useApi(path) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ path: null, version: null, data: null, error: '', status: null });

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api(path, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setState({ path, version, data, error: '', status: null });
    }).catch((error) => {
      if (!controller.signal.aborted) setState({ path, version, data: null, error: error.message, status: error.status });
    });
    return () => controller.abort();
  }, [path, version]);

  const current = state.path === path && state.version === version;
  return {
    data: current ? state.data : null,
    error: current ? state.error : '',
    status: current ? state.status : null,
    loading: Boolean(path) && !current,
    reload: () => setVersion((value) => value + 1),
  };
}
