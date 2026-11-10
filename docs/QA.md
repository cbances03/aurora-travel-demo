# Validación de Aurora Travel

Fecha: 2026-11-10. Windows, Node.js 22.19.0, npm 10.9.3, Next.js 16.4.6, React 19.3.0. Playwright 1.65.0 con Microsoft Edge instalado. Servidor de producción local en puerto 3200.

## Resultados ejecutados

| Control | Resultado |
| --- | --- |
| npm run lint | Aprobado; cero warnings |
| npm run typecheck | Aprobado |
| npm run build | Aprobado; seis detalles de destino generados estáticamente |
| npm run test:e2e | **48 passed (45.4 s)**; código de salida 0 |
| Axe WCAG 2 A/AA y 2.1 AA | Sin infracciones detectadas en las doce rutas, móvil y escritorio |
| Imágenes | Todas las imágenes de las rutas probadas cargan con dimensiones naturales válidas |
| Consola y HTTP | Sin errores detectados en las doce rutas principales |
| npm audit --omit=dev | Cero vulnerabilidades conocidas |

Desktop: 1440 × 1000. Móvil táctil: 390 × 844. Verificación adicional de overflow a 360, 768 y 1024 px en landing, catálogo, detalle, experiencias y planificador. Movimiento reducido y scroll automático verificados. No se probaron Safari/Firefox ni dispositivos físicos.

## Cobertura funcional

- Navegación, menú móvil/Escape/foco y categoría inicial desde landing.
- Búsqueda sin acentos, combinación de región/categoría, orden, estado vacío y restablecimiento.
- Favoritos guardados, recuperados al recargar y eliminados desde la colección.
- Galería por botones y teclado, cierre Escape y retorno de foco al disparador.
- Búsqueda de experiencias y adición al día 1, reflejada en presupuesto ficticio.
- Reservas simuladas: fechas, nombre y correo inválidos; confirmación válida explícitamente ficticia; sin POST ni correo almacenado.
- Detalles de viaje validados y conservados tras recarga, incluido contenido del formulario.
- Crear actividad, moverla de día, cambiar hora y experiencia, recalcular presupuesto y persistir.
- Rechazar fechas que dejen actividades fuera del rango, cancelar borrado, confirmar eliminación.
- Restablecer itinerario conserva favoritos.
- Almacenamiento corrupto: aviso y recuperación. Almacenamiento bloqueado: cambio temporal funcional y aviso.
- 404 de destino desconocido y recuperación hacia el catálogo.

## Revisión visual

Capturas de landing, detalle y planificador en escritorio y móvil generadas por Playwright. Se revisaron visualmente la landing de escritorio y el planificador móvil. Referencias en docs/preview; informes completos regenerables en test-results y playwright-report, ignorados por Git.

## Hallazgos corregidos

- Contraste insuficiente del texto secundario sobre fondos editoriales y detalles del planificador: se oscurecieron los tokens afectados; axe pasa en la ejecución final.
- Selector de prueba de viajeros: se usa el rol combobox con su nombre accesible.
- Lint intentaba revisar JavaScript generado de los reportes de fallo de Playwright: se excluyeron playwright-report, test-results y .qa de ESLint, sin excluir código de producto ni tests.
- Import sin uso retirado. No se ignoran errores de compilación o avisos de lint del código fuente.

## Dependencias y límites conocidos

Las dependencias de desarrollo tienen ocho avisos moderados en la cadena typescript-eslint/minimatch. ESLint 9.39.5 mantiene compatibilidad con los plugins del framework pero tiene aviso de fin de soporte. No se aplica una sustitución mayor no validada ni se ocultan los avisos. La auditoría de producción no detectó vulnerabilidades conocidas.

La revisión automatizada no constituye certificación de accesibilidad. No se han medido Lighthouse/Core Web Vitals en producción. Los importes, experiencias y sugerencias son ficticios; no hay disponibilidad, pago, reserva real o cálculo logístico. La persistencia es por navegador, con última escritura entre pestañas.

## Publicación

El propietario autorizó la publicación. Repositorio público: https://github.com/cbances03/aurora-travel-demo. URL HTTPS: https://aurora-travel-demo.vercel.app.

Build remoto aprobado; despliegue inicial dpl_5CfNu6yd2noGxUaSybeswJe3en3U en READY. Petición HTTPS anónima: HTTP 200, título correcto y sin redirección a autenticación. Suite completa ejecutada sobre la URL pública: **48 passed (1.4m)**, código 0, sin credenciales, cookies de sesión ni bypass. Incluye las doce rutas, imágenes, consola, accesibilidad, filtros, galería, persistencia, reservas simuladas e itinerarios.

Vercel/GitHub conectado: repositorio aurora-travel-demo, productionBranch main y Node.js 22.x confirmados mediante lectura de configuración. Equipo c-3, plan Hobby sin extras contratados. Las URLs de preview conservan su protección predeterminada; la URL de producción indicada es pública.
