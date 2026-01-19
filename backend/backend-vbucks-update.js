// AGREGAR ESTA SECCIÓN EN EL BACKEND index.js
// Después de la línea 166 (después de la sección de IPTV)

                // Información de V-Bucks/Recargas - NUEVO
                if (pedidoData.vbucks_delivery_method) {
                    mensaje += `========================================%0A`;
                    mensaje += `💰 Recarga de V-Bucks:%0A`;
                    
                    // Mostrar método de entrega
                    let metodoTexto = '';
                    if (pedidoData.vbucks_delivery_method === 'epic-link') {
                        metodoTexto = '🟣 Vinculación a Epic (Recomendado)';
                    } else if (pedidoData.vbucks_delivery_method === 'xbox-account') {
                        metodoTexto = '🔵 Cuenta de Xbox (Directo)';
                    } else if (pedidoData.vbucks_delivery_method === 'preloaded-account') {
                        metodoTexto = '🌊 Cuenta Precargada (Más Rápido)';
                    }
                    mensaje += `Método de entrega: ${metodoTexto}%0A`;
                    
                    // Credenciales según el método
                    if (pedidoData.vbucks_delivery_method === 'epic-link') {
                        mensaje += `------------------------------------%0A`;
                        mensaje += `📧 Credenciales Epic Games:%0A`;
                        if (pedidoData.vbucks_epic_email) {
                            mensaje += `Correo Epic: ${pedidoData.vbucks_epic_email}%0A`;
                        }
                        if (pedidoData.vbucks_epic_password) {
                            mensaje += `Contraseña Epic: ${pedidoData.vbucks_epic_password}%0A`;
                        }
                        mensaje += `⚠️ 2FA debe estar deshabilitado temporalmente%0A`;
                    } else if (pedidoData.vbucks_delivery_method === 'xbox-account') {
                        mensaje += `------------------------------------%0A`;
                        mensaje += `🎮 Credenciales Xbox:%0A`;
                        if (pedidoData.vbucks_xbox_email) {
                            mensaje += `Correo Xbox: ${pedidoData.vbucks_xbox_email}%0A`;
                        }
                        if (pedidoData.vbucks_xbox_password) {
                            mensaje += `Contraseña Xbox: ${pedidoData.vbucks_xbox_password}%0A`;
                        }
                        mensaje += `⚠️ 2FA debe estar deshabilitado temporalmente%0A`;
                    } else if (pedidoData.vbucks_delivery_method === 'preloaded-account') {
                        mensaje += `📦 Se enviará cuenta precargada por email%0A`;
                    }
                }
