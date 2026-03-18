/**
 * Script para poblar las imágenes de juegos desde RAWG API a Supabase.
 * 
 * ANTES DE EJECUTAR:
 * 1. Agrega una columna "imagen" de tipo TEXT a la tabla "juegos" en Supabase
 * 
 * EJECUTAR:
 *   node scripts/poblar-imagenes.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jbeluuamhnxaifaiydbd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZWx1dWFtaG54YWlmYWl5ZGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjAwODIwMywiZXhwIjoyMDcxNTg0MjAzfQ.tZJkytxllRr85f_2xUvGWrinIau75OIGhpFEFZJJb3c";
const RAWG_API_KEY = "bebbe1f99ca442a999156b977c1b6f40";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  // Obtener todos los juegos sin imagen
  const { data: juegos, error } = await supabase
    .from("juegos")
    .select("id, nombre")
    .or("imagen.is.null,imagen.eq.");

  if (error) {
    console.error("Error al obtener juegos:", error.message);
    return;
  }

  console.log(`Encontrados ${juegos.length} juegos sin imagen.\n`);

  let actualizados = 0;
  let fallidos = 0;

  // Procesar en lotes de 10
  for (let i = 0; i < juegos.length; i += 10) {
    const lote = juegos.slice(i, i + 10);

    const promesas = lote.map(async (juego) => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?search=${encodeURIComponent(juego.nombre)}&key=${RAWG_API_KEY}&page_size=1`
        );
        const data = await res.json();

        if (data.results?.length > 0 && data.results[0].background_image) {
          const imageUrl = data.results[0].background_image;

          const { error: updateError } = await supabase
            .from("juegos")
            .update({ imagen: imageUrl })
            .eq("id", juego.id);

          if (updateError) {
            console.error(`  ✗ ${juego.nombre}: ${updateError.message}`);
            fallidos++;
          } else {
            console.log(`  ✓ ${juego.nombre}`);
            actualizados++;
          }
        } else {
          console.log(`  ? ${juego.nombre} — sin resultados en RAWG`);
          fallidos++;
        }
      } catch (err) {
        console.error(`  ✗ ${juego.nombre}: ${err.message}`);
        fallidos++;
      }
    });

    await Promise.all(promesas);
    console.log(`  Lote ${Math.floor(i / 10) + 1} completado.\n`);
  }

  console.log(`\nResultado: ${actualizados} actualizados, ${fallidos} sin imagen.`);
}

main();
