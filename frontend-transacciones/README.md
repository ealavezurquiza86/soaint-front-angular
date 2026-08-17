# Frontend de transacciones (Angular)

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) versión **20.3.34**. Interfaz de login, registro de transacciones (cifrado AES) y listado con cancelación, conectada a API_A.

## Requisitos

- Node.js **22** o superior
- **npm** (incluido con Node.js)

## Instalación de librerías con npm

Es **obligatorio** instalar las librerías del proyecto con npm antes de ejecutarlo:

```bash
cd front-angular/frontend-transacciones
npm install
```

Este comando lee `package.json` e instala Angular, RxJS, crypto-js, Tailwind y el resto de dependencias en `node_modules`.

## Cómo ejecutarlo

```bash
# Instalar librerías (si aún no se hizo)
npm install

# Servidor de desarrollo → http://localhost:4200
npm start
```

También se puede usar:

```bash
npx ng serve --port 4200
```

La aplicación se recarga sola al guardar cambios. Hace falta que **API_A** esté en `http://localhost:8081`.

## Compilar

```bash
npm run build
```

El resultado queda en la carpeta `dist/`.

## Autenticación

- Sesión: JWT en `sessionStorage` (`soaint_jwt`).
- `authGuard` (asíncrono): si hay token, llama `GET /api/auth/validate`; si falla, limpia la sesión y va a `/login`.
- `jwtInterceptor`: añade `Authorization: Bearer …`.
- `authErrorInterceptor`: ante 401/403 (excepto login/validate) cierra sesión y redirige a `/login`.
- URL base: `environment.apiUrl` = `http://localhost:8081/api`.

Usuarios de prueba (seeder de API_A): `admin` / `Wq7@nF4kLm2!` y `operador` / `Zx9$pT3vHr6!`.
