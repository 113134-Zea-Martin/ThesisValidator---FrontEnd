# ThesisValidator

ThesisValidator es una plataforma web desarrollada en Angular que permite a usuarios subir documentos de tesis de astronomía, procesarlos y realizar consultas inteligentes sobre su contenido mediante un asistente de chat con IA. El sistema utiliza procesamiento de lenguaje natural (NLP) y búsqueda semántica para responder preguntas basadas en los documentos cargados, proporcionando además referencias a los fragmentos de texto relevantes.

---

## Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Detalles Técnicos](#detalles-técnicos)
- [Pruebas](#pruebas)
- [Configuración](#configuración)
- [Notas y Recomendaciones](#notas-y-recomendaciones)

---

## Características

- **Subida de documentos:** Permite subir el texto completo de una tesis de astronomía.
- **Procesamiento automático:** Tras la subida, el documento es procesado y se generan embeddings para búsqueda semántica.
- **Historial de documentos:** Visualización de documentos procesados previamente.
- **Chat con IA:** Interfaz de chat para hacer preguntas sobre los documentos cargados.
- **Respuestas con contexto:** Las respuestas del asistente incluyen referencias a los fragmentos de texto utilizados.
- **Recuperación de conversaciones previas:** Posibilidad de cargar conversaciones anteriores.
- **Interfaz moderna:** Uso de Bootstrap 5 y Bootstrap Icons para una experiencia visual atractiva y responsiva.
- **Soporte para texto plano, Markdown o LaTeX** en la subida de documentos.

---

## Estructura del Proyecto

```
.
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── home/
│   │   │   ├── navbar/
│   │   │   └── upload/
│   │   ├── interfaces/
│   │   │   └── models.ts
│   │   ├── services/
│   │   │   └── api.service.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── public/
├── .vscode/
├── .angular/
├── package.json
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md
```

---

## Instalación

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/113134-Zea-Martin/ThesisValidator---FrontEnd
   cd ThesisValidator
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Configura el backend:**
   - El frontend espera un backend (https://github.com/113134-Zea-Martin/ThesisValidator---BackEnd) con los endpoints `/upload`, `/generate-embeddings`, `/documents`, `/search`, `/ask` y `/conversations`.
   - **Nota:** Este repositorio solo contiene el frontend. Debes tener el backend correspondiente levantado para que la aplicación funcione correctamente.

---

## Uso

### Desarrollo

Para iniciar el servidor de desarrollo y abrir la aplicación en tu navegador:

```sh
npm start
```
o
```sh
ng serve
```

Luego navega a [http://localhost:4200/](http://localhost:4200/).

### Producción

Para construir la aplicación para producción:

```sh
npm run build
```
Los archivos generados estarán en `dist/thesis-validator/`.

---

## Scripts Disponibles

- `npm start` / `ng serve`: Inicia el servidor de desarrollo.
- `npm run build` / `ng build`: Compila la aplicación para producción.
- `npm test` / `ng test`: Ejecuta los tests unitarios con Karma y Jasmine.
- `npm run watch`: Compila en modo watch para desarrollo.

---

## Detalles Técnicos

- **Framework:** Angular 18 (standalone components, Angular CLI)
- **Estilos:** Bootstrap 5, Bootstrap Icons
- **Comunicación HTTP:** [`ApiService`](src/app/services/api.service.ts) maneja todas las llamadas al backend.
- **Componentes principales:**
  - [`UploadComponent`](src/app/components/upload/upload.component.ts): Formulario para subir y procesar tesis.
  - [`ChatComponent`](src/app/components/chat/chat.component.ts): Chat con IA para consultas sobre los documentos.
  - [`HomeComponent`](src/app/components/home/home.component.ts): Página de inicio con explicación y acceso rápido a las funciones.
  - [`NavbarComponent`](src/app/components/navbar/navbar.component.ts): Barra de navegación.
- **Modelos de datos:** Definidos en [`models.ts`](src/app/interfaces/models.ts).
- **Ruteo:** Definido en [`app.routes.ts`](src/app/app.routes.ts).
- **Configuración global:** [`app.config.ts`](src/app/app.config.ts).

---

## Pruebas

El proyecto incluye pruebas unitarias básicas para los componentes principales y servicios.

Para ejecutar los tests:
```sh
npm test
```
Esto lanzará Karma y ejecutará los tests definidos en los archivos `.spec.ts` dentro de `src/app/`.

---

## Configuración

- **Configuración de TypeScript:** Ver [`tsconfig.json`](tsconfig.json), [`tsconfig.app.json`](tsconfig.app.json), [`tsconfig.spec.json`](tsconfig.spec.json).
- **Configuración de Angular:** Ver [`angular.json`](angular.json).
- **Configuración de VSCode:** Ver archivos en [`.vscode/`](.vscode/).

---

## Notas y Recomendaciones

- **Backend necesario:** Este frontend requiere un backend compatible en `http://127.0.0.1:8000` (Editar API_MAIN_URL desde api.service.ts). Si no está disponible, las funciones de subida, procesamiento y chat no funcionarán.
- **Soporte de archivos:** Actualmente solo se soporta la subida de texto (no PDFs ni otros formatos).
- **Internacionalización:** La interfaz y mensajes están en inglés y español.
- **Licencia:** No se especifica una licencia en este repositorio.

---