# Arquitectura de Aurora Travel

Next.js App Router con páginas de presentación en Server Components y componentes interactivos aislados en cliente. Catálogo de seis destinos y ocho experiencias definido y tipado en travel.ts. Se generan estáticamente los seis detalles y su metadata; un slug inexistente produce 404. /destinos lee parámetros asíncronos para la categoría inicial.

## Estado

La clave `aurora.travel.v1` guarda favoritos y un viaje: nombre, inicio, final, viajeros y actividades con id, experienceId, índice de día y hora. useSyncExternalStore conserva un snapshot de servidor estable y lee datos tras la hidratación, evitando diferencias de markup. Cambios propios notifican suscripciones y el evento storage sincroniza otras pestañas. La última escritura prevalece; no hay transacciones multiusuario.

El lector valida objeto, destinos y experiencias permitidos, formato/validez de fechas, límites, horas y unicidad de ids. Datos dañados muestran una vista segura con aviso. Si setItem falla, se usa memoria de pestaña con aviso. No hay transmisión de datos, autenticación o backend.

Las fechas se operan en UTC al mediodía para evitar desfases al formatear. El rango es inclusivo de 1 a 14 días. Acortar el viaje se rechaza si deja actividades fuera. Los campos del editor de viaje se reinician solo cuando cambia la configuración guardada, para hidratar detalles persistentes sin perder edición por cambios de actividades.

## Componentes

- Explorer combina búsqueda normalizada sin acentos, región, categoría, orden y favoritos.
- DestinationCard / FavoriteButton guardan colecciones accesibles desde catálogo y detalles.
- GalleryButton abre un recorrido por las fotografías de los destinos disponibles y admite teclado.
- ExperienceCard añade a día 1 o abre una simulación de reserva. La validación y confirmación no realizan peticiones ni guardan información personal.
- Planner valida fechas y viajeros, añade experiencias, actualiza día/hora/experiencia, confirma borrados y calcula presupuesto ficticio.
- Modal conserva foco; Notice anuncia estado; Reveal mantiene contraste sin reducir opacidad.

## Límites de la demo

No hay disponibilidad real, pagos, correos, rutas geográficas calculadas, tiempos de traslado ni datos actualizados del viaje. Los destinos son reales y las propuestas son ficción editorial. El presupuesto solo suma actividades ficticias por viajeros. Fotos y fuentes se sirven localmente. No introducir información sensible en el formulario de demostración.

Almacenar en localStorage no aísla a usuarios de un mismo perfil de navegador. No hay sincronización entre dispositivos. Restablecer el viaje conserva los favoritos; borrar todos los datos del sitio desde el navegador elimina la colección completa.
