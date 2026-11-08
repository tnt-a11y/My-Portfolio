import { services, site, validEmail } from '../data/content'
import { ArrowUpRight } from 'lucide-react'

export function ServicesSection() {
  return <section id="services" className="services-section section-shell" aria-labelledby="services-heading">
    <div className="section-heading reveal"><h2 id="services-heading">SERVICES</h2></div>
    <div className="services-grid reveal">{services.map((service, index) => <article className="service-item" key={service.title}>
      <span className="service-number mono" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><h3>{service.title}</h3><p>{service.description}</p></div>
    </article>)}</div>
    {validEmail(site.email) && <a className="button button--primary services-cta" href={`mailto:${site.email}`}>Discuss your project<ArrowUpRight size={18} /></a>}
  </section>
}
