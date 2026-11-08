import { Fragment } from 'react'
import { mediaUrl, site } from '../data/content'

function AboutText({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : <Fragment key={index}>{part}</Fragment>)}</>
}

export function AboutSection() {
  return <section id="about" className="about-section section-shell" aria-labelledby="about-heading">
    <div className="hero-bottom">
      <div className="hero-note portrait-column">
        <figure className="hero-profile photo-color-reveal" tabIndex={0}><div className="portrait-frame"><img src={mediaUrl(site.portrait)} alt={site.portraitAlt} width="480" height="480" loading="lazy" decoding="async" /></div></figure>
        <div className="supporting-gallery" aria-label="More portraits">
          {site.supportingPhotos.map(photo => <figure key={photo.src} className="personal-photo photo-color-reveal" tabIndex={0}><div className="personal-photo-frame"><img src={mediaUrl(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" /></div></figure>)}
        </div>
      </div>
      <div className="hero-intro"><h2 id="about-heading">About me</h2><p><AboutText text={site.introduction} /></p>
        <div className="personal-gallery" aria-label="Away from the screen">
          {site.personalPhotos.map(photo => <figure key={photo.src} className="personal-photo photo-color-reveal" tabIndex={0}><div className="personal-photo-frame"><img src={mediaUrl(photo.src)} alt={photo.alt} width="640" height="854" loading="lazy" decoding="async" /></div></figure>)}
        </div>
      </div>
    </div>
    <div className="about-story reveal">
      <div className="about-narrative">{site.aboutParagraphs.map(paragraph => <p key={paragraph}><AboutText text={paragraph} /></p>)}</div>
      <p className="about-closing"><strong>{site.aboutClosing}</strong></p>
    </div>
  </section>
}
