const ITEMS = [
  'ReactJS','TypeScript','Node.js','Tailwind CSS','Cypress E2E',
  'React Flow','GitLab CI/CD','PostgreSQL','Microservices','Angular','C# .NET','MongoDB',
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div className="overflow-hidden border-t border-b border-white/[0.07] py-3.5 relative z-10">
      <div className="ticker-track flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-[18px] px-3.5 font-mono text-[11px] text-muted tracking-[0.1em] uppercase"
          >
            <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
