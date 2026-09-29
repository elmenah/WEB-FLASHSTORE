// /src/api/fortnite.js
let cachedShop = null;
export async function fetchFortniteShop(signal, { fresh = false } = {}) {
  const day = new Date().toISOString().slice(0, 10);
  if (!fresh && cachedShop?.day === day && Date.now() - cachedShop.time < 60000) return cachedShop.entries;
  const timeout = AbortSignal.timeout(12000);
  const res = await fetch("https://fortnite-api.com/v2/shop?language=es", { signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  if (!res.ok) throw new Error("Error al obtener la tienda");
  const data = await res.json();
  if (!Array.isArray(data?.data?.entries)) throw new Error('La tienda no respondió correctamente.');
  cachedShop = { entries: data.data.entries, time: Date.now(), day };
  return data.data.entries;
}

export function filterFortnitemares(entries) {
  const keywords = [
    "fortnite pesadillas", "pesadillas", "fortnitemares", "nightmare",
    "halloween", "ghost", "pumpkin", "miedo", "terror", "ravemello",
    "jason", "captor", "calabaza", "fiesta espectral"
  ];

  const isFortnitemares = (text) =>
    text && keywords.some((kw) => text.toLowerCase().includes(kw));

  return entries
    .filter((e) => {
      const allText = JSON.stringify(e).toLowerCase();
      return isFortnitemares(allText);
    })
    .map((e) => {
      const item = e.bundle || e.brItems?.[0];
      return {
        id: e.offerId,
        nombre: item?.name || "Skin misteriosa",
        precio: Math.round(e.finalPrice * 4),
        imagen: item?.image || item?.images?.icon || "",
        desc: item?.description || "Colección de Fortnite Pesadillas",
      };
    });
}
