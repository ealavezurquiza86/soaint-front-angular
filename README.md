# Frontend Angular — Transacciones Soaint

Aplicación web **Angular 20.3** (CLI **20.3.34**) del ecosistema Soaint. Es la capa de **UI/UX** para:

- Iniciar sesión contra **API_A** (JWT).
- Registrar transacciones cifrando el `secreto` con **AES-256** en el navegador antes de enviarlo.
- Listar transacciones paginadas y cancelar las aprobadas.

El código de la aplicación está en [`frontend-transacciones/`](frontend-transacciones/).

## Requisitos

| Dependencia | Versión / notas |
|-------------|-----------------|
| Node.js | **22 o superior** (recomendado para Angular 20) |
| npm | Incluido con Node.js; se usa para instalar las librerías del proyecto |
| API_A | Debe estar en `http://localhost:8081` |
| API_B | Debe estar en ejecución (el navegador no la llama de forma directa; la consume API_A) |

La URL de API_A y la clave AES están en `frontend-transacciones/src/environments/environment.ts`:

- `apiUrl`: `http://localhost:8081/api`
- `aesSecretKey`: debe coincidir con `AES_SECRET_KEY` de API_A

## Instalación de librerías (obligatorio)

Antes de arrancar o compilar, hay que instalar las dependencias del `package.json` **con npm**:

```bash
cd front-angular/frontend-transacciones
npm install
```

Ese comando descarga las librerías de Angular, RxJS, crypto-js, Tailwind y el resto de paquetes listados en `package.json` hacia `node_modules`. Debe ejecutarse al menos una vez (y de nuevo si cambia `package.json`).

## Comandos

```bash
cd front-angular/frontend-transacciones

# 1) Instalar librerías (obligatorio la primera vez)
npm install

# 2) Servidor de desarrollo → http://localhost:4200
npm start
# equivalente: npx ng serve --port 4200

# Compilar para producción
npm run build
```

Usuarios de prueba (los crea el seeder de API_A al arrancar):

| Usuario | Contraseña |
|---------|------------|
| `admin` | `Wq7@nF4kLm2!` |
| `operador` | `Zx9$pT3vHr6!` |

## Qué hace la interfaz

| Ruta | Descripción |
|------|-------------|
| `/login` | Usuario y contraseña |
| `/registrar` | Formulario de operación, importe, cliente y secreto (se cifra con AES antes del POST) |
| `/listado` | Tabla paginada y cancelación |

La sesión se guarda en `sessionStorage` (`soaint_jwt`). Las rutas privadas usan `authGuard` (`GET /api/auth/validate`) e interceptores JWT / 401.

## Documentación adicional

| Archivo | Contenido |
|---------|-----------|
| `tareas_cursor_angular.md` | Plan de implementación del frontend |
| `frontend-transacciones/README.md` | Instrucciones del proyecto Angular |
