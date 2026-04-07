# ColectivosYa — Bahía Blanca 🚌
 
> Consultá posición en vivo, recorridos y paradas de los colectivos de Bahía Blanca.
 
**[colectivos.corzo.ar](https://colectivos.corzo.ar)** · Proyecto de código abierto desarrollado por [Federico Corzo](https://federico.corzo.ar)
 
---
 
## ¿Qué es?
 
ColectivosYa es una web app de código abierto que permite a los vecinos de Bahía Blanca consultar en tiempo real la posición de los colectivos urbanos, sus recorridos y paradas — todo desde el navegador, sin instalar nada.
 
El proyecto nació ante la falta de herramientas accesibles y abiertas para acceder a esta información, y con la convicción de que los datos del transporte público deben ser públicos.
 
---
 
## Tech Stack
 
| Tecnología | Rol |
|---|---|
| [Vite](https://vitejs.dev) | Bundler y tooling de desarrollo |
| [TypeScript](https://www.typescriptlang.org) | Tipado estático |
| [React](https://react.dev) | Interfaz de usuario |
| [react-snap](https://github.com/stereobooster/react-snap) | Pre-rendering estático para mejor rendimiento y menos JavaScript en el cliente |
| [Tailwind CSS](https://tailwindcss.com) | Estilos utilitarios rápidos |
| [Google Maps](https://developers.google.com/maps) | Visualización de recorridos y posición en el mapa |
| [Firebase](https://firebase.google.com) | Backend y acceso a la API semi-pública |
 
---
 
## Fuente de datos
 
Los datos se obtienen a través de una **API semi-pública** (accedida vía Firebase) de **gpsbus / ColectivosYa / Colectivos Bahía Blanca (CBB)**, que provee información en tiempo real sobre la flota de colectivos de la ciudad.
 
### El problema con los datos abiertos en Bahía Blanca
 
El Municipio de Bahía Blanca **no cumple con el derecho a la información pública** al no brindar a los desarrolladores acceso oficial a los datos del transporte urbano. Información como:
 
- 📍 Posición en tiempo real de los colectivos
- 🛑 Paradas y sus ubicaciones
- 🕐 Horarios por línea y ramal
 
...debería estar disponible públicamente mediante una API abierta, como ocurre en muchas otras ciudades del mundo bajo estándares como [GTFS](https://gtfs.org/).
 
### Hoja de ruta
 
**A fines de 2026** se planea lanzar una versión pública y documentada de la API, con mejoras orientadas a:
 
- Cumplir con el derecho a la información pública
- Permitir a cualquier desarrollador construir herramientas sobre estos datos
- Fomentar un ecosistema de apps y soluciones ciudadanas para el transporte bahiense
 
---
 
## Contribuir
 
El proyecto es de **código abierto** — toda contribución es bienvenida: desde reportar bugs, proponer mejoras, hasta abrir PRs. Si querés colaborar, revisá los issues abiertos o contactá al desarrollador.
 
---
 
## Autor
 
Desarrollado por **[Federico Corzo](https://federico.corzo.ar)**, bahiense.
 
---
 
## Licencia
 
Este proyecto es open source con Apache 2.0. Consultá el archivo `LICENSE.txt` para más detalles.