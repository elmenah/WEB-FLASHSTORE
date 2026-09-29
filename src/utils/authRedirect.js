export function safeReturnTo(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return '/';
  const url = new URL(value, window.location.origin);
  if (url.origin !== window.location.origin || ['/login', '/register'].includes(url.pathname)) return '/';
  return url.pathname + url.search + url.hash;
}

export function authUrl(page, returnTo) {
  return `${page}?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
}
