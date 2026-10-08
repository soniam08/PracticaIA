# 👥 Panel de Gestión de Usuarios - Prácticas Frontend

Panel administrativo interactivo desarrollado como práctica técnica con **React**, **TypeScript** y la librería de componentes **Ant Design (antd)**, estructurado con **Vite**.

---

## 🚀 Características del Proyecto

- **CRUD de Usuarios:** Creación y visualización de registros con validaciones en formulario modal (`Modal`, `Form`, `Input`, `Select`).
- **Eliminación Segura:** Confirmación previa a la eliminación mediante diálogos contextuales (`Popconfirm`).
- **Búsqueda en Tiempo Real:** Filtrado simultáneo insensible a mayúsculas/minúsculas por coincidencia de texto en nombre o email (`Input.Search`).
- **Filtro por Roles:** Segmentación de usuarios por perfiles (`Admin`, `Editor`, `Viewer`) mediante selectores dinámicos.
- **Diseño Estable:** Columnas con anchos fijos y formateo visual con etiquetas de color (`Tag`) para evitar desajustes durante el filtrado.
- **Persistencia Local:** Sincronización automática del estado en el navegador mediante `localStorage` y `useEffect`.

---

## 🛠️ Stack Tecnológico

- **Frontend Core:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Librería de Componentes:** [Ant Design](https://ant.design/) (`antd`)
- **Control de Versiones:** Git & GitHub

---

## 📦 Puesta en Marcha Local

Para clonar y ejecutar este proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/soniam08/PracticaIA.git](https://github.com/soniam08/PracticaIA.git)
   cd PracticaIA
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. Abrir en el navegador la dirección local indicada por la consola (habitualmente `http://localhost:5173` o `http://localhost:5174`).