# Demo SSO Federado con Keycloak y Node.js

Este demo muestra cómo implementar **Single Sign-On (SSO)** federado usando **Keycloak** como Identity Provider y dos aplicaciones Node.js independientes protegidas por OpenID Connect.

---

## Prerrequisitos

- [Node.js](https://nodejs.org/) instalado
- [Docker](https://www.docker.com/) instalado (para ejecutar Keycloak)
- Puertos 8080, 3001 y 3002 libres

---

## 1. Levantar Keycloak con Docker

```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:24.0.3 start-dev
```

- Accede al panel: http://localhost:8080
- Usuario: admin / Contraseña: admin


## 2. Configuración en Keycloak

Sigue estos pasos para configurar Keycloak y habilitar SSO entre dos aplicaciones:

### Crear un nuevo Realm

- **Nombre del Realm**: `DemoSSO`

### Crear dos Clients

#### Client: `app1`

- **Root URL**: `http://localhost:3001`  
- **Valid Redirect URI**: `http://localhost:3001/*`  
- **Access Type**: `confidential`

#### Client: `app2`

- **Root URL**: `http://localhost:3002`  
- **Valid Redirect URI**: `http://localhost:3002/*`  
- **Access Type**: `confidential`

### Crear un usuario de prueba

- **Username**: `user1`  
- **Contraseña**: `password`  

### Descargar configuración OIDC

Para cada Client:

1. Ve a la pestaña `Installation`.
2. Selecciona el formato `Keycloak OIDC JSON`.
3. Descarga el archivo `keycloak.json`.
4. Coloca el archivo en la carpeta correspondiente:
   - `app1/keycloak.json`
   - `app2/keycloak.json`


## 3. Instalación de dependencias
En cada app ejecuta:

```bash
cd app1
npm init -y
npm install express keycloak-connect session-file-store express-session
cd ../app2
npm init -y
npm install express keycloak-connect session-file-store express-session
```

## 4. Ejecutar ambas aplicaciones
Abre dos terminales, en cada una ejecuta:

```bash
cd app1 && node app.js
cd app2 && node app.js
```
## 5. Probar el SSO

1. Ve a `http://localhost:3001` y accede a `/private`.
   - Keycloak te pedirá login. Usa las credenciales:
     - **Username**: `user1`
     - **Contraseña**: `password`

2. Ve a `http://localhost:3002` y accede a `/private`.
   - Ya estarás autenticado y no te pedirá login nuevamente.

3. Observa el contenido del token JWT para ver los datos del usuario autenticado.

4. Prueba la ruta `/logout` y vuelve a ingresar para ver el flujo completo.

## 6. ¿Cómo funciona el demo?

- Keycloak centraliza la autenticación y el control de sesiones para ambas aplicaciones.
- El usuario solo inicia sesión una vez y puede acceder a ambos sistemas.
- Las aplicaciones no manejan contraseñas directamente, solo tokens OIDC.
- Puedes agregar roles y políticas de acceso desde el panel de administración de Keycloak.


