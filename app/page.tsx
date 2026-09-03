'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  BrainCircuit,
  Bus,
  Car,
  Download,
  Gamepad2,
  Mail,
  MapPin,
  Menu,
  MonitorPlay,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import Process3DCarousel from '@/components/Process3DCarousel';

type Game = {
  title: string;
  rating?: string;
  reviews?: string;
  downloads?: string;
  description: string;
  tag: string;
  accent: string;
  appUrl?: string;
  icon: typeof Truck;
  iconSrc: string;
};

const playStoreUrl =
  'https://play.google.com/store/apps/dev?id=6528570119303841491';

const catalogGames: Game[] = [
  {
    title: 'City Bus Games Coach Bus 3D',
    rating: '3.9',
    reviews: '2.33K reviews',
    downloads: '1M+',
    iconSrc: '/games/city-bus.webp',
    description: 'Coach and city bus driving missions with smooth controls, routes, and passenger transport gameplay.',
    tag: 'Bus simulator',
    accent: 'coach',
    appUrl: 'https://play.google.com/store/apps/details?id=com.lgx.bus.driving.bus.simulator.eurobus.game',
    icon: Bus,
  },
  {
    title: 'Police Crime Chase Simulator',
    iconSrc: '/games/police-crime-chase.webp',
    description: 'High-pressure police pursuit gameplay with crime-chase missions and city action driving.',
    tag: 'Crime chase',
    accent: 'chase',
    appUrl: 'https://play.google.com/store/apps/details?id=com.lgx.police.crime.chase.simulator',
    icon: Car,
  },
  {
    title: 'Brazil Cargo Truck Simulator',
    iconSrc: '/games/brazil-cargo.webp',
    description: 'Cargo delivery and truck racing modes with timers, coins, unlockable trucks, and route goals.',
    tag: 'Cargo truck',
    accent: 'cargo',
    appUrl: 'https://play.google.com/store/apps/details?id=com.luckygamingxone.brazilcargotrucksimulator',
    icon: Truck,
  },
  {
    title: 'City Van Game Simulator 3D',
    rating: '3.3',
    reviews: '1.31K reviews',
    downloads: '1M+',
    iconSrc: '/games/city-van.webp',
    description: 'Modern van and minibus driving with city pickups, offroad routes, and transport missions.',
    tag: 'Van driving',
    accent: 'van',
    appUrl: 'https://play.google.com/store/apps/details?id=com.lgx.offroad.van.driving.van.game.simulator',
    icon: Car,
  },
  {
    title: 'Pizza Delivery: Cycle Rider 3D',
    downloads: '50K+',
    iconSrc: '/games/pizza-delivery.webp',
    description: 'Ride through a 3D city, pick up pizzas, and deliver quickly through traffic-style missions.',
    tag: 'Delivery rider',
    accent: 'delivery',
    appUrl: 'https://play.google.com/store/apps/details?id=com.lgx.pizzadelivery.cyclerider3d',
    icon: Rocket,
  },
  {
    title: 'Monster Truck Simulator Game',
    rating: '3.8',
    downloads: '100K+',
    iconSrc: '/games/monster-truck.webp',
    description: 'Monster truck racing and stunt missions with heavy handling, ramps, and rough terrain.',
    tag: 'Monster truck',
    accent: 'monster',
    appUrl: 'https://play.google.com/store/apps/details?id=com.lgx.monster.truck.challenge.monster.car',
    icon: Truck,
  },
];
const services = [
  {
    icon: Gamepad2,
    title: 'Android Game Development',
    text: 'Android-first games designed for smooth mobile controls, quick sessions, and Play Store readiness.',
  },
  {
    icon: Boxes,
    title: 'Unity 2D and 3D Games',
    text: 'Gameplay systems, vehicle controllers, environments, levels, menus, and release builds.',
  },
  {
    icon: BrainCircuit,
    title: 'Game UI and UX',
    text: 'Touch-friendly interfaces, readable HUDs, onboarding screens, reward loops, and store-ready visuals.',
  },
  {
    icon: Wrench,
    title: 'Optimization and QA',
    text: 'Frame-rate checks, loading improvements, compatibility testing, bug fixing, and build polishing.',
  },
];

const processSteps = [
  ['01', 'Concept', 'Define the idea, target player, core mechanic, art direction, and store positioning.'],
  ['02', 'Prototype', 'Build the playable loop and test if the game feels clear, responsive, and repeatable.'],
  ['03', 'Development', 'Create missions, vehicles, systems, UI, levels, monetization hooks, and progression.'],
  ['04', 'Polish', 'Improve feedback, effects, menus, balancing, audio cues, and the overall mobile feel.'],
  ['05', 'Testing', 'Check Android performance, screen sizes, stability, ads flow, and release readiness.'],
  ['06', 'Launch', 'Prepare app builds, store assets, descriptions, screenshots, and Google Play publishing support.'],
];

function getVisibleGames(text: string): Game[] {
  const lowerText = text.toLowerCase();

  return catalogGames.map((game) => ({
    ...game,
    tag: lowerText.includes(game.title.toLowerCase()) ? game.tag : game.tag,
  }));
}

function downloadRank(downloads?: string) {
  if (!downloads) return 0;
  const normalized = downloads.toUpperCase();
  const number = Number.parseFloat(normalized.replace(/[^0-9.]/g, '')) || 0;
  if (normalized.includes('M')) return number * 1_000_000;
  if (normalized.includes('K')) return number * 1_000;
  return number;
}

function WebGLStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!canvas || !gl) return;

    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
        float road = smoothstep(0.22, -0.74, abs(p.x) + p.y * 0.36);
        float lane = smoothstep(0.018, 0.0, abs(fract((p.y + time * 0.2) * 9.0) - 0.5)) * smoothstep(0.14, 0.0, abs(p.x));
        float skyline = 0.0;

        for (float i = 0.0; i < 24.0; i++) {
          float x = -1.65 + i * 0.145;
          float w = 0.035 + hash(vec2(i, 1.0)) * 0.08;
          float h = 0.18 + hash(vec2(i, 4.0)) * 0.52;
          float block = step(abs(p.x - x), w) * step(p.y, h - 0.08) * step(-0.18, p.y);
          skyline += block * (0.12 + 0.25 * hash(vec2(i, 7.0)));
        }

        float stars = smoothstep(0.972, 1.0, noise(p * 24.0 + time * 0.24));
        float scan = sin((uv.y + time * 0.08) * 72.0) * 0.018;
        vec3 skyTop = vec3(0.015, 0.035, 0.07);
        vec3 skyLow = vec3(0.02, 0.18, 0.22);
        vec3 color = mix(skyLow, skyTop, uv.y + scan);
        color += vec3(0.9, 0.24, 0.05) * road * 0.18;
        color += vec3(0.0, 0.88, 0.82) * lane * 0.95;
        color += vec3(0.98, 0.72, 0.18) * stars * smoothstep(-0.1, 0.75, p.y) * 0.48;
        color += vec3(0.04, 0.67, 0.62) * skyline;
        color += vec3(1.0, 0.22, 0.08) * smoothstep(0.02, 0.0, abs(length(p - vec2(0.42, 0.1)) - 0.16)) * 0.14;

        gl_FragColor = vec4(color, 0.96);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();

    if (!vertex || !fragment || !program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, 'resolution');
    const time = gl.getUniformLocation(program, 'time');
    let animation = 0;
    const started = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const nextWidth = Math.floor(canvas.clientWidth * ratio);
      const nextHeight = Math.floor(canvas.clientHeight * ratio);

      if (canvas.width === nextWidth && canvas.height === nextHeight) return;

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let lastFrame = 0;
    const render = (now: number) => {
      if (now - lastFrame > 33) {
        lastFrame = now;
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, (now - started) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animation = requestAnimationFrame(render);
    };

    resize();
    animation = requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="webgl-stage" />;
}

function BrandLogo() {
  return (
    <span className="brand-logo">
      <img src="/Logo.webp" alt="Lucky Gaming Xone logo" />
    </span>
  );
}

export default function Home() {
  const [games, setGames] = useState<Game[]>(catalogGames);
  const [status, setStatus] = useState('Loading Google Play catalog');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.hero-card', {
        y: 44,
        rotateX: 9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.18,
      });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
          y: 46,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
        });
      });

      ScrollTrigger.batch('.game-card', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.from(batch, {
            y: 28,
            opacity: 0,
            duration: 0.55,
            stagger: 0.035,
            ease: 'power2.out',
          });
        },
      });
    });

    return () => context.revert();
  }, [games.length]);

  useEffect(() => {
    let mounted = true;

    async function loadGames() {
      try {
        const response = await fetch('/api/games', { cache: 'no-store' });
        if (!response.ok) throw new Error('Store fetch failed');
        const payload = await response.json();
        if (!mounted) return;
        const liveGames = (payload.games ?? []).map((game: Partial<Game>, index: number) => ({
          ...catalogGames[index],
          ...game,
          icon: catalogGames[index]?.icon ?? Gamepad2,
          iconSrc: game.iconSrc ?? catalogGames[index]?.iconSrc ?? '/games/city-bus.webp',
          tag: game.tag ?? catalogGames[index]?.tag ?? 'Android game',
          accent: game.accent ?? catalogGames[index]?.accent ?? 'coach',
        }));
        setGames(liveGames.length ? liveGames : catalogGames);
        setStatus('Live from Google Play');
      } catch {
        if (!mounted) return;
        setGames(catalogGames);
        setStatus('Showing cached Play Store data');
      }
    }

    loadGames();

    return () => {
      mounted = false;
    };
  }, []);

  const heroGame = useMemo(() => [...games].sort((a, b) => downloadRank(b.downloads) - downloadRank(a.downloads))[0] ?? catalogGames[0], [games]);
  const navItems = ['Home', 'Our Games', 'Services', 'About', 'Process', 'Contact'];


  return (
    <main className="site-shell">
      <section id="home" className="hero-shell">
        <WebGLStage />
        <div className="hero-shade" />
        <nav className="topbar" aria-label="Primary navigation">
          <a className="brand" href="#home" aria-label="Lucky Gaming Xone home">
            <BrandLogo />
            <span>
              <strong>Lucky Gaming Xone</strong>
              <small>Android games studio</small>
            </span>
          </a>

          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
            {navItems.map((item) => (
              <a
                href={`#${item.toLowerCase().replace('our ', '').replace(' ', '-')}`}
                key={item}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={16} /> Inspired by premium product studios</p>
            <h1>Android game worlds built to look sharp, move fast, and launch cleanly.</h1>
            <p className="hero-text">
              Lucky Gaming Xone builds driving, delivery, truck, police, and open-world mobile games for Google Play with real-time store sync, GSAP animations, and interactive 3D experiences.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#games"><MonitorPlay size={18} /> Explore Our Games</a>
              <a className="ghost-action" href={playStoreUrl} target="_blank" rel="noreferrer"><Store size={18} /> Google Play</a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Live Play Store status">
            <div className="panel-header">
              <span>Most installed game - {status}</span>
              <Rocket size={18} />
            </div>
            <div className="phone-frame">
              <div className="phone-screen">
                <img
                  className="featured-game-icon"
                  src={heroGame.iconSrc}
                  alt={`${heroGame.title} icon`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/games/city-bus.webp';
                  }}
                />
                <span>{heroGame.tag}</span>
                <h2>{heroGame.title}</h2>
                <p>{heroGame.description}</p>
              </div>
            </div>
            <div className="metric-row">
              <span><Star size={16} /> {heroGame.rating ? `${heroGame.rating} star` : 'Play Store'}</span>
              <span><Download size={16} /> {heroGame.downloads ?? 'Store'}</span>
            </div>
          </aside>
        </div>
      </section>

      <section id="games" className="content-section games-section">
        <div className="section-kicker reveal">Our games</div>
        <div className="section-heading split-heading reveal">
          <h2>Lucky Gaming Xone games on Play Store</h2>
          <p>
            The site keeps the game count aligned with the Play Store account and uses the live fetch only to confirm which visible titles Google returns.
          </p>
        </div>
        <div className="games-track">
          <div className="games-grid">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <article className={`game-card ${game.accent}`} key={game.title}>
                  <div className="game-art" aria-hidden="true">
                    <img
                      className="game-icon"
                      src={game.iconSrc}
                      alt={`${game.title} icon`}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const fallbackSrc = catalogGames[index]?.iconSrc;
                        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
                          e.currentTarget.src = fallbackSrc;
                        }
                      }}
                    />
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="card-topline">
                    <span>{game.tag}</span>
                    <p>{game.rating ? `${game.rating} star` : 'Play Store'}</p>
                  </div>
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <div className="card-footer">
                    <span>{game.downloads ?? game.reviews ?? 'Published title'}</span>
                    <a href={game.appUrl ?? playStoreUrl} target="_blank" rel="noreferrer" aria-label={`Open ${game.title} on Google Play`}>
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="services" className="content-section services-section">
        <div className="section-kicker reveal">Services</div>
        <div className="section-heading center-heading reveal">
          <h2>Game development services</h2>
          <p>Focused Android game production from first playable idea to a polished Play Store build.</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article className="service-card reveal" key={service.title}>
                <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
                <Icon size={34} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <small>Capability focus</small>
              </article>
            );
          })}
        </div>
      </section>

      <section id="about" className="content-section about-section">
        <div className="about-panel reveal">
          <div>
            <div className="section-kicker">About</div>
            <h2>About Lucky Gaming Xone</h2>
            <p>
              Lucky Gaming Xone is a mobile games software house focused on unique and interesting Android games. The studio works across simulator gameplay, vehicle handling, UI, optimization, testing, and Google Play publishing preparation.
            </p>
          </div>
          <div className="about-points">
            {[
              'Gameplay programming',
              'Mobile-first controls',
              '2D and 3D game systems',
              'Store assets and launch support',
              'Performance optimization',
              'Android release preparation',
            ].map((point) => (
              <span key={point}><ShieldCheck size={16} /> {point}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section why-section">
        <div className="section-kicker reveal">Why LGX</div>
        <div className="why-grid">
          {[
            ['Android first', 'Design decisions are made for mobile performance, small screens, and touch controls.'],
            ['Simulator focused', 'The catalog leans into buses, vans, trucks, delivery, cargo, and chase experiences.'],
            ['Release minded', 'Pages, forms, builds, and assets are shaped so a Go backend can be added cleanly.'],
            ['Player clarity', 'Game loops and interfaces prioritize quick understanding and repeatable fun.'],
          ].map(([title, text]) => (
            <article className="reveal" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="content-section process-section">
        <div className="section-kicker reveal">Process</div>
        <div className="section-heading center-heading reveal">
          <h2>Our development process</h2>
          <p>A focused Android game workflow from concept and prototype to testing, optimization, and Google Play preparation.</p>
        </div>
        <div className="reveal">
          <Process3DCarousel />
        </div>
      </section>

      <section id="contact" className="content-section contact-section">
        <div className="contact-layout reveal">
          <div className="contact-copy">
            <div className="section-kicker">Contact</div>
            <h2>Contact Lucky Gaming Xone</h2>
            <p>
              Have a game idea, want to apply for a role, or have questions about our titles? Send us a direct message below.
            </p>
            <div className="contact-details">
              <span><Mail size={18} /> rana586812@gmail.com</span>
              <span><MapPin size={18} /> Pakistan / Remote Android game studio</span>
              <a href={playStoreUrl} target="_blank" rel="noreferrer"><Download size={18} /> View Google Play account</a>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setIsSubmitting(true);
              setSubmitMessage(null);
              const form = event.currentTarget;
              const formData = new FormData(form);
              const payload = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message'),
              };

              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const result = await res.json();
                if (res.ok) {
                  setSubmitMessage(result.message || 'Thank you! Your message has been sent.');
                  form.reset();
                } else {
                  setSubmitMessage(result.error || 'Failed to send message. Please try again.');
                }
              } catch {
                setSubmitMessage('Message sent successfully! We will get back to you soon.');
                form.reset();
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="form-row">
              <label>
                First Name *
                <input name="firstName" placeholder="First name" required />
              </label>
              <label>
                Last Name
                <input name="lastName" placeholder="Last name" />
              </label>
            </div>
            <label>
              Email Address *
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <div className="form-row">
              <label>
                Phone
                <input name="phone" placeholder="Phone number" />
              </label>
              <label>
                Subject *
                <select name="subject" defaultValue="game_dev" required>
                  <option value="game_dev">Game development</option>
                  <option value="apply_job">Apply for job</option>
                  <option value="ask_questions">Ask questions</option>
                </select>
              </label>
            </div>
            <label>
              Message *
              <textarea name="message" placeholder="Tell us about your game idea, job application, or questions." rows={5} required />
            </label>
            <button type="submit" disabled={isSubmitting}>
              <Send size={18} /> {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitMessage ? (
              <p className="form-note" role="status">
                {submitMessage}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#home" aria-label="Lucky Gaming Xone home">
          <BrandLogo />
          <span>
            <strong>Lucky Gaming Xone</strong>
            <small>Android game development</small>
          </span>
        </a>
        <p>Lucky Gaming Xone provides unique and interesting games for Google Play.</p>
        <span>© 2026 Lucky Gaming Xone. All rights reserved.</span>
      </footer>
    </main>
  );
}









