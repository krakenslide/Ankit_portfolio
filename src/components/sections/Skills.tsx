import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
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
  SiReact,
  SiTypescript,
  SiJavascript,
  SiAngular,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiCypress,
  SiGitlab,
  SiJira,
  SiTailwindcss,
  SiPostman,
  SiDotnet,
  SiMultisim
} from 'react-icons/si'
import {
  TbApi,
  TbBrandHtml5,
  TbTestPipe,
  TbGitBranch,
  TbComponents,
} from 'react-icons/tb'

// ─── colour palette per cluster ──────────────────────────────────────────────
const GROUP_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  core: { color: '#c8f542', bg: 'rgba(200,245,66,0.08)', border: 'rgba(200,245,66,0.3)' },
  backend: { color: '#3de8c8', bg: 'rgba(61,232,200,0.08)', border: 'rgba(61,232,200,0.3)' },
  devops: { color: '#f5a742', bg: 'rgba(245,167,66,0.08)', border: 'rgba(245,167,66,0.3)' },
  legacy: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.3)' },
}

// ─── icon map keyed by node id ────────────────────────────────────────────────
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
  position: 'absolute',
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
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
      {/* Named invisible handles — IDs referenced in every edge */}
      <Handle id="l" type="target" position={Position.Left} style={HIDDEN} />
      <Handle id="r" type="source" position={Position.Right} style={HIDDEN} />
      <Handle id="t" type="target" position={Position.Top} style={HIDDEN} />
      <Handle id="b" type="source" position={Position.Bottom} style={HIDDEN} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {/* Brand icon */}
        {icon && (
          <span style={{ color: data.hub ? g.color : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {icon}
          </span>
        )}

        {/* Glow dot on hub nodes */}
        {data.hub && (
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.color, flexShrink: 0, boxShadow: `0 0 6px ${g.color}`, display: 'inline-block' }} />
        )}

        {/* Label */}
        <span
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: data.hub ? 11 : 10,
            fontWeight: data.hub ? 600 : 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: data.hub ? g.color : 'rgba(255,255,255,0.72)',
            whiteSpace: 'nowrap',
          }}
        >
          {data.label}
        </span>
      </div>

      {/* Category sub-label on hub nodes */}
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

  // ── LANGUAGES — top row, foundational ─────────────────────────
  { id: 'js', type: 'skill', position: { x: 340, y: 0 }, data: { label: 'JavaScript', group: 'core', hub: true, category: 'Language' } },
  { id: 'ts', type: 'skill', position: { x: 560, y: 0 }, data: { label: 'TypeScript', group: 'core', hub: true, category: 'Language' } },
  { id: 'csharp', type: 'skill', position: { x: 780, y: 0 }, data: { label: 'C# .NET', group: 'legacy', hub: true, category: 'Language' } },

  // ── FRONTEND — left pillar ─────────────────────────────────────
  { id: 'reactjs', type: 'skill', position: { x: 80, y: 160 }, data: { label: 'ReactJS', group: 'core', hub: true, category: 'Frontend' } },
  { id: 'angular', type: 'skill', position: { x: 80, y: 260 }, data: { label: 'Angular', group: 'legacy', hub: true, category: 'Frontend' } },
  { id: 'html', type: 'skill', position: { x: -165, y: 140 }, data: { label: 'HTML / CSS', group: 'core' } },
  { id: 'tailwind', type: 'skill', position: { x: -165, y: 215 }, data: { label: 'Tailwind', group: 'core' } },
  { id: 'rf', type: 'skill', position: { x: -165, y: 290 }, data: { label: 'React Flow', group: 'core' } },

  // ── BACKEND — right pillar ─────────────────────────────────────
  { id: 'nodejs', type: 'skill', position: { x: 760, y: 160 }, data: { label: 'Node.js', group: 'backend', hub: true, category: 'Backend' } },
  { id: 'dotnet', type: 'skill', position: { x: 760, y: 260 }, data: { label: '.NET Core', group: 'legacy', hub: true, category: 'Backend' } },
  { id: 'express', type: 'skill', position: { x: 980, y: 100 }, data: { label: 'Express', group: 'backend' } },
  { id: 'rest', type: 'skill', position: { x: 980, y: 175 }, data: { label: 'REST APIs', group: 'backend' } },
  { id: 'microsvcs', type: 'skill', position: { x: 980, y: 250 }, data: { label: 'Microsvcs', group: 'legacy' } },

  // ── DATA — far right ───────────────────────────────────────────
  { id: 'postgres', type: 'skill', position: { x: 1185, y: 140 }, data: { label: 'PostgreSQL', group: 'backend' } },
  { id: 'mongo', type: 'skill', position: { x: 1185, y: 215 }, data: { label: 'MongoDB', group: 'backend' } },
  { id: 'postman', type: 'skill', position: { x: 1185, y: 290 }, data: { label: 'Postman', group: 'backend' } },

  // ── DEVOPS / QA — bottom row, spans full width ─────────────────
  { id: 'cypress', type: 'skill', position: { x: 80, y: 430 }, data: { label: 'Cypress', group: 'devops', hub: true, category: 'Testing' } },
  { id: 'xunit', type: 'skill', position: { x: 300, y: 430 }, data: { label: 'xUnit', group: 'devops' } },
  { id: 'gitlab', type: 'skill', position: { x: 520, y: 430 }, data: { label: 'GitLab', group: 'devops', hub: true, category: 'CI / CD' } },
  { id: 'cicd', type: 'skill', position: { x: 740, y: 430 }, data: { label: 'CI / CD', group: 'devops', hub: true, category: 'Pipeline' } },
  { id: 'jira', type: 'skill', position: { x: 960, y: 430 }, data: { label: 'Jira', group: 'devops' } },
]

// ─── edge helper ─────────────────────────────────────────────────────────────
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

// ─── edges ────────────────────────────────────────────────────────────────────
const INIT_EDGES: Edge[] = [

  // ── TypeScript is a superset of JavaScript ─────────────────────
  mkEdge('e-js-ts', 'js', 'r', 'ts', 'l', 'core'),

  // ── Languages → Frameworks ─────────────────────────────────────
  mkEdge('e-js-react', 'js', 'b', 'reactjs', 't', 'core'),         // React works with JS
  mkEdge('e-ts-react', 'ts', 'b', 'reactjs', 't', 'core'),         // React uses TS
  mkEdge('e-ts-ang', 'ts', 'b', 'angular', 't', 'core'),         // Angular REQUIRES TS
  mkEdge('e-js-node', 'js', 'b', 'nodejs', 't', 'core'),         // Node runs on JS
  mkEdge('e-ts-node', 'ts', 'b', 'nodejs', 't', 'core', false),  // Node optionally TS
  mkEdge('e-cs-dotnet', 'csharp', 'b', 'dotnet', 't', 'legacy'),       // .NET written in C#

  // ── Frontend → UI libs ─────────────────────────────────────────
  mkEdge('e-html-r', 'html', 'r', 'reactjs', 'l', 'core'),
  mkEdge('e-tw-r', 'tailwind', 'r', 'reactjs', 'l', 'core'),
  mkEdge('e-rf-r', 'rf', 'r', 'reactjs', 'l', 'core'),

  // ── Frontend ↔ Backend (full-stack connections) ────────────────
  mkEdge('e-react-node', 'reactjs', 'r', 'nodejs', 'l', 'backend'),
  mkEdge('e-ang-dot', 'angular', 'r', 'dotnet', 'l', 'legacy'),

  // ── Backend → Services ─────────────────────────────────────────
  mkEdge('e-node-exp', 'nodejs', 'r', 'express', 'l', 'backend'),
  mkEdge('e-node-rst', 'nodejs', 'r', 'rest', 'l', 'backend'),
  mkEdge('e-dot-ms', 'dotnet', 'r', 'microsvcs', 'l', 'legacy'),
  mkEdge('e-dot-rst', 'dotnet', 'r', 'rest', 'l', 'backend', false),

  // ── REST → Data layer ──────────────────────────────────────────
  mkEdge('e-rst-pg', 'rest', 'r', 'postgres', 'l', 'backend'),
  mkEdge('e-rst-mg', 'rest', 'r', 'mongo', 'l', 'backend'),
  mkEdge('e-rst-pm', 'rest', 'r', 'postman', 'l', 'backend'),

  // ── Frontend → Testing ─────────────────────────────────────────
  mkEdge('e-react-cy', 'reactjs', 'b', 'cypress', 't', 'devops'),
  mkEdge('e-ang-cy', 'angular', 'b', 'cypress', 't', 'devops', false),

  // ── Backend → Testing ──────────────────────────────────────────
  mkEdge('e-dot-xu', 'dotnet', 'b', 'xunit', 't', 'devops'),

  // ── CI/CD pipeline chain ───────────────────────────────────────
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

// ─── legend ───────────────────────────────────────────────────────────────────
const LEGEND_ITEMS = [
  ['core', 'Frontend / JS'],
  ['backend', 'Backend'],
  ['devops', 'DevOps / QA'],
  ['legacy', 'GEP Stack (C# / Angular)'],
] as const

function Legend() {
  return (
    <div style={{ background: 'rgba(6,6,6,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {LEGEND_ITEMS.map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: GROUP_STYLE[key].color, flexShrink: 0, boxShadow: `0 0 5px ${GROUP_STYLE[key].color}` }} />
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

// ─── graph ────────────────────────────────────────────────────────────────────
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
      <MiniMap
        nodeColor={(n) => GROUP_STYLE[(n.data as SkillData).group]?.color ?? '#c8f542'}
        maskColor="rgba(0,0,0,0.55)"
        style={{ bottom: 12, right: 12 }}
      />
      <Panel position="top-left">
        <Legend />
      </Panel>
      <AutoFit />
    </ReactFlow>
  )
}

// ─── skill cards ─────────────────────────────────────────────────────────────
const CARDS = [
  ['⬡', 'Frontend', 'Component-driven UIs, perf profiling, WCAG, responsive design.', 'ReactJS · TypeScript · JS ES6+ · HTML/CSS · Tailwind · React Flow'],
  ['◈', 'Backend & APIs', 'REST API design, async state management, microservices.', 'Node.js · Express · RESTful APIs · Microservices · PostgreSQL · MongoDB'],
  ['△', 'Testing & QA', 'E2E and component testing, CI/CD quality gates, clean code.', 'Cypress E2E · xUnit · Code Coverage · Component Testing'],
  ['⌬', 'DevOps', 'CI/CD pipelines, quality gates, Agile/Scrum workflows.', 'Git · GitLab CI/CD · Postman · Jira · Agile/Scrum'],
  ['◯', 'Performance', 'Profiling, rendering optimizations for data-heavy dashboards.', 'Perf Profiling · Logging · Monitoring · Optimization'],
  ['⬟', 'Architecture', 'Scalable component libraries, MVC patterns, system design.', 'Component Systems · MVC · System Design · Code Review'],
] as const

// ─── section ─────────────────────────────────────────────────────────────────
export default function Skills() {
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

      {/* ── React Flow graph ── */}
      <div className="reveal mt-10 h-[500px] relative border-t border-b border-white/[0.07] bg-white/[0.012]">
        <div className="max-w-[1280px] mx-auto h-full px-12 max-md:px-5">
          <ReactFlowProvider>
            <SkillGraph />
          </ReactFlowProvider>
        </div>
      </div>

      {/* ── Skill cards ── */}
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5">
        <div className="grid grid-cols-3 gap-0.5 mt-0.5 max-md:grid-cols-2 max-sm:grid-cols-1">
          {CARDS.map(([icon, name, desc, tags], i) => (
            <div
              key={name}
              className={`reveal group bg-surface p-6 relative overflow-hidden cursor-default transition-colors hover:bg-[#111] ${['', '[transition-delay:0.08s]', '[transition-delay:0.16s]',
                '[transition-delay:0.08s]', '[transition-delay:0.16s]', '[transition-delay:0.24s]'][i]
                }`}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
              <div className="text-xl mb-3">{icon}</div>
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
          ))}
        </div>
      </div>
    </section>
  )
}
