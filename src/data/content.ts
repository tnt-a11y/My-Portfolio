export const sections = ['projects', 'about', 'services', 'contact'] as const
export type SectionId = typeof sections[number]

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  description: string
  features: string[]
  technologies: string[]
  platform: string | null
  role: string
  thumbnail: string | null
  videoSource: string | null
  poster: string | null
  playableUrl: string | null
  sourceUrl: string | null
  status: string | null
}

export const site = {
  name: 'Tahmid Nasif Tamal',
  role: 'Senior Game Developer',
  introduction: "I'm **Tahmid Nasif Tamal**, a game developer, creative thinker, and entrepreneur based in Dhaka, Bangladesh.",
  aboutParagraphs: [
    "My journey began with Computer Science, but my ambitions were never limited to writing code. I once dreamed of becoming a filmmaker, and that passion for storytelling, visual experiences, and bringing imagination to life still influences everything I create today.",
    "Over the years, I've had the opportunity to work with organizations including **Sparktech Agency, Join Venture AI, Brain Station 23, ACME AI, and Theo Clothing**, gaining valuable experience across different industries, technologies, and creative disciplines.",
    "With **100+ projects** under my belt and hands-on experience **leading a 12-person operation**, I've developed more than just technical expertise. I've learned how to manage teams, coordinate complex projects, make critical decisions, and turn ambitious ideas into successful outcomes.",
    "Today, I'm channeling that experience into **Tri Nitro Interactive**, my own startup, where my vision goes beyond simply delivering projects. I'm building toward a future driven by innovative digital experiences, emerging technologies, and products that challenge the ordinary.",
    "I believe great development isn't just about making things work. It's about creating experiences people remember, solving meaningful problems, and pushing the boundaries of what's possible.",
  ],
  aboutClosing: "I started with a dream of telling stories through film. Today, I bring ideas to life through technology, lead people toward a shared vision, and build something of my own. And I'm just getting started.",
  portrait: 'media/tahmid-nasif-tamal.jpg',
  portraitAlt: 'Portrait of Tahmid Nasif Tamal',
  personalPhotos: [
    { src: 'media/tahmid-at-the-shore.webp', alt: 'Tahmid Nasif Tamal beside the sea in a yellow and blue shirt' },
    { src: 'media/tahmid-by-the-sea.webp', alt: 'Tahmid Nasif Tamal looking out over the sea with a backpack' },
  ],
  supportingPhotos: [
    { src: 'media/tahmid-evening.webp', alt: 'Tahmid Nasif Tamal standing outdoors in the evening', width: 480, height: 640 },
    { src: 'media/tahmid-night-portrait.webp', alt: 'Tahmid Nasif Tamal wearing glasses beneath trees at night', width: 480, height: 480 },
  ],
  email: 'tahmidnasiftamal@gmail.com' as string | null,
  github: 'https://github.com/tnt-a11y' as string | null,
  facebook: 'https://www.facebook.com/tahmid.nasif.tamal.2024' as string | null,
  linkedin: 'https://www.linkedin.com/in/tahmid-nasif-tamal-34baa5446' as string | null,
  itch: 'https://trinitrointeractive.itch.io' as string | null,
  professionalLinks: [] as { label: string; url: string }[],
  canonicalUrl: 'https://tnt-a11y.github.io/My-Portfolio/' as string | null,
}

export const services = [
  { title: 'Unity development', description: 'Gameplay systems, C# scripting, and polished interactions' },
  { title: 'Game prototypes', description: 'Turn a concept into a playable proof of concept' },
  { title: '2D & 3D games', description: 'Mechanics, progression, and complete game experiences' },
  { title: 'Multiplayer games', description: 'Connected gameplay, player lobbies, and synchronized systems' },
  { title: 'AR & VR experiences', description: 'Immersive interactions and spatial gameplay' },
  { title: 'Game UI & UX', description: 'Menus, HUDs, onboarding, and responsive game interfaces' },
  { title: 'Bug fixing & project completion', description: 'Resolve blockers, finish features, and prepare for release' },
  { title: 'Optimization & build support', description: 'Performance tuning, WebGL builds, and platform integration' },
] as const

export const projects: Project[] = [
  {
    id: '004',
    slug: 'gulp-it-bro',
    title: 'GULP IT BRO!',
    category: 'Arcade / Arena',
    summary: 'Gulp tiny treats, grow into mega meals, and out-eat seven hungry rivals',
    description: 'A colorful single-player snack arena where every gulp helps you grow. Race seven AI rivals through a two-minute snack attack, swallow bigger meals, and chain quick gulps for up to four times the points.',
    features: ['Two-minute matches against seven AI rivals', '60 food variants across a colorful snack festival arena', 'Growth, gulp combos, timed refills, and four character flavors', 'Keyboard, mouse drag, and mobile touch controls'],
    technologies: ['Unity 6', 'C#', 'URP', 'Input System', 'WebGL'],
    platform: 'Browser · Desktop & touch · Landscape',
    role: 'Game design & Unity development',
    thumbnail: 'media/gulp-it-bro/gameplay.jpg',
    videoSource: null,
    poster: 'media/gulp-it-bro/title.jpg',
    playableUrl: 'https://trinitrointeractive.itch.io/gulp-it-bro',
    sourceUrl: null,
    status: 'Browser game · v2.0.0',
  },
  {
    id: '003',
    slug: 'maze-funker',
    title: 'MAZE FUNKER',
    category: 'First-person / Procedural Maze',
    summary: 'Find the emerald portal in a procedurally generated 3D maze',
    description: 'An atmospheric first-person maze where a custom virtual machine controls the world. Explore torchlit stone corridors, navigate winding passages, and find the emerald portal.',
    features: ['256 reproducible procedural maze seeds', 'Custom virtual-machine simulation running in a Web Worker', 'Keyboard, mouse, and touch controls with an optional survey map', 'Live simulation inspector, ambient audio, pause, and restart'],
    technologies: ['Three.js', 'JavaScript', 'Web Workers', 'WebGL'],
    platform: 'Browser · Desktop & touch',
    role: 'Game design & browser development',
    thumbnail: 'media/maze-funker/title.png',
    videoSource: null,
    poster: 'media/maze-funker/gameplay.png',
    playableUrl: 'https://trinitrointeractive.itch.io/maze-funker',
    sourceUrl: null,
    status: 'Browser game · v1.0.0',
  },
  {
    id: '001',
    slug: 'red-team-rockstars',
    title: 'RED TEAM ROCKSTARS',
    category: 'Game Development',
    summary: 'Build a cybersecurity company and manage a specialist crew',
    description: 'An isometric management game about growing a cybersecurity company while keeping an Evil Pendrive contained. All services and investigations are fictional.',
    features: ['107 cybersecurity tools connected to contracts and workstation requirements', 'Recruit a specialist crew with navigation and autonomous assignments', 'Company progression, equipment upgrades, deadlines, and payroll', 'Evil Pendrive containment, an interactive tutorial, and local save/continue'],
    technologies: ['Unity 6', 'C#', 'URP', 'AI Navigation', 'WebGL'],
    platform: 'Desktop browser · WebGL 2',
    role: 'Game design & Unity development',
    thumbnail: 'media/red-team-rockstars/headquarters.webp',
    videoSource: null,
    poster: 'media/red-team-rockstars/title.webp',
    playableUrl: 'https://trinitrointeractive.itch.io/red-team-rockstars',
    // Keep private repository links out of the public interface.
    sourceUrl: null,
    status: 'WebGL playtest · v0.9.0',
  },
  {
    id: '002',
    slug: 'the-vote',
    title: 'THE VOTE',
    category: 'Strategy / Card Game',
    summary: 'Negotiate support, make promises, and build a political career',
    description: 'A pixel-art strategy card game where trust, influence, and limited resources shape every election. Build coalitions and carry the consequences through a branching political career.',
    features: ['Three practice elections: School President, College President, and Governor', 'Negotiate with distinct characters, investigate priorities, and deliver promises', 'A branching political career with reputation, obligations, and a persistent timeline', 'Regional canvassing, browser saves, an ambient score, and reduced-motion settings'],
    technologies: ['Unity 6', 'C#', 'URP', 'WebGL'],
    platform: 'Browser · Mouse, touch & keyboard',
    role: 'Game design & Unity development',
    thumbnail: 'media/the-vote/title.webp',
    videoSource: null,
    poster: 'media/the-vote/campaign.webp',
    playableUrl: 'https://trinitrointeractive.itch.io/the-vote',
    sourceUrl: null,
    status: 'In development · v0.1.0',
  },
]

export function safeExternalUrl(value: string | null): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch { return undefined }
}

export function mediaUrl(value: string | null): string | undefined {
  if (!value) return undefined
  if (safeExternalUrl(value)) return value
  if (/^(?!\/\/)[\w./-]+(?:\?[^#]*)?$/.test(value)) {
    return `${import.meta.env.BASE_URL}${value.replace(/^\//, '')}`
  }
  return undefined
}

export function validEmail(value: string | null): value is string {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
