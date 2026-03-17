import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type NodeProps,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  SiReact, SiTypescript, SiJavascript, SiAngular,
  SiNodedotjs, SiExpress, SiPostgresql, SiMongodb,
  SiCypress, SiGitlab, SiJira, SiTailwindcss,
  SiPostman, SiDotnet, SiMultisim
} from 'react-icons/si'
import {
  TbApi, TbBrandHtml5, TbTestPipe, TbGitBranch, TbComponents,
} from 'react-icons/tb'

// ─── colour palette ───────────────────────────────────────────────────────────
const GROUP_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  core: { color: '#c8f542', bg: 'rgba(200,245,66,0.08)', border: 'rgba(200,245,66,0.3)' },
  backend: { color: '#3de8c8', bg: 'rgba(61,232,200,0.08)', border: 'rgba(61,232,200,0.3)' },
  devops: { color: '#f5a742', bg: 'rgba(245,167,66,0.08)', border: 'rgba(245,167,66,0.3)' },
  legacy: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.3)' },
}

// ─── icon map ─────────────────────────────────────────────────────────────────
const NODE_ICONS: Record<string, React.ReactElement> = {
  js: <SiJavascript size={13} />,
  ts: <SiTypescript size={13} />,
  csharp: <SiDotnet size={13} />,
  reactjs: <SiReact size={14} />,
  angular: <SiAngular size={13} />,
  html: <TbBrandHtml5 size={13} />,
  tailwind: <SiTailwindcss size={13} />,
  rf: <TbComponents size={13} />,
  nodejs: <SiNodedotjs size={14} />,
  dotnet: <SiDotnet size={14} />,
  express: <SiExpress size={13} />,
  rest: <TbApi size={13} />,
  microsvcs: <SiMultisim size={13} />,
  postgres: <SiPostgresql size={13} />,
  mongo: <SiMongodb size={13} />,
  postman: <SiPostman size={13} />,
  cypress: <SiCypress size={14} />,
  xunit: <TbTestPipe size={13} />,
  gitlab: <SiGitlab size={14} />,
  cicd: <TbGitBranch size={14} />,
  jira: <SiJira size={13} />,
}

// ─── invisible handle style ───────────────────────────────────────────────────
const HIDDEN: React.CSSProperties = {
  position: 'absolute', width: 1, height: 1,
  minWidth: 0, minHeight: 0,
  background: 'transparent', border: 'none',
  borderRadius: 0, visibility: 'hidden', pointerEvents: 'none',
}

// ─── custom node ──────────────────────────────────────────────────────────────
type SkillData = {
  label: string
  group: keyof typeof GROUP_STYLE
  hub?: boolean
  category?: string
}

function SkillNode({ id, data, selected }: NodeProps<Node<SkillData>>) {
  const g = GROUP_STYLE[data.group] ?? GROUP_STYLE.core
  const icon = NODE_ICONS[id]

  return (
    <div
      style={{
        background: selected ? g.bg.replace('0.08', '0.18') : g.bg,
        border: `1px solid ${selected ? g.color : g.border}`,
        boxShadow: selected ? `0 0 20px ${g.color}33` : 'none',
        borderRadius: data.hub ? 8 : 6,
        padding: data.hub ? '9px 14px' : '7px 11px',
        backdropFilter: 'blur(8px)',
        cursor: 'grab',
        transition: 'border-color .2s, box-shadow .2s, transform .15s',
        userSelect: 'none',
        minWidth: data.hub ? 118 : 92,
        position: 'relative',
      }}
      className="hover:scale-105"
    >
      <Handle id="l" type="target" position={Position.Left} style={HIDDEN} />
      <Handle id="r" type="source" position={Position.Right} style={HIDDEN} />
      <Handle id="t" type="target" position={Position.Top} style={HIDDEN} />
      <Handle id="b" type="source" position={Position.Bottom} style={HIDDEN} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {icon && (
          <span style={{ color: data.hub ? g.color : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {icon}
          </span>
        )}
        {data.hub && (
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.color, flexShrink: 0, boxShadow: `0 0 6px ${g.color}`, display: 'inline-block' }} />
        )}
        <span style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: data.hub ? 11 : 10,
          fontWeight: data.hub ? 600 : 400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: data.hub ? g.color : 'rgba(255,255,255,0.72)',
          whiteSpace: 'nowrap',
        }}>
          {data.label}
        </span>
      </div>

      {data.hub && data.category && (
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: g.color, opacity: 0.5, marginTop: 3, paddingLeft: 1 }}>
          {data.category}
        </div>
      )}
    </div>
  )
}

const nodeTypes = { skill: SkillNode }

// ─── nodes ────────────────────────────────────────────────────────────────────
const INIT_NODES: Node<SkillData>[] = [
  { id: 'js', type: 'skill', position: { x: 340, y: 0 }, data: { label: 'JavaScript', group: 'core', hub: true, category: 'Language' } },
  { id: 'ts', type: 'skill', position: { x: 560, y: 0 }, data: { label: 'TypeScript', group: 'core', hub: true, category: 'Language' } },
  { id: 'csharp', type: 'skill', position: { x: 780, y: 0 }, data: { label: 'C# .NET', group: 'legacy', hub: true, category: 'Language' } },
  { id: 'reactjs', type: 'skill', position: { x: 80, y: 160 }, data: { label: 'ReactJS', group: 'core', hub: true, category: 'Frontend' } },
  { id: 'angular', type: 'skill', position: { x: 80, y: 260 }, data: { label: 'Angular', group: 'legacy', hub: true, category: 'Frontend' } },
  { id: 'html', type: 'skill', position: { x: -165, y: 140 }, data: { label: 'HTML / CSS', group: 'core' } },
  { id: 'tailwind', type: 'skill', position: { x: -165, y: 215 }, data: { label: 'Tailwind', group: 'core' } },
  { id: 'rf', type: 'skill', position: { x: -165, y: 290 }, data: { label: 'React Flow', group: 'core' } },
  { id: 'nodejs', type: 'skill', position: { x: 760, y: 160 }, data: { label: 'Node.js', group: 'backend', hub: true, category: 'Backend' } },
  { id: 'dotnet', type: 'skill', position: { x: 760, y: 260 }, data: { label: '.NET Core', group: 'legacy', hub: true, category: 'Backend' } },
  { id: 'express', type: 'skill', position: { x: 980, y: 100 }, data: { label: 'Express', group: 'backend' } },
  { id: 'rest', type: 'skill', position: { x: 980, y: 175 }, data: { label: 'REST APIs', group: 'backend' } },
  { id: 'microsvcs', type: 'skill', position: { x: 980, y: 250 }, data: { label: 'Microsvcs', group: 'legacy' } },
  { id: 'postgres', type: 'skill', position: { x: 1185, y: 140 }, data: { label: 'PostgreSQL', group: 'backend' } },
  { id: 'mongo', type: 'skill', position: { x: 1185, y: 215 }, data: { label: 'MongoDB', group: 'backend' } },
  { id: 'postman', type: 'skill', position: { x: 1185, y: 290 }, data: { label: 'Postman', group: 'backend' } },
  { id: 'cypress', type: 'skill', position: { x: 80, y: 430 }, data: { label: 'Cypress', group: 'devops', hub: true, category: 'Testing' } },
  { id: 'xunit', type: 'skill', position: { x: 300, y: 430 }, data: { label: 'xUnit', group: 'devops' } },
  { id: 'gitlab', type: 'skill', position: { x: 520, y: 430 }, data: { label: 'GitLab', group: 'devops', hub: true, category: 'CI / CD' } },
  { id: 'cicd', type: 'skill', position: { x: 740, y: 430 }, data: { label: 'CI / CD', group: 'devops', hub: true, category: 'Pipeline' } },
  { id: 'jira', type: 'skill', position: { x: 960, y: 430 }, data: { label: 'Jira', group: 'devops' } },
]

// ─── edges ────────────────────────────────────────────────────────────────────
const mkEdge = (
  id: string,
  source: string, sourceHandle: string,
  target: string, targetHandle: string,
  group: keyof typeof GROUP_STYLE,
  animated = true,
): Edge => ({
  id, source, sourceHandle, target, targetHandle, animated,
  style: { stroke: GROUP_STYLE[group].color, opacity: 0.28, strokeWidth: 1.5 },
  type: 'smoothstep',
})

const INIT_EDGES: Edge[] = [
  mkEdge('e-js-ts', 'js', 'r', 'ts', 'l', 'core'),
  mkEdge('e-js-react', 'js', 'b', 'reactjs', 't', 'core'),
  mkEdge('e-ts-react', 'ts', 'b', 'reactjs', 't', 'core'),
  mkEdge('e-ts-ang', 'ts', 'b', 'angular', 't', 'core'),
  mkEdge('e-js-node', 'js', 'b', 'nodejs', 't', 'core'),
  mkEdge('e-ts-node', 'ts', 'b', 'nodejs', 't', 'core', false),
  mkEdge('e-cs-dotnet', 'csharp', 'b', 'dotnet', 't', 'legacy'),
  mkEdge('e-html-r', 'html', 'r', 'reactjs', 'l', 'core'),
  mkEdge('e-tw-r', 'tailwind', 'r', 'reactjs', 'l', 'core'),
  mkEdge('e-rf-r', 'rf', 'r', 'reactjs', 'l', 'core'),
  mkEdge('e-react-node', 'reactjs', 'r', 'nodejs', 'l', 'backend'),
  mkEdge('e-ang-dot', 'angular', 'r', 'dotnet', 'l', 'legacy'),
  mkEdge('e-node-exp', 'nodejs', 'r', 'express', 'l', 'backend'),
  mkEdge('e-node-rst', 'nodejs', 'r', 'rest', 'l', 'backend'),
  mkEdge('e-dot-ms', 'dotnet', 'r', 'microsvcs', 'l', 'legacy'),
  mkEdge('e-dot-rst', 'dotnet', 'r', 'rest', 'l', 'backend', false),
  mkEdge('e-rst-pg', 'rest', 'r', 'postgres', 'l', 'backend'),
  mkEdge('e-rst-mg', 'rest', 'r', 'mongo', 'l', 'backend'),
  mkEdge('e-rst-pm', 'rest', 'r', 'postman', 'l', 'backend'),
  mkEdge('e-react-cy', 'reactjs', 'b', 'cypress', 't', 'devops'),
  mkEdge('e-ang-cy', 'angular', 'b', 'cypress', 't', 'devops', false),
  mkEdge('e-dot-xu', 'dotnet', 'b', 'xunit', 't', 'devops'),
  mkEdge('e-cy-gl', 'cypress', 'r', 'gitlab', 'l', 'devops'),
  mkEdge('e-xu-gl', 'xunit', 'r', 'gitlab', 'l', 'devops'),
  mkEdge('e-gl-ci', 'gitlab', 'r', 'cicd', 'l', 'devops'),
  mkEdge('e-ci-ji', 'cicd', 'r', 'jira', 'l', 'devops', false),
]

// ─── auto-fit ─────────────────────────────────────────────────────────────────
function AutoFit() {
  const { fitView } = useReactFlow()
  useCallback(() => {
    const t = setTimeout(() => fitView({ padding: 0.12, duration: 500 }), 100)
    return () => clearTimeout(t)
  }, [fitView])()
  return null
}

// ─── legend (now a plain div, positioned absolute top-left of container) ──────
const LEGEND_ITEMS = [
  ['core', 'Frontend / JS'],
  ['backend', 'Backend'],
  ['devops', 'DevOps / QA'],
  ['legacy', 'GEP Stack (C# / Angular)'],
] as const

function Legend() {
  return (
    <div
      style={{
        background: 'rgba(6,6,6,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 6,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        pointerEvents: 'none',
      }}
    >
      {LEGEND_ITEMS.map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: GROUP_STYLE[key].color, flexShrink: 0,
            boxShadow: `0 0 5px ${GROUP_STYLE[key].color}`,
          }} />
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
            {label}
          </span>
        </div>
      ))}
      <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', marginTop: 4, letterSpacing: '0.08em' }}>
        drag to pan · pinch to zoom · hover to highlight
      </div>
    </div>
  )
}

// ─── graph (desktop) ─────────────────────────────────────────────────────────
function SkillGraph() {
  const [nodes, , onNodesChange] = useNodesState(INIT_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(INIT_EDGES)

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          style: {
            ...e.style,
            opacity: e.source === node.id || e.target === node.id ? 0.9 : 0.06,
            strokeWidth: e.source === node.id || e.target === node.id ? 2.5 : 1.5,
          },
        }))
      )
    },
    [setEdges]
  )

  const onNodeMouseLeave = useCallback(() => {
    setEdges((eds) =>
      eds.map((e) => ({ ...e, style: { ...e.style, opacity: 0.28, strokeWidth: 1.5 } }))
    )
  }, [setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      fitView
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.3}
      maxZoom={2.5}
      zoomOnScroll={false}
      zoomOnPinch={true}
      panOnScroll={false}
      panOnDrag={true}
      preventScrolling={false}
      proOptions={{ hideAttribution: true }}
      style={{ background: 'transparent' }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(255,255,255,0.08)" />
      <Controls showInteractive={false} />
      {/* Legend lives in Panel so it stays fixed relative to the viewport inside RF */}
      <Panel position="top-left" style={{ margin: 12 }}>
        <Legend />
      </Panel>
      <AutoFit />
    </ReactFlow>
  )
}

// ─── mobile alternative — grouped chips ──────────────────────────────────────
const MOBILE_GROUPS: {
  label: string
  group: keyof typeof GROUP_STYLE
  items: { id: string; label: string }[]
}[] = [
    {
      label: 'Languages',
      group: 'core',
      items: [
        { id: 'js', label: 'JavaScript' },
        { id: 'ts', label: 'TypeScript' },
        { id: 'csharp', label: 'C# .NET' },
      ],
    },
    {
      label: 'Frontend',
      group: 'core',
      items: [
        { id: 'reactjs', label: 'ReactJS' },
        { id: 'angular', label: 'Angular' },
        { id: 'html', label: 'HTML / CSS' },
        { id: 'tailwind', label: 'Tailwind' },
        { id: 'rf', label: 'React Flow' },
      ],
    },
    {
      label: 'Backend',
      group: 'backend',
      items: [
        { id: 'nodejs', label: 'Node.js' },
        { id: 'dotnet', label: '.NET Core' },
        { id: 'express', label: 'Express' },
        { id: 'rest', label: 'REST APIs' },
        { id: 'microsvcs', label: 'Microsvcs' },
      ],
    },
    {
      label: 'Data',
      group: 'backend',
      items: [
        { id: 'postgres', label: 'PostgreSQL' },
        { id: 'mongo', label: 'MongoDB' },
        { id: 'postman', label: 'Postman' },
      ],
    },
    {
      label: 'DevOps / QA',
      group: 'devops',
      items: [
        { id: 'cypress', label: 'Cypress' },
        { id: 'xunit', label: 'xUnit' },
        { id: 'gitlab', label: 'GitLab' },
        { id: 'cicd', label: 'CI / CD' },
        { id: 'jira', label: 'Jira' },
      ],
    },
  ]

function MobileSkills() {
  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-2">
      {MOBILE_GROUPS.map(({ label, group, items }) => {
        const g = GROUP_STYLE[group]
        return (
          <div key={label}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-3">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.color, flexShrink: 0, boxShadow: `0 0 5px ${g.color}`, display: 'inline-block' }} />
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: g.color }}>
                {label}
              </span>
              <span className="flex-1 h-px" style={{ background: g.border }} />
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {items.map(({ id, label: itemLabel }) => (
                <div
                  key={id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: g.bg,
                    border: `1px solid ${g.border}`,
                    borderRadius: 6,
                    padding: '6px 10px',
                  }}
                >
                  {NODE_ICONS[id] && (
                    <span style={{ color: g.color, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {NODE_ICONS[id]}
                    </span>
                  )}
                  <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                    {itemLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── responsive wrapper — swaps between RF and mobile view ───────────────────
function SkillGraphResponsive() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isMobile) {
    return (
      <div className="border-t border-b border-white/[0.07] bg-white/[0.012] mt-10">
        <MobileSkills />
      </div>
    )
  }

  return (
    <div className="reveal mt-10 h-[500px] relative border-t border-b border-white/[0.07] bg-white/[0.012]">
      <div className="max-w-[1280px] mx-auto h-full px-12">
        <ReactFlowProvider>
          <SkillGraph />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

// ─── section ─────────────────────────────────────────────────────────────────
// ── FRONTEND: Hexagon cracks open, inner layers expand outward ────────────────
function IconFrontend({ hovered }: { hovered: boolean }) {
  // 3 concentric hexagons that scale outward on hover
  const hexPoints = (cx: number, cy: number, r: number) => {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 30) * (Math.PI / 180)
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
    }).join(' ')
  }

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="overflow-visible">
      {/* Outer hex — expands and fades on hover */}
      <polygon
        points={hexPoints(18, 18, 16)}
        stroke="#c8f542" strokeWidth="0.8" fill="none"
        strokeOpacity={hovered ? 0.15 : 0}
        style={{
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transformOrigin: '18px 18px',
          transition: 'transform 0.6s ease, stroke-opacity 0.4s ease',
        }}
      />
      {/* Middle hex — rotates 30deg */}
      <polygon
        points={hexPoints(18, 18, 11)}
        stroke="#c8f542" strokeWidth="1" fill="rgba(200,245,66,0.04)"
        style={{
          transform: hovered ? 'rotate(30deg) scale(1.05)' : 'rotate(0deg) scale(1)',
          transformOrigin: '18px 18px',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      {/* Inner hex — counter-rotates */}
      <polygon
        points={hexPoints(18, 18, 6)}
        stroke="#c8f542" strokeWidth="1.2"
        fill={hovered ? 'rgba(200,245,66,0.2)' : 'rgba(200,245,66,0.08)'}
        style={{
          transform: hovered ? 'rotate(-30deg)' : 'rotate(0deg)',
          transformOrigin: '18px 18px',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.4s ease',
        }}
      />
      {/* 6 spokes radiating out — extend on hover */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 30) * (Math.PI / 180)
        const x1 = 18 + 6 * Math.cos(a)
        const y1 = 18 + 6 * Math.sin(a)
        const x2 = 18 + (hovered ? 14 : 10) * Math.cos(a)
        const y2 = 18 + (hovered ? 14 : 10) * Math.sin(a)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#c8f542" strokeWidth="0.8"
            strokeOpacity={hovered ? 0.6 : 0.2}
            style={{ transition: `all 0.5s ease ${i * 40}ms` }}
          />
        )
      })}
      {/* Centre dot — pulses */}
      <circle cx="18" cy="18"
        r={hovered ? 2.5 : 1.5}
        fill="#c8f542"
        style={{ transition: 'r 0.3s ease' }}
      />
    </svg>
  )
}

// ── BACKEND: CPU with data packets travelling inward along wires ──────────────
function IconBackend({ hovered }: { hovered: boolean }) {
  // 8 data lines: cardinal + diagonal
  const lines = [
    { x1: 18, y1: 2, x2: 18, y2: 13, px: 18, py: 6 }, // top
    { x1: 18, y1: 23, x2: 18, y2: 34, px: 18, py: 30 }, // bottom
    { x1: 2, y1: 18, x2: 13, y2: 18, px: 6, py: 18 }, // left
    { x1: 23, y1: 18, x2: 34, y2: 18, px: 30, py: 18 }, // right
    { x1: 4, y1: 4, x2: 13, y2: 13, px: 7, py: 7 }, // top-left
    { x1: 32, y1: 4, x2: 23, y2: 13, px: 29, py: 7 }, // top-right
    { x1: 4, y1: 32, x2: 13, y2: 23, px: 7, py: 29 }, // bottom-left
    { x1: 32, y1: 32, x2: 23, y2: 23, px: 29, py: 29 }, // bottom-right
  ]

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="overflow-visible">
      {/* CPU chip */}
      <rect x="13" y="13" width="10" height="10" rx="1.5"
        stroke="#3de8c8" strokeWidth="1.2"
        fill={hovered ? 'rgba(61,232,200,0.25)' : 'rgba(61,232,200,0.08)'}
        style={{ transition: 'fill 0.3s ease' }}
      />
      {/* CPU grid lines */}
      <line x1="16" y1="13" x2="16" y2="23" stroke="#3de8c8" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="20" y1="13" x2="20" y2="23" stroke="#3de8c8" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="13" y1="16" x2="23" y2="16" stroke="#3de8c8" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="13" y1="20" x2="23" y2="20" stroke="#3de8c8" strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Data wires */}
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="#3de8c8" strokeWidth="0.8"
          strokeOpacity={hovered ? 0.5 : 0.18}
          style={{ transition: `stroke-opacity 0.3s ease ${i * 30}ms` }}
        />
      ))}

      {/* Packets — move toward CPU on hover */}
      {lines.map((l, i) => (
        <circle key={i}
          cx={hovered ? l.x2 : l.px}
          cy={hovered ? l.y2 : l.py}
          r={i < 4 ? 1.5 : 1.2}
          fill="#3de8c8"
          fillOpacity={hovered ? 1 : 0.3}
          style={{ transition: `cx 0.5s ease ${i * 50}ms, cy 0.5s ease ${i * 50}ms, fill-opacity 0.3s ease ${i * 50}ms` }}
        />
      ))}

      {/* Core glow */}
      <circle cx="18" cy="18" r={hovered ? 4 : 2}
        fill="#3de8c8" fillOpacity={hovered ? 0.35 : 0}
        style={{ transition: 'r 0.4s ease, fill-opacity 0.4s ease' }}
      />
    </svg>
  )
}

// ── DEVOPS: Pipeline that fills with flowing data on hover ────────────────────
function IconDevops({ hovered }: { hovered: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="overflow-visible">

      {/* Terminal window frame */}
      <rect x="2" y="4" width="32" height="28" rx="2.5"
        stroke="#c8f542" strokeWidth="1.1"
        fill={hovered ? 'rgba(200,245,66,0.07)' : 'rgba(200,245,66,0.03)'}
        style={{ transition: 'fill 0.3s ease' }}
      />

      {/* Title bar */}
      <rect x="2" y="4" width="32" height="6" rx="2.5"
        fill={hovered ? 'rgba(200,245,66,0.12)' : 'rgba(200,245,66,0.06)'}
        style={{ transition: 'fill 0.3s ease' }}
      />
      {/* clip bottom corners of title bar */}
      <rect x="2" y="7" width="32" height="3"
        fill={hovered ? 'rgba(200,245,66,0.12)' : 'rgba(200,245,66,0.06)'}
        style={{ transition: 'fill 0.3s ease' }}
      />

      {/* Window dots */}
      <circle cx="7" cy="7" r="1.2" fill={hovered ? '#ff6b6b' : 'rgba(255,107,107,0.4)'} style={{ transition: 'fill 0.3s ease' }} />
      <circle cx="11" cy="7" r="1.2" fill={hovered ? '#f5a742' : 'rgba(245,167,66,0.4)'} style={{ transition: 'fill 0.3s ease' }} />
      <circle cx="15" cy="7" r="1.2" fill={hovered ? '#c8f542' : 'rgba(200,245,66,0.4)'} style={{ transition: 'fill 0.3s ease' }} />

      {/* Prompt line — $ git push */}
      <text x="5" y="18"
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 4.2,
          fill: '#c8f542',
          fillOpacity: 1,
          letterSpacing: '0.02em',
        }}
      >
        <tspan fill="rgba(200,245,66,0.45)">$</tspan>
        <tspan fill={hovered ? '#c8f542' : 'rgba(200,245,66,0.55)'}
          style={{ transition: 'fill 0.2s ease' }}
        > git push</tspan>
      </text>

      {/* Blinking cursor after command */}
      <rect
        x="24.5" y="14.2" width="1.2" height="4.2"
        fill="#c8f542"
        fillOpacity={hovered ? 0 : 0.8}
        style={{ transition: 'fill-opacity 0.15s ease' }}
      >
        {!hovered && (
          <animate attributeName="fill-opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
        )}
      </rect>

      {/* Output line 1 — appears first */}
      <text x="5" y="22.5"
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 3.6,
          fill: '#3de8c8',
          fillOpacity: hovered ? 0.9 : 0,
          transition: 'fill-opacity 0.25s ease 0.1s',
          letterSpacing: '0.01em',
        }}
      >
        ✓ build passed
      </text>

      {/* Output line 2 — appears second */}
      <text x="5" y="26.5"
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 3.6,
          fill: '#3de8c8',
          fillOpacity: hovered ? 0.9 : 0,
          transition: 'fill-opacity 0.25s ease 0.3s',
          letterSpacing: '0.01em',
        }}
      >
        ✓ tests passed
      </text>

      {/* Output line 3 — appears last */}
      <text x="5" y="30.5"
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 3.6,
          fill: '#c8f542',
          fillOpacity: hovered ? 1 : 0,
          transition: 'fill-opacity 0.25s ease 0.55s',
          letterSpacing: '0.01em',
        }}
      >
        🚀 deployed
      </text>

      {/* Idle state — three faint placeholder lines when not hovered */}
      {[22.5, 26.5, 30.5].map((y, i) => (
        <rect key={i}
          x="5" y={y - 3.2} width={[16, 13, 10][i]} height="3"
          rx="0.8"
          fill="rgba(200,245,66,0.06)"
          fillOpacity={hovered ? 0 : 1}
          style={{ transition: 'fill-opacity 0.2s ease' }}
        />
      ))}
    </svg>
  )
}

function IconPerformance({ hovered }: { hovered: boolean }) {
  const ticks = [200, 220, 240, 260, 280, 300, 320, 340, 360]
  const tickColors = ['#ff4444', '#ff4444', '#f5a742', '#f5a742', '#f5a742', '#c8f542', '#c8f542', '#c8f542', '#c8f542']

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="overflow-visible">
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" />
          <stop offset="45%" stopColor="#f5a742" />
          <stop offset="100%" stopColor="#c8f542" />
        </linearGradient>
      </defs>
      <path
        d="M 5 24 A 13 13 0 1 1 31 24"
        stroke="url(#arcGrad)" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      {ticks.map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const cx = 18, cy = 24, r = 13
        const isMajor = i % 4 === 0
        const x1 = cx + (r - (isMajor ? 4 : 2.5)) * Math.cos(rad)
        const y1 = cy + (r - (isMajor ? 4 : 2.5)) * Math.sin(rad)
        const x2 = cx + r * Math.cos(rad)
        const y2 = cy + r * Math.sin(rad)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={tickColors[i]} strokeWidth={isMajor ? 1.5 : 0.8} strokeOpacity="0.65"
          />
        )
      })}
      <line
        x1="18" y1="24" x2="18" y2="12"
        stroke={hovered ? '#c8f542' : '#ff4444'}
        strokeWidth="1.8" strokeLinecap="round"
        style={{
          transformOrigin: '18px 24px',
          transform: `rotate(${hovered ? 70 : -70}deg)`,
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.7s ease',
        }}
      />
      <circle cx="18" cy="24" r="2.5"
        fill={hovered ? '#c8f542' : '#ff4444'}
        style={{ transition: 'fill 0.7s ease' }}
      />
      <circle cx="18" cy="24" r="1" fill="#060606" />
    </svg>
  )
}

function IconArchitecture({ hovered }: { hovered: boolean }) {
  const center = { x: 18, y: 18 }
  const layer1 = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180)
    return { x: 18 + 8 * Math.cos(angle), y: 18 + 8 * Math.sin(angle) }
  })
  const layer2 = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 - 67.5) * (Math.PI / 180)
    return { x: 18 + 15 * Math.cos(angle), y: 18 + 15 * Math.sin(angle) }
  })

  return (
    <svg
      width="36" height="36" viewBox="0 0 36 36" fill="none"
      className="overflow-visible"
      style={{
        transition: 'transform 0.7s ease',
        transform: hovered ? 'rotate(36deg)' : 'rotate(0deg)',
        transformOrigin: '18px 18px',
      }}
    >
      {layer1.map((n, i) => (
        <line key={`c-l1-${i}`}
          x1={center.x} y1={center.y} x2={n.x} y2={n.y}
          stroke="#c8f542" strokeWidth="0.8"
          strokeOpacity={hovered ? 0.7 : 0.4}
          style={{ transition: 'stroke-opacity 0.4s' }}
        />
      ))}
      {layer1.map((n, i) => {
        const next = layer1[(i + 1) % 5]
        return (
          <line key={`l1-ring-${i}`}
            x1={n.x} y1={n.y} x2={next.x} y2={next.y}
            stroke="#c8f542" strokeWidth="0.6"
            strokeOpacity={hovered ? 0.5 : 0.2}
            style={{ transition: 'stroke-opacity 0.4s' }}
          />
        )
      })}
      {hovered && layer2.map((n, i) => {
        const nearest = layer1[Math.round((i / 8) * 5) % 5]
        return (
          <line key={`l1-l2-${i}`}
            x1={nearest.x} y1={nearest.y} x2={n.x} y2={n.y}
            stroke="#c8f542" strokeWidth="0.6" strokeOpacity="0.35"
          />
        )
      })}
      {hovered && layer2.map((n, i) => {
        const next = layer2[(i + 1) % 8]
        return (
          <line key={`l2-ring-${i}`}
            x1={n.x} y1={n.y} x2={next.x} y2={next.y}
            stroke="#c8f542" strokeWidth="0.5" strokeOpacity="0.2"
          />
        )
      })}
      {layer2.map((n, i) => (
        <circle key={`l2-${i}`} cx={n.x} cy={n.y} r="1.8"
          stroke="#c8f542" strokeWidth="0.8"
          fill="rgba(200,245,66,0.08)"
          opacity={hovered ? 1 : 0}
          style={{ transition: `opacity 0.3s ease ${i * 40}ms` }}
        />
      ))}
      {layer1.map((n, i) => (
        <circle key={`l1-${i}`} cx={n.x} cy={n.y} r="2.5"
          stroke="#c8f542" strokeWidth="1"
          fill={hovered ? 'rgba(200,245,66,0.2)' : 'rgba(200,245,66,0.06)'}
          style={{ transition: 'fill 0.4s ease' }}
        />
      ))}
      <circle cx={center.x} cy={center.y} r="3.5"
        stroke="#c8f542" strokeWidth="1.2"
        fill={hovered ? 'rgba(200,245,66,0.35)' : 'rgba(200,245,66,0.1)'}
        style={{ transition: 'fill 0.4s ease' }}
      />
      <circle cx={center.x} cy={center.y} r="1.2" fill="#c8f542" />
    </svg>
  )
}

function IconTesting({ hovered }: { hovered: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="overflow-visible">

      {/* Net grid — horizontal lines converge on hover */}
      {([6, 12, 24, 30] as number[]).map((y, i) => {
        const targetY = hovered ? ([15, 17, 19, 21] as number[])[i] : y
        return (
          <line key={`h${i}`}
            x1="3" y1={targetY} x2="33" y2={targetY}
            stroke="#f5a742" strokeWidth="0.6"
            strokeOpacity={hovered ? 0.55 : 0.2}
            strokeDasharray={hovered ? '0' : '2 3'}
            style={{ transition: `y1 0.5s ease ${i * 60}ms, y2 0.5s ease ${i * 60}ms, stroke-opacity 0.4s ease, stroke-dasharray 0.4s ease` }}
          />
        )
      })}

      {/* Net grid — vertical lines converge on hover */}
      {([6, 12, 24, 30] as number[]).map((x, i) => {
        const targetX = hovered ? ([15, 17, 19, 21] as number[])[i] : x
        return (
          <line key={`v${i}`}
            x1={targetX} y1="3" x2={targetX} y2="33"
            stroke="#f5a742" strokeWidth="0.6"
            strokeOpacity={hovered ? 0.55 : 0.2}
            strokeDasharray={hovered ? '0' : '2 3'}
            style={{ transition: `x1 0.5s ease ${i * 60}ms, x2 0.5s ease ${i * 60}ms, stroke-opacity 0.4s ease` }}
          />
        )
      })}

      {/* Bug body */}
      <ellipse cx="18" cy="20" rx="4.5" ry="6"
        stroke="#f5a742" strokeWidth="1.2"
        fill={hovered ? 'rgba(245,167,66,0.25)' : 'rgba(245,167,66,0.08)'}
        style={{ transition: 'fill 0.3s ease' }}
      />

      {/* Bug head */}
      <circle cx="18" cy="13.5" r="2.8"
        stroke="#f5a742" strokeWidth="1.2"
        fill={hovered ? 'rgba(245,167,66,0.2)' : 'rgba(245,167,66,0.06)'}
        style={{ transition: 'fill 0.3s ease' }}
      />

      {/* Eyes */}
      <circle cx="16.8" cy="13.2" r="0.7" fill="#f5a742" fillOpacity={hovered ? 1 : 0.5} style={{ transition: 'fill-opacity 0.3s' }} />
      <circle cx="19.2" cy="13.2" r="0.7" fill="#f5a742" fillOpacity={hovered ? 1 : 0.5} style={{ transition: 'fill-opacity 0.3s' }} />

      {/* Antennae */}
      <line x1="16.5" y1="11"
        x2={hovered ? 13.5 : 14.5} y2={hovered ? 8 : 7.5}
        stroke="#f5a742" strokeWidth="1" strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      <line x1="19.5" y1="11"
        x2={hovered ? 22.5 : 21.5} y2={hovered ? 8 : 7.5}
        stroke="#f5a742" strokeWidth="1" strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />

      {/* Legs — 3 per side */}
      {([-1, 1] as number[]).map((side) =>
        ([16, 20, 24] as number[]).map((y, i) => (
          <line key={`leg-${side}-${i}`}
            x1={18 + side * 4.5} y1={y}
            x2={18 + side * (hovered ? 8.5 : 9.5)}
            y2={y + (hovered ? (i - 1) * 1.5 : 0)}
            stroke="#f5a742" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7"
            style={{ transition: `all 0.3s ease ${i * 60}ms` }}
          />
        ))
      )}

      {/* Caught checkmark — appears bottom-right on hover */}
      <circle cx="27" cy="27" r="4.5"
        fill={hovered ? 'rgba(200,245,66,0.15)' : 'transparent'}
        stroke={hovered ? '#c8f542' : 'transparent'}
        strokeWidth="1"
        style={{ transition: 'all 0.25s ease 0.35s' }}
      />
      <polyline
        points="25,27 26.5,28.5 29.5,25"
        stroke={hovered ? '#c8f542' : 'transparent'}
        strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"
        style={{ transition: 'stroke 0.2s ease 0.45s' }}
      />
    </svg>
  )
}

// ─── section ─────────────────────────────────────────────────────────────────
// Individual card — owns hover state, passes it to icons that need it
function SkillCard({ name, desc, tags, index }: {
  name: string
  desc: string
  tags: string
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  const delays = [
    '',
    '[transition-delay:0.08s]',
    '[transition-delay:0.16s]',
    '[transition-delay:0.08s]',
    '[transition-delay:0.16s]',
    '[transition-delay:0.24s]',
  ]

  const renderIcon = () => {
    switch (index) {
      case 0: return <IconFrontend hovered={hovered} />
      case 1: return <IconBackend hovered={hovered} />
      case 2: return <IconTesting hovered={hovered} />
      case 3: return <IconDevops hovered={hovered} />
      case 4: return <IconPerformance hovered={hovered} />
      case 5: return <IconArchitecture hovered={hovered} />
      default: return null
    }
  }

  return (
    <div
      className={`reveal group bg-surface p-6 relative overflow-hidden cursor-default transition-colors hover:bg-[#111] ${delays[index]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
      <div className="mb-4">
        {renderIcon()}
      </div>
      <div className="text-[14px] font-bold mb-2 tracking-[-0.5px]">{name}</div>
      <div className="font-mono text-[11px] text-muted leading-relaxed font-light">{desc}</div>
      <div className="flex flex-wrap gap-1 mt-3">
        {tags.split(' · ').map((t) => (
          <span key={t} className="font-mono text-[9px] tracking-[0.06em] px-1.5 py-0.5 bg-white/[0.04] rounded text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}



export default function Skills() {
  const CARDS = [
    ['Frontend', 'Component-driven UIs, perf profiling, WCAG, responsive design.', 'ReactJS · TypeScript · JS ES6+ · HTML/CSS · Tailwind · React Flow'],
    ['Backend & APIs', 'REST API design, async state management, microservices.', 'Node.js · Express · RESTful APIs · Microservices · PostgreSQL · MongoDB'],
    ['Testing & QA', 'E2E and component testing, CI/CD quality gates, clean code.', 'Cypress E2E · xUnit · Code Coverage · Component Testing'],
    ['DevOps', 'CI/CD pipelines, quality gates, Agile/Scrum workflows.', 'Git · GitLab CI/CD · Postman · Jira · Agile/Scrum'],
    ['Performance', 'Profiling, rendering optimizations for data-heavy dashboards.', 'Perf Profiling · Logging · Monitoring · Optimization'],
    ['Architecture', 'Scalable component libraries, MVC patterns, system design.', 'Component Systems · MVC · System Design · Code Review'],
  ] as const
  return (
    <section id="skills" className="py-28 relative z-10 max-md:py-18">
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5">
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent mb-4 flex items-center gap-3">
          03 — Skills
          <span className="flex-1 h-px bg-white/[0.07] max-w-[80px]" />
        </div>
        <h2 className="reveal font-display text-[clamp(32px,5vw,68px)] font-bold leading-none tracking-[-2px] mb-0">
          Technical
          <br />
          <em className="not-italic text-accent">Toolkit.</em>
        </h2>
      </div>

      {/* Desktop: React Flow graph / Mobile: grouped chips */}
      <SkillGraphResponsive />

      {/* Skill cards */}
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5 mt-8">
        <div className="grid grid-cols-3 gap-0.5 max-md:grid-cols-2 max-sm:grid-cols-1">
          {CARDS.map(([name, desc, tags], i) => (
            <SkillCard key={name} name={name} desc={desc} tags={tags} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}