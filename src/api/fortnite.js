// /src/api/fortnite.js
export async function fetchFortniteShop() {
  const res = await fetch("https://fortnite-api.com/v2/shop?language=es");
  if (!res.ok) throw new Error("Error al obtener la tienda");
  const data = await res.json();
  return data?.data?.entries || [];
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
        precio: Math.round(e.finalPrice * 4.4),
        imagen: item?.image || item?.images?.icon || "",
        desc: item?.description || "Colección de Fortnite Pesadillas",
      };
    });
}
