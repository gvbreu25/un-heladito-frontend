# Un Heladito frontend

Tienda de helados artesanales en React para Desarrollo Full Stack II, DSY1104, sección 002D de Duoc UC. Incluye catálogo, carrito, pedidos y vistas de gestión según el perfil.

## Ejecutar

1. Instala **Node.js 24 LTS** y abre PowerShell en la carpeta del frontend.
2. Inicia el backend en `http://localhost:8080` con las instrucciones de su README.
3. Instala los paquetes y arranca Vite.

```powershell
npm ci
npm run dev -- --host localhost --strictPort
```

4. Abre `http://localhost:5173`. Usa `localhost` para ambos proyectos, de modo que el navegador pueda enviar la cookie al backend.
5. Si la API usa otra dirección, copia `.env.example` a `.env.local` y configura `VITE_API_URL`. Las variables `VITE_*` se incluyen en el frontend y son públicas.

## Flujo de uso

- El visitante recorre la tienda. Una cuenta de cliente permite registrar pedidos y ver su historial.
- El vendedor consulta la lista y detalle de productos y pedidos.
- El administrador tiene acceso a tienda, gestión de productos, pedidos y listado de usuarios.
- El carrito guarda una selección local. Los pedidos, la identidad del usuario y el catálogo se obtienen de la API. Al registrar un pedido, el backend valida stock y calcula el total.

## Comandos

| Acción | Comando |
| --- | --- |
| Ejecutar pruebas unitarias | `npm run test:ejecutar` |
| Generar cobertura | `npm run test:cobertura` |
| Generar archivos de producción | `npm run build` |

## Atribución

La base React, diseño y pruebas de la EA2 se desarrollaron en equipo por Eduardo Acevedo, Edward Cardoza y Gabriel Abreu. Esta versión conserva esa base y la integra con el backend en la continuación individual de Gabriel Abreu para la EA3. https://github.com/EdACMDragonredgo/Un_heladito-
