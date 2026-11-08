import { ArrowUpRight } from 'lucide-react'
import { projects, mediaUrl } from '../data/content'
import type { Project } from '../data/content'
import { usePointerSurface } from '../hooks/usePointerSurface'
import { ProjectArtwork } from './Artwork'

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const ref = usePointerSurface<HTMLElement>(true)
  const image = mediaUrl(project.thumbnail)
  return <article ref={ref} className="project-card spotlight">
    <button className="project-card-trigger" onClick={() => onOpen(project)} aria-haspopup="dialog"><span className="sr-only">View {project.title} details</span></button>
    <div className="project-preview">
      {image ? <img src={image} alt={`${project.title} preview`} loading="lazy" decoding="async" width="1200" height="675" /> : <ProjectArtwork />}
      <div className="preview-top"><span className="glass-tag">{project.status || project.category}</span></div>
      <div className="preview-bottom">{!image && <span className="preview-caption mono">CONCEPT VISUAL</span>}<span className="project-open" aria-hidden="true"><ArrowUpRight size={24} strokeWidth={1.3} /></span></div>
    </div>
    <div className="project-info"><div><span className="project-category mono">{project.category}</span><h3>{project.title}</h3></div><p>{project.summary}</p></div>
  </article>
}

export function ProjectSection({ onOpen }: { onOpen: (project: Project) => void }) {
  return <section id="projects" className="projects-section section-shell" aria-labelledby="projects-heading">
    <div className="section-heading reveal"><h2 id="projects-heading">PROJECTS</h2></div>
    <div className="project-grid reveal">{projects.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
  </section>
}
