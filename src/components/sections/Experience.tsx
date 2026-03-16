const JOBS = [
  {
    num: '01',
    label: 'Current',
    company: 'Vodafone Idea',
    role: 'Software Development Engineer',
    date: 'Jul 2024 — Present',
    location: 'Pune, India',
    points: [
      'Led frontend development for internal monitoring tools and operational dashboards using ReactJS & TypeScript',
      'Engineered real-time network diagrams with React Flow to support operational decision-making',
      'Automated workflows — compressing 8-hour manual processes into ~2 hours (80–90% efficiency gain)',
      'Defined and enforced CI/CD quality gates using Cypress E2E test suites',
      'Designed scalable, reusable component libraries to standardize UI patterns across teams',
    ],
    tags: ['ReactJS', 'TypeScript', 'React Flow', 'Cypress', 'Node.js', 'Express.js'],
  },
  {
    num: '02',
    label: 'Previous',
    company: 'GEP',
    role: 'Associate Software Developer',
    date: 'Jul 2022 — May 2023',
    location: 'Hyderabad, India',
    points: [
      'Built enterprise web apps using Angular & TypeScript within a low-code/no-code platform',
      'Implemented drag-and-drop UI components and config-driven workflows',
      'Built and maintained microservices with C# and .NET Core exposing RESTful APIs',
      'Maintained >90% automated test coverage via xUnit and Cypress in CI/CD pipelines',
    ],
    tags: ['Angular', 'TypeScript', 'C# .NET', 'xUnit', 'Cypress', 'Microservices'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-28 relative z-10 max-md:py-18">
      <div className="max-w-[1280px] mx-auto px-12 max-md:px-5">
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent mb-4 flex items-center gap-3">
          02 — Experience
          <span className="flex-1 h-px bg-white/[0.07] max-w-[80px]" />
        </div>

        <h2 className="reveal font-display text-[clamp(32px,5vw,68px)] font-bold leading-none tracking-[-2px] mb-12">
          Where I've
          <br />
          <em className="not-italic text-accent">worked.</em>
        </h2>

        <div className="flex flex-col">
          {JOBS.map((job, idx) => (
            <div
              key={job.company}
              className={`reveal grid grid-cols-[130px_1fr_160px] gap-6 py-10 border-b border-white/[0.07] max-md:grid-cols-1 max-md:gap-2.5 max-md:py-8 ${
                idx > 0 ? '[transition-delay:0.1s]' : ''
              }`}
            >
              {/* Number */}
              <div className="font-display text-[12px] font-light italic text-muted pt-1 max-md:hidden">
                {job.num} / {job.label}
              </div>

              {/* Content */}
              <div>
                <div className="font-display text-[clamp(22px,3vw,30px)] font-bold tracking-[-1px] mb-1.5">
                  {job.company}
                </div>
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent mb-4">
                  {job.role}
                </div>
                <ul className="flex flex-col gap-1.5 list-none">
                  {job.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex gap-2.5 font-mono text-[11px] leading-[1.75] text-muted font-light"
                    >
                      <span className="text-accent flex-shrink-0">—</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta */}
              <div className="text-right max-md:text-left">
                <div className="font-mono text-[10px] text-muted tracking-[0.07em]">
                  {job.date}
                </div>
                <div className="font-mono text-[10px] text-muted mt-0.5">{job.location}</div>
                <div className="flex flex-wrap gap-1 mt-2.5 justify-end max-md:justify-start">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] tracking-[0.06em] px-2 py-0.5 border border-white/[0.07] rounded-full text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
