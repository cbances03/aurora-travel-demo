# Sistema visual Aurora

Aurora es un cuaderno editorial de viajes. La exploración usa fotografía protagonista, ritmo amplio, serif con cursivas y elementos que recuerdan una hoja de ruta. La interfaz se diferencia de Nexus AI en composición, navegación, contenido, jerarquía y flujos.

## Tokens

- Papel: #F5F3ED; superficies de acento: #EAECE2 y #FDFCF7.
- Tinta: #263F33; pino: #264B3B; texto secundario: #566252.
- Terracota: #925238 para índices y énfasis.
- Cormorant Garamond en títulos (regular, italic, medium); DM Sans Variable en cuerpo y controles. Ambas autoalojadas y bajo SIL OFL.
- Base de espaciado: 4 px; padding lateral 60/35/22 px; máximo de contenido 1320 px; secciones de 47 a 80 px.
- Adaptaciones de composición a 767 y 1100 px; hero ampliado desde 1600 px. Verificar también 360, 390, 768 y 1024 px.

## Composición y componentes

Landing con fotografía de las Dolomitas a ancho completo, bloque editorial del Valle Sagrado, categorías de viaje y cuaderno de itinerario. El catálogo ofrece grilla de tres columnas en escritorio y una en móvil. Los detalles de destino priorizan nombre, fotografía, relato y experiencias. El planificador usa una columna de detalles y una secuencia de hojas diarias.

Tarjetas con corazón, etiqueta de categoría y contexto de país. Galería modal accesible con foco controlado, flechas de teclado y cierre Escape. Reservas simuladas con validación y resumen. Actividades con día, hora, modificación y eliminación confirmada. Footer con acceso a créditos y alcance visible.

Las fotografías se descargaron a public/images y se sirven mediante next/image con sizes, preload solo en hero/detalle y dimensiones reservadas. Los autores y archivos se documentan en assets.json. No hay dependencia de hotlinks durante la navegación.

## Movimiento y acceso

Revelados verticales moderados, zoom discreto al pasar sobre fotografías y estados de foco visibles. No hay carruseles automáticos. prefers-reduced-motion desactiva animaciones, transiciones y scroll suave. Textos e iconos identifican estados además del color. Diálogos nativos conservan el foco y lo devuelven al disparador.

Las cifras de presupuesto y las experiencias se identifican como ficticias en cada contexto relevante. La interfaz nunca confirma una reserva real ni sugiere que ha comprobado disponibilidad.
