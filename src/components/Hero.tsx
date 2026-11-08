import { ArrowDownRight } from 'lucide-react'
import { site } from '../data/content'
import { usePointerSurface } from '../hooks/usePointerSurface'
import { CellularAutomaton } from './CellularAutomaton'

export function Hero() {
  const buttonRef = usePointerSurface<HTMLAnchorElement>()
  return <div id="top" className="hero-section section-shell">
    <p className="hero-overline mono">{site.role}</p>
    <div className="hero-main">
      <div className="hero-identity">
        <h1 id="hero-heading" aria-label={site.name}>{['TAHMID', 'NASIF', 'TAMAL'].map((line, i) => <span className="headline-mask" key={line}><span className={`headline-line headline-line--${i}`} aria-hidden="true">{line}</span></span>)}</h1>
        <div className="hero-actions"><a ref={buttonRef} href="#projects" className="button button--primary magnetic">Explore Projects <ArrowDownRight size={18} /></a></div>
      </div>
      <CellularAutomaton />
    </div>
  </div>
}
