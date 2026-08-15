# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Tienda web (SPA en español) de "Tio Flashstore" para vender ítems de Fortnite (skins de la tienda diaria, V-Bucks, Fortnite Crew) y otros productos digitales (Crunchyroll, ChatGPT Plus, IPTV, juegos PC, streaming). El frontend es un SPA de React + Vite desplegado en **Netlify** (`tioflashstore.netlify.app`); el backend es un servidor Express separado desplegado en **Render** (`backendflash.onrender.com`). Persistencia y auth en **Supabase**. Los regalos de Fortnite se entregan vía un **bot externo** (servicio aparte, no en este repo) que el backend invoca por HTTP.

## Commands

Frontend (raíz del repo):

```bash
npm run dev        # servidor de desarrollo Vite
npm run build      # build de producción a dist/
npm run serve      # previsualizar el build de dist/
```

Backend (`cd backend`):

```bash
npm start          # node index.js (Express en process.env.PORT, default 3000)
```

No hay linter, ni suite de tests, ni type-checking configurados. `backend` no tiene script de test real.

## Arquitectura general

### Dos aplicaciones desplegadas por separado

- **Frontend** (`/src`): React 18 + Vite 7 + Tailwind v4 + React Router v6. Alias `@` → `./src` (ver `vite.config.js`). Se compila a `dist/` y lo sirve Netlify. `dist/` está commiteado en el repo — es artefacto de build, no lo edites a mano.
- **Backend** (`/backend`): Express 5 en CommonJS (`require`, no `import`). Es una app Node totalmente independiente con su propio `package.json` y `node_modules`. El frontend le pega por URLs **hardcodeadas** a `https://backendflash.onrender.com` (ver `src/pages/Checkout.jsx`, `MercadoPagoCheckout.jsx`, `PayPalCheckout.jsx`, `Dashboard.jsx`). Solo `src/pages/Club.jsx` usa `import.meta.env.VITE_BACKEND_URL` con fallback a esa misma URL.

Al cambiar contratos entre front y back, recuerda que son dos despliegues distintos: un cambio en `/backend` **no** surte efecto hasta re-desplegar/reiniciar Render, independientemente del deploy de Netlify.

### Flujo de una compra (lo más importante de entender)

1. El usuario arma el carrito. El carrito vive en **`CartContext`** (`src/context/CartContext.jsx`), persistido en `localStorage` bajo la clave `carrito`. Los ítems no tienen esquema estricto; el código normaliza `nombre` y calcula `pavos` desde el precio (`precio / 4.4`) cuando faltan.
2. En **`src/pages/Checkout.jsx`** (el archivo más grande y central) el frontend inserta el pedido directamente en Supabase: una fila en `pedidos` + N filas en `pedido_items` (con `offer_id`, `pavos`, `imagen_url`, etc.). Los datos específicos por tipo de producto (Xbox para Crew, método de entrega de V-Bucks, opción de Crunchyroll/ChatGPT/IPTV) se guardan como columnas en la fila `pedidos`.
3. El frontend redirige al proveedor de pago llamando al backend. Hay **tres proveedores**: Mercado Pago (CLP), Zenobank (cripto) y PayPal (USD, con tasa de cambio dinámica CLP→USD).
4. El proveedor llama de vuelta a un **webhook** del backend (`/api/mercadopago-webhook`, `/api/zenobank-webhook`, o la captura de PayPal). Al confirmarse el pago, el backend:
   - Arma un mensaje de confirmación (la variable `mensaje`, con separadores `%0A`) que termina en `wspParams` para notificación por WhatsApp. **Este bloque `mensaje` está triplicado**, casi idéntico, una vez por proveedor (Mercado Pago ~L304, Zenobank ~L491, PayPal ~L692). Cualquier cambio al contenido del mensaje hay que replicarlo en las tres.
   - Llama a **`triggerBotGifts(orderId)`** (`backend/index.js` ~L41), que lee el pedido de Supabase, filtra `pedido_items` con `offer_id`, y hace POST a `${BOT_URL}/regalar` por cada ítem. Si el bot confirma, marca `pedido_items.entregado = true`.

### El bot de Fortnite

El bot es un servicio externo (no está en este repo) en `process.env.BOT_URL`, autenticado con header `X-Bot-Secret: BOT_SECRET`. El backend es un **proxy** hacia él: casi todos los endpoints `/api/bot/*` (`backend/index.js` ~L754–1000) reenvían al bot (stats, health, tienda, reload, set-pavos, friends, agregar/remover amigo, es-amigo, retry-pending, etc.). La entrega de un ítem depende de que el `offer_id` de `pedido_items` coincida con una oferta giftable en la tienda actual de Fortnite.

### Panel de administración (`src/pages/Dashboard.jsx`)

SPA-admin protegida por login que lee/escribe Supabase directamente: lista pedidos e ítems, marca entregas manualmente (`entregado`, `delivered_at`), reintenta regalos vía el proxy del bot, y muestra métricas (`pavos_gastados`, `ingresos_totales` — probablemente vistas/RPC de Supabase, ej. `supabase.rpc('actualizar_pavos_pedidos')`). "Pendientes" = ítems con `entregado=false` y `offer_id` no nulo; "Historial" = entregados, ordenados por `delivered_at`.

### Auth y routing

`src/App.jsx` define todas las rutas. La mayoría se envuelven en **`AuthGuard`** (`src/components/AuthGuard.jsx`), que consulta `supabase.auth.getSession()` y redirige a `/login` si no hay sesión. Header y Footer se ocultan solo en `/login` y `/register`. El cliente Supabase del frontend está en `src/supabaseCliente.js` (usa la anon key).

### Datos de la tienda de Fortnite

- `src/api/fortnite.js` consume la API pública `fortnite-api.com/v2/shop` en el cliente.
- `src/data/shopRotation.json` es un snapshot commiteado de la tienda (estructura `data.entries[]` con `offerId`, `finalPrice`, `giftable`, etc.), usado como fuente de `offer_id` para los productos.
- El backend cachea por separado la imagen del Fortnite Crew scrapeando `fortnite.com` en `/api/crew-image`.

## Convenciones y trampas

- **Frontend en ES modules, backend en CommonJS.** No mezclar `import`/`require` entre ambos.
- **Detección de tipo de producto por substring del nombre** (en minúsculas): el código decide comportamiento con `item.nombre.toLowerCase().includes('crew' | 'vbucks' | 'pavos' | 'xbox' | 'crunchyroll' | ...)`. Es frágil: renombrar un producto puede romper validaciones, mensajes condicionales y el filtrado del carrito. Al tocar esta lógica, busca todos los `.includes(...)` relacionados (aparecen en `Checkout.jsx` y `backend/index.js`).
- **Lógica de mensaje/pago triplicada** en el backend (una por proveedor de pago). Mantenerlas sincronizadas a mano.
- **Todo el texto de la UI es en español** — mantén ese idioma en strings visibles al usuario.
- **Tasa V-Bucks↔CLP inconsistente por diseño histórico:** `src/config/prices.js` usa `4.6`, `CartContext` calcula pavos con `/ 4.4`, y `src/api/fortnite.js` usa `* 4`. No unificar sin confirmar con el negocio.
- **Secrets:** el frontend usa vars `VITE_*` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BACKEND_URL`) vía `import.meta.env`. El backend usa `process.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `*_WEBHOOK_SECRET`, `ZENOBANK_API_KEY`, `PAYPAL_CLIENT_ID/SECRET/MODE`, `BOT_URL`, `BOT_SECRET`, `CORS_ORIGINS`, `ADMIN_EMAIL`, `PORT`). El backend valida webhooks con `isExpectedWebhookSecret` y CORS por allowlist (`CORS_ORIGINS`).
