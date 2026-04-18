# Empresa Tecnologia

Aplicacion web para la gestion de empleados construida con React, TypeScript y Vite. El proyecto permite registrar, editar, eliminar, listar y filtrar empleados, con persistencia en Firebase Realtime Database y autenticacion con Firebase Authentication.

## Caracteristicas

- Gestion completa de empleados.
- Filtros de busqueda y paginacion en la lista.
- Panel con metricas resumidas.
- Notificaciones visuales para operaciones exitosas y errores.
- Cambio de tema visual.
- Autenticacion con correo y contrasena.
- Datos aislados por usuario autenticado en Realtime Database.
- Despliegue preparado para GitHub Pages.

## Tecnologias

- React 19
- TypeScript
- Vite
- Firebase Authentication
- Firebase Realtime Database
- Framer Motion
- ESLint

## Requisitos

- Node.js 20 o superior recomendado.
- npm 10 o superior recomendado.
- Un proyecto de Firebase con Authentication y Realtime Database habilitados.

## Instalacion

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto con estas variables:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

Estas variables se consumen desde [src/config/firebase-config.ts](src/config/firebase-config.ts).

## Configuracion de Firebase

### Authentication

En Firebase Console:

1. Entra a Authentication.
2. Activa el proveedor Email/Password.
3. Crea usuarios manualmente o implementa registro desde la app.
4. Agrega `espinosaelena1644.github.io` en Authorized domains si vas a usar GitHub Pages.

### Realtime Database

La aplicacion guarda los empleados por usuario autenticado en la ruta:

```text
employees/{uid}/{employeeId}
```

Publica reglas equivalentes a las definidas en [src/config/database.rules.json](src/config/database.rules.json):

```json
{
  "rules": {
    "employees": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

## Ejecucion en desarrollo

```bash
npm run dev
```

La aplicacion quedara disponible en la URL local que imprima Vite.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la build de produccion.
- `npm run preview`: sirve localmente la build generada.
- `npm run lint`: ejecuta ESLint.
- `npm run deploy`: publica la carpeta `dist` en la rama `gh-pages`.

## Despliegue en GitHub Pages

El proyecto ya esta configurado para desplegarse en GitHub Pages con la base:

```ts
base: "/empresa-tecnologia/";
```

Pasos:

1. Asegura que el repositorio este publicado en GitHub.
2. Ejecuta la build y el deploy:

```bash
npm run deploy
```

3. En GitHub, ve a Settings > Pages.
4. Selecciona la rama `gh-pages` y la carpeta `/ (root)`.

La URL esperada es:

```text
https://espinosaelena1644.github.io/empresa-tecnologia/
```

## Estructura principal

```text
src/
	components/
		common/
		dashboard/
		employee_form/
		employee_item/
		employee_list/
	config/
		firebase-config.ts
		database.rules.json
	context/
		EmployeeContext.tsx
	types/
		employee.ts
```

## Flujo de autenticacion y datos

- El login se realiza con Firebase Authentication desde [src/components/common/AuthControls.tsx](src/components/common/AuthControls.tsx).
- El estado de sesion se observa con `onAuthStateChanged`.
- Los empleados se leen y escriben segun el `uid` del usuario autenticado en [src/context/EmployeeContext.tsx](src/context/EmployeeContext.tsx).
- Si no hay sesion iniciada, las operaciones de alta, edicion y eliminacion se bloquean.

## Notas tecnicas

- La aplicacion usa cache local por usuario para fallback offline basico.
- El proyecto utiliza animaciones con Framer Motion para la entrada de componentes.
- La build actual puede mostrar advertencias por tamano de bundle, pero no bloquea el despliegue.

## Mejoras pendientes sugeridas

- Registro de usuarios desde la app.
- Recuperacion de contrasena.
- Verificacion de correo.
- Roles de usuario o administrador.
- Optimizacion del bundle con code splitting.

## Autor

Proyecto academico de gestion de empleados.
