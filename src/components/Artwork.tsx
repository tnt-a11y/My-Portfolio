export function ProjectArtwork({ compact = false }: { compact?: boolean }) {
  return <div className={`project-art${compact ? ' project-art--compact' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 1200 675" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={compact ? 'portal-glow-small' : 'portal-glow'}><stop stopColor="#a3a3a3" stopOpacity=".16" /><stop offset="1" stopColor="#101010" stopOpacity="0" /></radialGradient>
        <linearGradient id={compact ? 'portal-metal-small' : 'portal-metal'} x1="380" y1="130" x2="750" y2="580" gradientUnits="userSpaceOnUse"><stop stopColor="#b4b4b4" /><stop offset=".28" stopColor="#373737" /><stop offset=".7" stopColor="#777" /><stop offset="1" stopColor="#1b1b1b" /></linearGradient>
      </defs>
      <path fill="#101010" d="M0 0h1200v675H0z" />
      <ellipse cx="600" cy="330" rx="520" ry="330" fill={`url(#${compact ? 'portal-glow-small' : 'portal-glow'})`} />
      <g stroke="#fff" strokeOpacity=".055">{Array.from({ length: 17 }, (_, i) => <path key={i} d={`M600 310L${(i - 4) * 150} 675`} />)}{[370, 397, 433, 481, 548, 635].map(y => <path key={y} d={`M0 ${y}H1200`} />)}</g>
      <g className="portal-frames" stroke={`url(#${compact ? 'portal-metal-small' : 'portal-metal'})`}>
        {Array.from({ length: 14 }, (_, i) => { const d = i * 11; return <rect key={i} x={345 + d} y={90 + d * .65} width={510 - d * 2} height={490 - d * 1.3} rx="1" strokeWidth={i === 0 ? 3 : 1.2} opacity={1 - i * .038} /> })}
      </g>
      <g className="floating-cube" stroke="#bbb" strokeWidth="1">
        <path d="M600 257l65 38v76l-65 38-65-38v-76z" fill="#181818" />
        <path d="M600 333l65-38-65-38-65 38z" fill="#494949" />
        <path d="M600 333v76l-65-38v-76z" fill="#242424" />
        <path d="M600 333v76l65-38v-76z" fill="#111" />
      </g>
      <ellipse cx="600" cy="528" rx="76" ry="12" fill="#080808" opacity=".7" />
    </svg>
  </div>
}
