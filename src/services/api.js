const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');

function csrfCookie() {
  const name = 'XSRF-TOKEN=';
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(name));
  return cookie ? decodeURIComponent(cookie.slice(name.length)) : null;
}

let solicitarCsrf;

async function prepararCsrf() {
  if (csrfCookie()) return;
  // Varias escrituras iniciales comparten la misma solicitud de preparación.
  solicitarCsrf ??= fetch(BASE_URL + '/auth/csrf', { credentials: 'include' })
    .then((response) => {
      if (!response.ok || !csrfCookie()) throw new Error('No se pudo preparar la conexión segura.');
    })
    .finally(() => { solicitarCsrf = null; });
  await solicitarCsrf;
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET') {
    await prepararCsrf();
    headers['X-XSRF-TOKEN'] = csrfCookie();
  }

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method, headers, signal, credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con el servidor de Un Heladito.');
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const messages = {
      401: 'Debes iniciar sesión nuevamente.',
      403: 'La operación fue rechazada. Revisa tus permisos y vuelve a intentarlo.',
      404: 'No encontramos el registro solicitado.',
      409: 'El registro entra en conflicto con los datos actuales.',
    };
    const error = new Error(data?.message || messages[response.status] || 'La API no pudo completar la solicitud.');
    error.status = response.status;
    throw error;
  }
  if (data === null) throw new Error('La API no devolvió una respuesta JSON.');
  return data;
}
