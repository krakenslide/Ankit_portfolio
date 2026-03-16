# Ankit Mukhopadhyay — Portfolio

Built with **React 18 + TypeScript + Vite + Tailwind CSS + @xyflow/react + Three.js**

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Stack

| Concern | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Styling | Tailwind CSS v3 |
| Node graph | @xyflow/react v12 (React Flow) |
| 3D / WebGL | Three.js + @react-three/fiber |
| Animation | Framer Motion + CSS |

## React Flow Usage

The **Skills** section (`src/components/sections/Skills.tsx`) implements a fully interactive
tech-stack graph using `@xyflow/react`:

- Custom `SkillNode` type with group-coloured styling
- 20 nodes across 4 clusters: Frontend, Backend, DevOps/QA, Legacy Stack
- 22 edges with animated dash flow per cluster colour
- `onNodeMouseEnter` / `onNodeMouseLeave` highlight connected edges
- `<MiniMap>`, `<Controls>`, `<Panel>` (legend), `<Background>`
- `useNodesState`, `useEdgesState`, `useReactFlow` hooks
- Drag nodes, scroll to zoom, click to select

## Three.js Usage

- **Hero**: Magnetic repulsion particle grid — 4000+ particles flee the cursor and spring back
- **Contact**: Undulating wire terrain — sine-wave vertex displacement on a PlaneGeometry
