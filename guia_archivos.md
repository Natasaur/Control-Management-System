
# 🧭 Guía de Archivos del Proyecto `Software_v2`

## 📁 Raíz del Proyecto
- `.gitignore`: Define qué archivos/carpeta no deben subirse al repositorio.
- `package.json` y `package-lock.json`: Contienen la configuración de npm, dependencias del proyecto.
- `estructura.txt`: Archivo generado con el listado de carpetas.
- `LICENSE`: Archivo de licencia del proyecto.

---

## 📁 `.vscode/`
- `settings.json`: Configuraciones específicas del editor VS Code (formateo, indentación, etc.).

---

## 📁 `Código Backend/`
Aquí se encuentra el backend de la aplicación.

### 📁 `Código Backend/server/`
- `index.js`: Punto de entrada del servidor.
- `app.js`: Configuración principal de la aplicación Express (middlewares, rutas).
- `db.js`: Configuración de conexión a la base de datos.
- `.env`: Variables de entorno (credenciales, URL de DB, claves de API).
- `constants.js`: Constantes globales del sistema.
- `package.json`: Dependencias del backend.
- `.yarnrc.yml` / `yarn.lock`: Configuración y bloqueo de versiones si se usa Yarn.

#### 📁 `controllers/`
Contiene la lógica de negocio de cada módulo:
- `alertas.js`: Controla el envío y gestión de alertas.
- `alumnos.js`: CRUD para los alumnos.
- `asistencias.js`: Control de asistencia.
- `auth.js`: Lógica de autenticación (login, tokens).
- `fechas_asistencias.js`, `grupos.js`, `usuarios.js`: Control de fechas, grupos e información de usuarios.

#### 📁 `middleware/`
- `auth.js`: Middleware para proteger rutas con autenticación (por ejemplo, validación de JWT).

#### 📁 `models/`
Define los modelos de base de datos:
- `alumnos.js`, `usuarios.js`, etc.: Esquemas y estructuras de las tablas.

#### 📁 `node_modules/`
Carpeta con todas las dependencias de npm/yarn. **No debe editarse manualmente.**

---

## 🛠 Recomendaciones para completar esta guía
Puedes añadir descripciones similares para carpetas adicionales como:
- `/frontend/` si la tienes (HTML, CSS, JS del cliente).
- `/uploads/` si hay carga de archivos.
- `/docs/` si hay documentación adicional.

---

## ✅ Sugerencia de archivo `guia_archivos.md`
Guarda esta información en un archivo Markdown dentro del repositorio (por ejemplo: `docs/guia_archivos.md` o directamente `GUÍA.md`) para que otros puedan leerlo fácilmente desde GitHub o VS Code.
