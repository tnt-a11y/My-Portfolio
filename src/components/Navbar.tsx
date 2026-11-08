import { sections } from '../data/content'
import type { SectionId } from '../data/content'
import { CursorEyes } from './CursorEyes'

export function Navbar({ active }: { active: SectionId }) {
  return <header className="site-header">
    <CursorEyes />
    <nav className="main-nav" aria-label="Main navigation">{sections.map(id => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'location' : undefined}>{id.toUpperCase()}</a>)}</nav>
  </header>
}
