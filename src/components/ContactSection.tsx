import { ArrowUp } from 'lucide-react'
import { safeExternalUrl, site, validEmail } from '../data/content'
import { ContactIcon } from './ContactIcon'
import type { ContactBrand } from './ContactIcon'

export function ContactSection() {
  const contacts: { brand: ContactBrand; label: string; url: string | undefined }[] = [
    { brand: 'github', label: 'GitHub', url: safeExternalUrl(site.github) },
    { brand: 'facebook', label: 'Facebook', url: safeExternalUrl(site.facebook) },
    { brand: 'gmail', label: 'Gmail', url: validEmail(site.email) ? `mailto:${site.email}` : undefined },
    { brand: 'linkedin', label: 'LinkedIn', url: safeExternalUrl(site.linkedin) },
    { brand: 'itch', label: 'itch.io', url: safeExternalUrl(site.itch) },
  ]
  return <section id="contact" className="contact-section section-shell" aria-labelledby="contact-heading">
    <h2 id="contact-heading" className="sr-only">Contact</h2>
    <div className="contact-links reveal">{contacts.map(({ brand, label, url }) => url ? <a key={brand} className="contact-link" href={url} aria-label={label} title={label} target={brand === 'gmail' ? undefined : '_blank'} rel={brand === 'gmail' ? undefined : 'noopener noreferrer'}><ContactIcon brand={brand} /></a> : null)}</div>
    <footer className="site-footer"><p>© {new Date().getFullYear()} {site.name}</p><a className="back-top mono" href="#top">BACK TO TOP <ArrowUp size={14} /></a></footer>
  </section>
}
