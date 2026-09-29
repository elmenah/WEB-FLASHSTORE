export const productPath = product => '/product/' + slugify(productName(product));
export const productName = p => p.bundle?.name || p.brItems?.[0]?.name || p.tracks?.[0]?.title || p.cars?.[0]?.name || p.instruments?.[0]?.name || p.nombre || 'Producto';
export const slugify = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export function normalizeProduct(product) {
    const isBundle = !!product.bundle?.name;

    // 🎨 OBTENER COLORES DINÁMICOS IGUAL QUE EN PRODUCTCARD
    let color1 = "#475569";
    let color2 = "#334155";
    let color3 = "#1e293b";

    if (product.colors) {
      let colorArray = [];

      if (
        typeof product.colors === "object" &&
        !Array.isArray(product.colors) &&
        product.colors !== null
      ) {
        colorArray = Object.values(product.colors);
      } else if (Array.isArray(product.colors)) {
        colorArray = product.colors;
      }

      if (colorArray.length > 0) {
        color1 = colorArray[0] ? `#${colorArray[0].slice(0, 6)}` : color1;
        color2 = colorArray[1] ? `#${colorArray[1].slice(0, 6)}` : color1;
        color3 = colorArray[2] ? `#${colorArray[2].slice(0, 6)}` : color2;
      }
    }
    const contenidoLimpio = isBundle
      ? Array.from(
          new Map(
            (product.brItems || []).map((item) => [
              item.name.toLowerCase(), // 👈 deduplicar por nombre
              {
                nombre: item.name,
                imagen: item.images?.icon || item.images?.featured,
              },
            ])
          ).values()
        )
      : [];
    const productData = isBundle
      ? {
          nombre: product.bundle.name || "Lote sin nombre",
          precio: product.finalPrice,
          imagen: product.bundle.image || "URL_IMAGEN_DEFAULT",
          descripcion: product.bundle.info || "Sin descripción disponible",
          offer_id: product.offerId || null,
          pavos: product.finalPrice || 0,

          contenido: contenidoLimpio,
          partede: `Incluye ${contenidoLimpio.length} objetos`,

          grupo: "Lote",
          tipo: "Lote",
          rareza: product.rarity?.displayValue || "Sin rareza",
          banner: product.banner?.value || null,
          inicio: product.inDate || null,
          fin: product.outDate || null,
          color1,
          color2,
          color3,
        }
      : {
          // 👕 ITEM / SKIN
          nombre: product.brItems?.[0]?.name || "Sin nombre",
          precio: product.finalPrice,
          imagen:
            product.brItems?.[0]?.images?.featured ||
            product.brItems?.[0]?.images?.icon ||
            "URL_IMAGEN_DEFAULT",
          descripcion:
            product.brItems?.[0]?.description || "Sin descripción disponible",
          offer_id: product.offerId || null,
          pavos: product.finalPrice || 0,

          // ✅ ITEM → Parte del conjunto
          partede:
            product.brItems?.[0]?.set?.text || "No pertenece a ningún conjunto",

          grupo: product.brItems?.[0]?.set?.text || "Sin categoría",
          tipo: product.brItems?.[0]?.type?.displayValue || "No especificado",
          rareza: product.brItems?.[0]?.rarity?.displayValue || "Sin rareza",
          banner: product.banner?.value || null,
          inicio: product.inDate || null,
          fin: product.outDate || null,
          color1,
          color2,
          color3,
        };

return productData;
}
