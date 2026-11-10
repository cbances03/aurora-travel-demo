# Aurora Travel

Una plataforma editorial de exploración y planificación de viajes. Seis destinos reales, fotografía con licencia y experiencias ficticias para construir un itinerario demostrativo. Sin cuentas, backend, pagos ni reservas reales.

## Instalación y ejecución

Node.js 22.x y npm 10 o superior. Cada proyecto es independiente.

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. Fuentes y fotografías se sirven localmente. No hay .env ni claves necesarias.

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run start
```

Las pruebas usan Edge instalado en Windows, dos proyectos de navegador (escritorio y móvil) y servidor de producción en http://127.0.0.1:3200. Ejecutar primero el build. Los reportes y capturas están en playwright-report y test-results, ignorados por Git. `npm run test:report` abre el informe.

Para CI Linux, cambiar `channel: msedge` por Chromium en playwright.config.ts e instalarlo con `npx playwright install --with-deps chromium`. Para probar producción en PowerShell, establecer PLAYWRIGHT_BASE_URL a la URL verificada y ejecutar npm run test:e2e; eliminar después esa variable. Las pruebas no necesitan sesión ni bypass.

## Páginas

| Ruta               | Función                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `/`                | Landing editorial, destinos, categorías y entrada al planificador      |
| `/destinos`        | Búsqueda sin acentos, filtros por categoría/región, orden y galería    |
| `/destinos/[slug]` | Historia, foto, puntos de interés y experiencias del destino           |
| `/experiencias`    | Catálogo filtrable, añadir al plan y reserva simulada                  |
| `/favoritos`       | Colección persistente con filtros y eliminación                        |
| `/planificador`    | Fechas, viajeros, actividades editables por día y presupuesto ficticio |
| `/creditos`        | Créditos fotográficos, licencias y alcance de la demo                  |

Los slugs de destino son dolomitas, madeira, kyoto, valle-sagrado, atacama e islandia. Un destino no reconocido devuelve 404. El cuaderno visual permite recorrer fotografías de destinos distintos con flechas y teclado.

## Funcionalidad

Los favoritos y el itinerario se guardan en `aurora.travel.v1` de localStorage. El editor admite de 1 a 14 días, de 1 a 6 viajeros y hasta 60 actividades. Añadir una experiencia desde el catálogo la coloca a las 09:00 del día 1; el planificador permite cambiar día, hora y experiencia, o eliminarla con confirmación. Las fechas no pueden acortar el viaje dejando actividades fuera sin que el usuario las mueva o elimine antes. Restablecer el viaje conserva favoritos.

Los importes de actividades son ficticios en USD y se multiplican por los viajeros. No incluyen traslados, alojamiento, comidas ni otros gastos. No se calculan distancias o viabilidad logística entre destinos.

Las reservas validan fecha, viajeros, nombre y correo localmente, y muestran una confirmación explícitamente simulada. No generan reservas, llamadas a proveedores, pagos ni almacenamiento de nombre o correo. El formulario descarta esos campos al completar/cerrar.

Almacenamiento corrupto: se muestra un aviso y datos seguros; el siguiente cambio reemplaza los datos inválidos. Almacenamiento bloqueado: los cambios se conservan temporalmente en la pestaña y se informa al usuario. No hay sincronización entre dispositivos; entre pestañas prevalece la última escritura.

## Tecnologías y estructura

Next.js 16.4.6 App Router, React 19.3.0, TypeScript estricto, Tailwind CSS 4, Motion, Lucide y fuentes autoalojadas DM Sans / Cormorant Garamond. Playwright y axe para E2E y accesibilidad. ESLint y Prettier para mantenimiento.

- src/app: páginas, metadata, 404 y estilos.
- src/components: navegación, tarjetas, galería, catálogo, reserva y planificador.
- src/lib/travel.ts: datos y funciones de fechas/búsqueda/precios.
- src/lib/store.ts: persistencia validada e hidratación segura.
- public/images: fotografías locales.
- docs: diseño, arquitectura, licencias y resultados de QA.

## Publicación

Repositorio público: https://github.com/cbances03/aurora-travel-demo

URL pública: https://aurora-travel-demo.vercel.app

Vercel: equipo c-3, proyecto aurora-travel-demo, Node.js 22.x, preset Next.js y build `npm run build`. GitHub conectado con rama de producción main. No requiere servicios adicionales ni variables secretas. Recursos creados con autorización específica del propietario, en el plan Hobby existente sin contratar extras.

Para desplegar una copia, importar el repositorio en una cuenta autorizada, usar estos mismos ajustes y conectar su rama main. Comprobar HTTPS, acceso anónimo, rutas directas y E2E sobre la URL real. No utilizar un nombre ocupado para modificar un recurso existente. Los resultados de esta entrega se registran en docs/QA.md.

## Mantenimiento

Trabajar en ramas, usar npm ci y ejecutar lint/typecheck/build/E2E antes de fusionar a main. Revisar dependencias y npm audit, conservar lockfile y repetir las pruebas al actualizar. Versionar/migrar la clave local si cambia su esquema. Eliminar datos desde el navegador o restablecer el itinerario cuando se necesite una demo limpia. Verificar el despliegue automático tras cada cambio.

## Licencias y límites

Fotografías de Unsplash con licencia gratuita verificada; autores, fuentes y archivos en [docs/assets.json](docs/assets.json) y en `/creditos`. No se usan recursos Unsplash+. La [licencia Unsplash](https://unsplash.com/license) permite uso en este contexto; no se revenden fotos ni se crea un banco de imágenes. Las fuentes utilizan SIL OFL y Lucide, ISC. No se asigna licencia pública al código sin decisión del propietario.

La revisión automática de accesibilidad no es una certificación ni reemplaza revisión con lector de pantalla. Estado real de validación y avisos de tooling: [docs/QA.md](docs/QA.md).
