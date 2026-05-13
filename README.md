# ESTIMADORTTIEMPO — PERT / CPM

Monorepo con **dos aplicaciones** en React y Vite orientadas a **planificación de red**: dependencias FS, holgura, camino crítico y visualización.

## Contenido del repositorio

| Carpeta | Descripción |
|--------|-------------|
| **Raíz** (`estimadorttiempo`) | App principal: lienzo **React Flow** (@xyflow), panel lateral, CPM con **Zustand**, layout **Dagre** (izquierda → derecha), vistas Gantt sintética y analítica. |
| **`nuevopert/`** | Variante **tabular**: filas tipo Excel, motor CPM propio, diagrama **SVG** (AoN por capas; vista **AoA** fija eventos 1–8 si el proyecto coincide con el clásico A–H), botón **ACTUALIZAR** para aplicar cambios al cálculo. |

## Requisitos

- **Node.js** 20+ (recomendado LTS)
- **npm** 10+

## App principal (raíz)

```bash
npm install
npm run dev
```

Por defecto Vite usa el **puerto 5174** y `host: true` (acceso por IP en la red local). Ajuste en `vite.config.ts`.

```bash
npm run build   # producción
npm run lint    # ESLint
npm run preview # sirve ./dist
```

## App `nuevopert`

```bash
cd nuevopert
npm install
npm run dev
```

Puerto habitual de Vite: **5173** (si está ocupado, el siguiente libre).

```bash
npm run build
npm run lint
```

## Atajos útiles (app principal)

- **L** (con foco fuera de inputs): **Auto-layout** del grafo.
- Cabecera: botón de auto-layout y modos de vista (Lógica, Gantt, etc.).

## Estructura relevante (raíz)

```
src/
  components/   # UI, FlowCanvas, layout, nodos
  engine/       # cpm.ts, dagreLayout.ts
  store/        # useProjectStore (estado global)
nuevopert/src/  # segunda app (tabla + SVG + AoA8)
```

## Licencia

Privado / uso interno — definir licencia si el repositorio pasa a ser público.
