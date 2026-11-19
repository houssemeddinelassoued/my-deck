// Catalogue des formations — deck piloté par les données.
//
// Les pages « formation » sont générées depuis assets/catalogue.json : une page
// par formation visible, avec le mur des logos des clients qui l'ont suivie.
// La dernière page (« Gestion », serveur de dev uniquement) édite ce fichier et
// téléverse les logos via la route du core `POST /__assets/<deck>/<fichier>`.
// Les données personnelles (e-mails, stagiaires) vivent dans
// assets/catalogue-prive.json, qui n'est JAMAIS importé : il ne part donc ni
// dans le build ni dans les liens de partage.
import { useIsActivePage, type DesignSystem, type Page, type SlideMeta } from '@open-slide/core';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import catalogueJson from './assets/catalogue.json';
import portrait from './assets/portrait-houssem.jpg';

export const design: DesignSystem = {
  palette: {
    bg: '#F5F3EE',
    text: '#14182B',
    accent: '#2F5BFF',
    muted: '#5D6478',
    card: '#FFFFFF',
    line: '#E2DED4',
    warm: '#FF6A3D',
  },
  fonts: {
    display: "'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, sans-serif",
    body: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  typeScale: { hero: 104, body: 32 },
  radius: 18,
};

// ─── One press = one step ───────────────────────────────────────────────────
// Holding an arrow key or a presenter-remote button makes the OS auto-repeat
// keydown (and some remotes fire a burst of presses), which the player turns
// into several reveals in a row. This capture-phase guard runs before the
// player's own listener and lets exactly one press through per hold, with a
// short cooldown. Installed once per window by whichever deck loads first —
// keep this block identical in every deck.
if (typeof window !== 'undefined') {
  const w = window as Window & { __osdOnePressGuard?: boolean };
  if (!w.__osdOnePressGuard) {
    w.__osdOnePressGuard = true;
    const NAV_KEYS = new Set(['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp']);
    const COOLDOWN_MS = 350;
    const held = new Set<string>();
    let last = Number.NEGATIVE_INFINITY;
    const isTyping = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    window.addEventListener(
      'keydown',
      (e) => {
        if (!NAV_KEYS.has(e.key) || isTyping(e.target)) return;
        const k = e.code || e.key;
        const now = performance.now();
        if (e.repeat || held.has(k) || now - last < COOLDOWN_MS) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        held.add(k);
        last = now;
      },
      true,
    );
    window.addEventListener('keyup', (e) => held.delete(e.code || e.key), true);
    window.addEventListener('blur', () => held.clear());
  }
}

// ─── Deck identity & runtime ────────────────────────────────────────────────
const SLIDE_ID = 'catalogue-formations';
type ViteMeta = {
  env?: { DEV?: boolean };
  glob: (pattern: string, opts: Record<string, unknown>) => Record<string, string>;
};
const DEV = !!(import.meta as unknown as ViteMeta).env?.DEV;
const IS_SHARE = typeof location !== 'undefined' && location.pathname.startsWith('/v/');
/** The management page exists only on the local dev server, never in builds or share links. */
const ADMIN = DEV && !IS_SHARE;

// Logos live flat in assets/ as logo-<id>.<ext> (the core's asset route has no sub-folders).
const LOGO_URLS = (import.meta as unknown as ViteMeta).glob('./assets/logo-*.{png,svg,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
function logoSrc(file: string | null | undefined, bust?: number): string | null {
  if (!file) return null;
  const bundled = LOGO_URLS[`./assets/${file}`];
  if (bundled && !bust) return bundled;
  if (DEV) return `/__assets/${SLIDE_ID}/${encodeURIComponent(file)}${bust ? `?v=${bust}` : ''}`;
  return bundled ?? null;
}

const C = {
  bg: 'var(--osd-bg)',
  text: 'var(--osd-text)',
  accent: 'var(--osd-accent)',
  muted: 'var(--osd-muted)',
  card: 'var(--osd-card)',
  line: 'var(--osd-line)',
  warm: 'var(--osd-warm)',
};
const DISPLAY = 'var(--osd-font-display)';

// ─── Data model ─────────────────────────────────────────────────────────────
type Centre = { id: string; nom: string; logo?: string | null; icone?: boolean; site?: string; masque?: boolean };
type Client = { id: string; nom: string; logo?: string | null; icone?: boolean; site?: string; secteur?: string; visible?: boolean };
type Formation = {
  id: string;
  titre: string;
  code?: string;
  jours: number;
  niveau?: string;
  centre?: string;
  deck?: string;
  visible: boolean;
  accroche?: string;
  points?: string[];
};
type Session = {
  id: string;
  formation: string;
  client?: string | null;
  centre?: string;
  via?: string;
  /** AAAA-MM-JJ, ou AAAA-MM si le jour exact n'est pas connu, ou vide (à planifier). */
  date?: string;
  jours?: number;
  participants?: number | null;
  mode?: string;
  ref?: string;
  annulee?: boolean;
  aVerifier?: boolean;
  note?: string;
  /** Id of the matching engagement in NQ App: dates, days, status and head-count follow NQ App. */
  nq?: number;
  /** Still an option (« proposée ») in NQ App: kept in Gestion, never shown on the slides. */
  option?: boolean;
  /** Never shown on the slides (private lessons…), still counted nowhere. */
  masquee?: boolean;
};
type Formateur = { nom: string; titre: string; email?: string; site?: string; accroche?: string; sousTitre?: string };
type Catalogue = {
  version: number;
  formateur: Formateur;
  centres: Centre[];
  clients: Client[];
  formations: Formation[];
  sessions: Session[];
  /** NQ App engagements deliberately left out of the catalogue. */
  nqIgnore?: number[];
  nqSyncAt?: string;
};
type Stagiaire = { nom: string; email?: string };
type Prive = {
  clients: Record<string, { email?: string; contact?: string; notes?: string }>;
  sessions: Record<string, { stagiaires?: Stagiaire[]; notes?: string }>;
};

const DATA = catalogueJson as unknown as Catalogue;

// ─── Dates & status ─────────────────────────────────────────────────────────
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MONTHS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function endOf(s: Session): Date | null {
  const d = s.date ?? '';
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (m) {
    const days = Math.max(1, Math.ceil(s.jours ?? 1));
    return new Date(+m[1], +m[2] - 1, +m[3] + days - 1, 23, 59);
  }
  m = /^(\d{4})-(\d{2})$/.exec(d);
  if (m) return new Date(+m[1], +m[2], 0, 23, 59);
  return null;
}
type Statut = 'realisee' | 'a-venir' | 'a-planifier' | 'annulee' | 'option';
function statutOf(s: Session, now = new Date()): Statut {
  if (s.annulee) return 'annulee';
  if (s.option) return 'option';
  const end = endOf(s);
  if (!end) return 'a-planifier';
  return end < now ? 'realisee' : 'a-venir';
}
const STATUT_LABEL: Record<Statut, string> = {
  realisee: 'Réalisée',
  'a-venir': 'À venir',
  'a-planifier': 'À planifier',
  annulee: 'Annulée',
  option: 'Option',
};
/** Sessions that may appear on the slides. */
const shown = (s: Session) => !s.annulee && !s.option && !s.masquee;
function fmtMonth(d?: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(d ?? '');
  return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : 'date à venir';
}
function fmtDay(d?: string): string {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(d ?? '');
  if (!m) return 'À planifier';
  return m[3] ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : `${MONTHS_LONG[+m[2] - 1]} ${m[1]}`;
}
const plural = (n: number, one: string, many: string) => `${String(n).replace('.', ',')} ${n > 1 ? many : one}`;
const fmtJours = (j: number) => `${String(j).replace('.', ',')} ${j > 1 ? 'jours' : 'jour'}`;

// ─── Derived views (slides) ─────────────────────────────────────────────────
// icone: the logo is a bare symbol, so the tile shows the name next to it.
type Tile = { key: string; nom: string; logo?: string | null; icone?: boolean; kind: 'client' | 'centre' };

function tileFor(cat: Catalogue, s: Session): Tile | null {
  const client = s.client ? cat.clients.find((c) => c.id === s.client) : undefined;
  if (client) {
    if (client.visible === false) return null;
    return { key: `client:${client.id}`, nom: client.nom, logo: client.logo, icone: client.icone, kind: 'client' };
  }
  // Inter-entreprises / public session: the training centre stands in for the client.
  const centre = cat.centres.find((c) => c.id === s.centre);
  if (!centre || centre.masque) return null;
  return { key: `centre:${centre.id}`, nom: centre.nom, logo: centre.logo, icone: centre.icone, kind: 'centre' };
}
function uniqTiles(tiles: (Tile | null)[]): Tile[] {
  const seen = new Set<string>();
  const out: Tile[] = [];
  for (const t of tiles) {
    const k = t?.logo ? `logo:${t.logo}` : t?.key;
    if (!t || !k || seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'client' ? -1 : 1));
}

function formationView(cat: Catalogue, f: Formation) {
  const sessions = cat.sessions.filter((s) => s.formation === f.id && shown(s));
  const done = sessions.filter((s) => statutOf(s) === 'realisee');
  const next = sessions.filter((s) => statutOf(s) !== 'realisee');
  const doneTiles = uniqTiles(done.map((s) => tileFor(cat, s)));
  const doneKeys = new Set(doneTiles.map((t) => t.key));
  const nextTiles = uniqTiles(next.map((s) => tileFor(cat, s))).filter((t) => !doneKeys.has(t.key));
  const centreIds = new Set<string>([...(f.centre ? [f.centre] : []), ...sessions.map((s) => s.centre ?? '')]);
  const centres = cat.centres.filter((c) => centreIds.has(c.id) && !c.masque).map((c) => c.nom);
  const participants = done.reduce((n, s) => n + (s.participants ?? 0), 0);
  const unknown = done.some((s) => s.participants == null);
  const jours = done.reduce((n, s) => n + (s.jours ?? f.jours), 0);
  return { sessions, done, next, doneTiles, nextTiles, centres, participants, unknown, jours };
}

function globalView(cat: Catalogue) {
  const visible = cat.formations.filter((f) => f.visible);
  const done = cat.sessions.filter((s) => shown(s) && statutOf(s) === 'realisee');
  const clientIds = new Set(done.map((s) => s.client).filter((x): x is string => !!x));
  const clients = cat.clients.filter((c) => clientIds.has(c.id) && c.visible !== false);
  const centreIds = new Set(cat.sessions.filter(shown).map((s) => s.centre ?? ''));
  const centres = cat.centres.filter((c) => centreIds.has(c.id) && !c.masque);
  const participants = done.reduce((n, s) => n + (s.participants ?? 0), 0);
  const jours = done.reduce((n, s) => n + (s.jours ?? 0), 0);
  return { visible, done, clients, centres, participants, jours };
}

// ─── Shared slide components ────────────────────────────────────────────────
const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  background: C.bg,
  color: C.text,
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  boxSizing: 'border-box',
};

const TONES = ['#2F5BFF', '#0E9F6E', '#C2410C', '#7C3AED', '#0369A1', '#B91C1C', '#A16207', '#0F766E'];
function toneOf(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

const LogoTile = ({ tile, w, h, faded, bust }: { tile: Tile; w: number; h: number; faded?: boolean; bust?: number }) => {
  const src = logoSrc(tile.logo, bust);
  const size = Math.max(18, Math.min(h * 0.3, (w * 1.55) / Math.max(4, tile.nom.length)));
  return (
    <div
      title={tile.nom}
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        background: C.card,
        border: `2px solid ${C.line}`,
        borderRadius: 'var(--osd-radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Math.round(h * 0.16),
        opacity: faded ? 0.72 : 1,
        position: 'relative',
      }}
    >
      {src && tile.icone ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(h * 0.14), maxWidth: '100%', height: '100%' }}>
          <img src={src} alt="" style={{ height: '100%', maxHeight: h * 0.62, flex: 'none', objectFit: 'contain' }} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.min(size, h * 0.26), lineHeight: 1.1, color: C.text, letterSpacing: '-0.01em' }}>
            {tile.nom}
          </span>
        </div>
      ) : src ? (
        <img src={src} alt={tile.nom} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      ) : (
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.1,
            color: toneOf(tile.nom),
            textAlign: 'center',
            letterSpacing: '-0.01em',
          }}
        >
          {tile.nom}
        </span>
      )}
      {tile.kind === 'centre' && (
        <span
          style={{
            position: 'absolute',
            bottom: 6,
            right: 10,
            fontSize: 15,
            fontWeight: 600,
            color: C.muted,
            letterSpacing: '0.04em',
          }}
        >
          INTER
        </span>
      )}
    </div>
  );
};

const Eyebrow = ({ children, color }: { children: ReactNode; color?: string }) => (
  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: color ?? C.accent, textTransform: 'uppercase' }}>
    {children}
  </div>
);

const Chip = ({ children, strong }: { children: ReactNode; strong?: boolean }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 44,
      padding: '0 20px',
      borderRadius: 999,
      fontSize: 22,
      fontWeight: 700,
      background: strong ? C.accent : C.card,
      color: strong ? '#fff' : C.text,
      border: strong ? 'none' : `2px solid ${C.line}`,
    }}
  >
    {children}
  </span>
);

const Footer = () => (
  <div
    style={{
      position: 'absolute',
      left: 110,
      right: 110,
      bottom: 36,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 20,
      color: C.muted,
    }}
  >
    <span>{DATA.formateur.nom} · Formations IA & développement</span>
    <span>{DATA.formateur.email}</span>
  </div>
);

function goto(index: number) {
  window.dispatchEvent(new CustomEvent('open-slide:goto', { detail: { index } }));
}

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 800, lineHeight: 1, color: C.text }}>{value}</span>
    <span style={{ fontSize: 24, color: C.muted }}>{label}</span>
  </div>
);

// ─── Page: cover ────────────────────────────────────────────────────────────
const G = globalView(DATA);
const fmtCount = (n: number, approx: boolean) => (approx ? `${n}+` : String(n));

const Cover: Page = () => (
  <div style={{ ...fill, padding: '110px 110px' }}>
    <div style={{ width: 1080, display: 'flex', flexDirection: 'column' }}>
      <Eyebrow>Catalogue des formations · {new Date().getFullYear()}</Eyebrow>
      <h1
        style={{
          fontFamily: DISPLAY,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: '-0.02em',
          margin: '30px 0 28px',
        }}
      >
        {DATA.formateur.accroche}
      </h1>
      <p style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.45, color: C.muted, margin: 0, maxWidth: 1000 }}>
        {DATA.formateur.sousTitre}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', columnGap: 20, marginTop: 64 }}>
        <Stat value={String(G.visible.length)} label="formations" />
        <Stat value={String(G.done.length)} label="sessions animées" />
        <Stat value={fmtCount(G.participants, true)} label="participants formés" />
        <Stat value={String(G.clients.length)} label="entreprises clientes" />
      </div>
      <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 800 }}>{DATA.formateur.nom}</span>
        <span style={{ fontSize: 26, color: C.muted }}>{DATA.formateur.titre}</span>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 130,
        top: 150,
        width: 520,
        height: 680,
        borderRadius: 40,
        background: C.accent,
        transform: 'rotate(3deg)',
      }}
    />
    <img
      src={portrait}
      alt={DATA.formateur.nom}
      style={{
        position: 'absolute',
        right: 130,
        top: 150,
        width: 520,
        height: 680,
        objectFit: 'cover',
        borderRadius: 40,
        boxShadow: '0 30px 60px rgba(20,24,43,0.18)',
      }}
    />
  </div>
);

// ─── Page: references (all clients) ─────────────────────────────────────────
function gridFor(n: number) {
  if (n <= 15) return { cols: 5, w: 316, h: 116, gap: 30 };
  if (n <= 24) return { cols: 6, w: 262, h: 100, gap: 26 };
  if (n <= 32) return { cols: 8, w: 194, h: 82, gap: 22 };
  return { cols: 9, w: 170, h: 76, gap: 18 };
}
// Two entities sharing the same logo file (e.g. two Docaposte entities) show one tile.
function dedupeByLogo(tiles: Tile[]): Tile[] {
  const seen = new Set<string>();
  return tiles.filter((t) => {
    const k = t.logo ? `logo:${t.logo}` : t.key;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const References: Page = () => {
  const clientTiles = dedupeByLogo(G.clients.map((c) => ({ key: c.id, nom: c.nom, logo: c.logo, icone: c.icone, kind: 'client' as const })));
  const g = gridFor(clientTiles.length);
  const shown = clientTiles.slice(0, g.cols * 4);
  const centres = G.centres.slice(0, 16);
  return (
    <div style={{ ...fill, padding: '100px 110px' }}>
      <Eyebrow>Références</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, margin: '18px 0 10px', letterSpacing: '-0.01em' }}>
        Ils ont formé leurs équipes avec moi
      </h2>
      <div style={{ fontSize: 28, color: C.muted }}>
        {plural(G.clients.length, 'entreprise', 'entreprises')} · {plural(G.done.length, 'session', 'sessions')} ·{' '}
        {plural(G.jours, 'jour animé', 'jours animés')}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${g.cols}, ${g.w}px)`,
          columnGap: g.gap,
          rowGap: g.gap,
          marginTop: 48,
        }}
      >
        {shown.map((t) => (
          <LogoTile key={t.key} tile={t} w={g.w} h={g.h} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 110, right: 110, bottom: 96 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, marginBottom: 16 }}>
          FORMATIONS ANIMÉES POUR LES CENTRES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 194px)', columnGap: 22, rowGap: 14 }}>
          {centres.map((c) => (
            <LogoTile key={c.id} tile={{ key: c.id, nom: c.nom, logo: c.logo, icone: c.icone, kind: 'client' }} w={194} h={68} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// ─── Pages: catalogue overview (clickable cards) ────────────────────────────
const VISIBLE = DATA.formations.filter((f) => f.visible);
const PER_OVERVIEW = 12;
const OVERVIEW_COUNT = Math.max(1, Math.ceil(VISIBLE.length / PER_OVERVIEW));
const FIRST_FORMATION_INDEX = 2 + OVERVIEW_COUNT;

const FormationCard = ({ f, index }: { f: Formation; index: number }) => {
  const v = formationView(DATA, f);
  return (
    // A div, not a <button>: the thumbnail rail already wraps each page in a button.
    <div
      role="link"
      data-inspector-ui
      onClick={() => goto(FIRST_FORMATION_INDEX + index)}
      style={{
        cursor: 'pointer',
        boxSizing: 'border-box',
        width: 404,
        height: 214,
        background: C.card,
        border: `2px solid ${C.line}`,
        borderRadius: 'var(--osd-radius)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 10, fontSize: 19, fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>
        {f.code && <span>{f.code}</span>}
        <span style={{ color: C.muted }}>{fmtJours(f.jours).toUpperCase()}</span>
        {f.niveau && <span style={{ color: C.muted }}>· {f.niveau.toUpperCase()}</span>}
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 26,
          fontWeight: 800,
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {f.titre}
      </div>
      <div style={{ marginTop: 'auto', fontSize: 19, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {v.done.length > 0
          ? plural(v.done.length, 'session animée', 'sessions animées')
          : v.next.length > 0
            ? `1re session : ${fmtMonth(v.next.map((s) => s.date ?? '').filter(Boolean).sort()[0])}`
            : 'Nouvelle au catalogue'}
        {v.centres[0] ? ` · ${v.centres[0]}` : ''}
      </div>
    </div>
  );
};

function makeOverview(part: number): Page {
  const slice = VISIBLE.slice(part * PER_OVERVIEW, (part + 1) * PER_OVERVIEW);
  const Overview: Page = () => (
    <div style={{ ...fill, padding: '100px 110px' }}>
      <Eyebrow>Le catalogue{OVERVIEW_COUNT > 1 ? ` · ${part + 1} / ${OVERVIEW_COUNT}` : ''}</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, margin: '18px 0 40px', letterSpacing: '-0.01em' }}>
        {part === 0 ? `${VISIBLE.length} formations, du poste de travail au code` : 'Le catalogue (suite)'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 404px)', columnGap: 28, rowGap: 26 }}>
        {slice.map((f, i) => (
          <FormationCard key={f.id} f={f} index={part * PER_OVERVIEW + i} />
        ))}
      </div>
      <Footer />
    </div>
  );
  return Overview;
}

// ─── Pages: one per formation ───────────────────────────────────────────────
const StatRow = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
    <span style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, lineHeight: 1, minWidth: 120 }}>{value}</span>
    <span style={{ fontSize: 24, color: C.muted, lineHeight: 1.25 }}>{label}</span>
  </div>
);

function makeFormationPage(f: Formation): Page {
  const FormationPage: Page = () => {
    const v = formationView(DATA, f);
    const big = v.doneTiles.length > 12;
    const tw = big ? 194 : 262;
    const th = big ? 80 : 100;
    const cols = big ? 8 : 6;
    const rows = Math.min(2, Math.ceil(v.doneTiles.length / cols));
    const shown = v.doneTiles.slice(0, cols * 2);
    const hidden = v.doneTiles.length - shown.length;
    const nextShown = v.nextTiles.slice(0, 6);
    return (
      <div style={{ ...fill, padding: '96px 110px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {f.code && <Chip strong>{f.code}</Chip>}
          <Chip>{fmtJours(f.jours)}</Chip>
          {f.niveau && <Chip>{f.niveau}</Chip>}
          {v.centres.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 22, color: C.muted }}>
              Animée pour <b style={{ color: C.text }}>{v.centres.join(' · ')}</b>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 28 }}>
          <div style={{ width: 1150 }}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: 66,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.015em',
                margin: 0,
              }}
            >
              {f.titre}
            </h2>
            {f.accroche && (
              <p style={{ fontSize: 30, lineHeight: 1.45, color: C.muted, margin: '20px 0 0' }}>{f.accroche}</p>
            )}
            {f.points && f.points.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 560px)', columnGap: 30, rowGap: 14, marginTop: 30 }}>
                {f.points.slice(0, 4).map((p) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, lineHeight: 1.3 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: C.warm, flex: 'none' }} />
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              width: 510,
              boxSizing: 'border-box',
              background: C.card,
              border: `2px solid ${C.line}`,
              borderRadius: 'var(--osd-radius)',
              padding: '30px 34px',
              display: 'flex',
              flexDirection: 'column',
              gap: 26,
              alignSelf: 'flex-start',
            }}
          >
            <StatRow value={String(v.done.length)} label={v.done.length > 1 ? 'sessions animées' : 'session animée'} />
            {v.participants > 0 || v.doneTiles.length === 0 ? (
              <StatRow value={fmtCount(v.participants, v.unknown && v.done.length > 0)} label="participants formés" />
            ) : (
              // Head-counts unknown: show how many organisations instead of a meaningless « 0+ ».
              <StatRow value={String(v.doneTiles.length)} label={v.doneTiles.length > 1 ? 'entreprises et centres' : 'entreprise ou centre'} />
            )}
            <StatRow value={String(v.jours).replace('.', ',')} label={v.jours > 1 ? 'jours de formation' : 'jour de formation'} />
          </div>
        </div>

        <div style={{ position: 'absolute', left: 110, right: 110, bottom: 84 }}>
          {v.doneTiles.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, marginBottom: 14 }}>
                <span>ILS ONT SUIVI CETTE FORMATION</span>
                {hidden > 0 && <span>+ {hidden} autres</span>}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, ${tw}px)`,
                  gridTemplateRows: `repeat(${rows}, ${th}px)`,
                  columnGap: 24,
                  rowGap: 20,
                }}
              >
                {shown.map((t) => (
                  <LogoTile key={t.key} tile={t} w={tw} h={th} />
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                height: 120,
                borderRadius: 'var(--osd-radius)',
                border: `2px dashed ${C.line}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 36px',
                fontSize: 28,
                color: C.muted,
              }}
            >
              Nouvelle formation au catalogue — premières sessions sur demande.
            </div>
          )}
          {nextShown.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20 }}>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: C.warm, width: 230 }}>PROCHAINEMENT</span>
              {nextShown.map((t) => (
                <LogoTile key={t.key} tile={t} w={200} h={68} faded />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  };
  return FormationPage;
}

// ─── Page: contact ──────────────────────────────────────────────────────────
const Contact: Page = () => (
  <div style={{ ...fill, padding: '110px 110px', display: 'flex', alignItems: 'center', gap: 110 }}>
    <img
      src={portrait}
      alt={DATA.formateur.nom}
      style={{ width: 420, height: 520, objectFit: 'cover', borderRadius: 40, flex: 'none' }}
    />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Eyebrow>Contact</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontSize: 84, fontWeight: 800, lineHeight: 1.06, margin: '24px 0 28px', letterSpacing: '-0.02em' }}>
        Construisons la formation de vos équipes
      </h2>
      <p style={{ fontSize: 32, lineHeight: 1.5, color: C.muted, margin: 0, maxWidth: 1100 }}>
        Programme adapté à vos outils et à vos cas réels, en distanciel ou sur site, avec des ateliers pratiques sur poste.
      </p>
      <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800 }}>{DATA.formateur.nom}</span>
        <span style={{ fontSize: 28, color: C.muted }}>{DATA.formateur.titre}</span>
        {DATA.formateur.email && <span style={{ fontSize: 30, color: C.accent, fontWeight: 700 }}>{DATA.formateur.email}</span>}
        {DATA.formateur.site && <span style={{ fontSize: 28 }}>{DATA.formateur.site}</span>}
      </div>
    </div>
  </div>
);

// ─── Page: gestion (dev server only) ────────────────────────────────────────
const RETURN_KEY = 'osd-catalogue-gestion';
type Tab = 'sessions' | 'clients' | 'formations' | 'centres' | 'formateur' | 'nq';
type ReturnState = { tab: Tab; sel: string | null; t: number };
// Saving catalogue.json (or a logo) hot-reloads this module, possibly more than once:
// read where we were without consuming it; the active Gestion page clears it once restored.
function readReturn(): ReturnState | null {
  if (!ADMIN || typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(RETURN_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as ReturnState;
    return Date.now() - v.t < 20000 ? v : null;
  } catch {
    return null;
  }
}

const ASSET_URL = (name: string) => `/__assets/${SLIDE_ID}/${encodeURIComponent(name)}`;
async function writeAsset(name: string, body: BodyInit, type: string) {
  const res = await fetch(`${ASSET_URL(name)}?overwrite=1`, { method: 'POST', headers: { 'content-type': type }, body });
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error ?? `HTTP ${res.status}`);
  }
}
async function readAsset<T>(name: string): Promise<T | null> {
  const res = await fetch(ASSET_URL(name), { cache: 'no-store' });
  if (!res.ok) return null;
  return (await res.json()) as T;
}
const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};
function slugify(s: string): string {
  return (
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'item'
  );
}
function uniqueId(base: string, taken: string[]): string {
  let id = slugify(base);
  let n = 2;
  while (taken.includes(id)) id = `${slugify(base)}-${n++}`;
  return id;
}
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
/** « Nom <email> », « Nom ; email », « Nom, email », « email » — one person per line. */
function parseStagiaires(text: string): Stagiaire[] {
  const out: Stagiaire[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const email = /[\w.+-]+@[\w-]+(\.[\w-]+)+/.exec(line)?.[0];
    const nom = (email ? line.replace(email, '') : line).replace(/[<>;,\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ nom: nom || (email ? email.split('@')[0] : ''), email });
  }
  return out;
}

const ADMIN_CSS = `
.ctg-root { font-family: var(--osd-font-body); color: var(--osd-text); }
.ctg-root * { box-sizing: border-box; }
.ctg-in { font: inherit; font-size: 22px; padding: 10px 14px; border: 2px solid var(--osd-line); border-radius: 10px;
  background: #fff; color: var(--osd-text); width: 100%; outline: none; }
.ctg-in:focus { border-color: var(--osd-accent); }
textarea.ctg-in { resize: vertical; line-height: 1.4; }
.ctg-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ctg-field > span { font-size: 17px; font-weight: 700; letter-spacing: 0.06em; color: var(--osd-muted); text-transform: uppercase; }
.ctg-btn { font: inherit; font-size: 20px; font-weight: 700; padding: 10px 18px; border-radius: 10px; cursor: pointer;
  border: 2px solid var(--osd-line); background: #fff; color: var(--osd-text); white-space: nowrap; }
.ctg-btn:hover { border-color: var(--osd-accent); }
.ctg-btn:disabled { opacity: 0.45; cursor: default; }
.ctg-btn.primary { background: var(--osd-accent); border-color: var(--osd-accent); color: #fff; }
.ctg-btn.danger { color: #B42318; }
.ctg-btn.danger.armed { background: #B42318; border-color: #B42318; color: #fff; }
.ctg-tab { font: inherit; font-size: 21px; font-weight: 700; padding: 10px 16px; border-radius: 10px; cursor: pointer;
  border: none; background: transparent; color: var(--osd-muted); white-space: nowrap; flex: none; }
.ctg-tab.on { background: var(--osd-text); color: #fff; }
.ctg-item { all: unset; display: block; width: 100%; box-sizing: border-box; padding: 14px 16px; border-radius: 12px; cursor: pointer;
  border: 2px solid transparent; }
.ctg-item:hover { background: rgba(47,91,255,0.06); }
.ctg-item.on { border-color: var(--osd-accent); background: #fff; }
.ctg-scroll { overflow-y: scroll; overscroll-behavior: contain; scrollbar-width: auto; scrollbar-color: #9AA1B4 #ECE8DF; }
.ctg-scroll::-webkit-scrollbar { width: 18px; }
.ctg-scroll::-webkit-scrollbar-track { background: #ECE8DF; border-radius: 9px; }
.ctg-scroll::-webkit-scrollbar-thumb { background: #9AA1B4; border-radius: 9px; border: 3px solid #ECE8DF; min-height: 60px; }
.ctg-scroll::-webkit-scrollbar-thumb:hover { background: var(--osd-accent); }
.ctg-check { display: flex; align-items: center; gap: 10px; font-size: 21px; cursor: pointer; }
.ctg-check input { width: 22px; height: 22px; accent-color: var(--osd-accent); }
.ctg-badge { display: inline-block; font-size: 15px; font-weight: 800; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 6px; }
`;
const BADGE: Record<Statut, CSSProperties> = {
  realisee: { background: '#DCFCE7', color: '#166534' },
  'a-venir': { background: '#DBEAFE', color: '#1E40AF' },
  'a-planifier': { background: '#FEF3C7', color: '#92400E' },
  annulee: { background: '#F3F4F6', color: '#6B7280' },
  option: { background: '#EDE9FE', color: '#5B21B6' },
};

const Field = ({ label, children, w }: { label: string; children: ReactNode; w?: number | string }) => (
  <label className="ctg-field" style={{ width: w }}>
    <span>{label}</span>
    {children}
  </label>
);
const Row = ({ children, gap = 18 }: { children: ReactNode; gap?: number }) => (
  <div style={{ display: 'flex', gap, alignItems: 'flex-end', width: '100%' }}>{children}</div>
);
const Section = ({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 18, borderTop: `2px solid ${C.line}` }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 22, fontWeight: 800 }}>{title}</span>
      {right}
    </div>
    {children}
  </div>
);

const DangerButton = ({ label, onConfirm, disabled }: { label: string; onConfirm: () => void; disabled?: boolean }) => {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3500);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      className={`ctg-btn danger${armed ? ' armed' : ''}`}
      disabled={disabled}
      onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
    >
      {armed ? 'Confirmer ?' : label}
    </button>
  );
};

/** Drop, paste (Ctrl+V) or browse an image; shows the current logo. */
const LogoDrop = ({ nom, logo, bust, onFile, onRemove }: {
  nom: string;
  logo?: string | null;
  bust?: number;
  onFile: (f: File) => void;
  onRemove: () => void;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const pick = (files: FileList | null | undefined) => {
    const f = files?.[0];
    if (f) onFile(f);
  };
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <LogoTile tile={{ key: 'p', nom: nom || '—', logo, kind: 'client' }} w={260} h={100} bust={bust} />
      <div
        tabIndex={0}
        data-ctg-key
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/'));
          if (f) {
            e.preventDefault();
            onFile(f);
          }
        }}
        style={{
          flex: 1,
          height: 100,
          borderRadius: 12,
          border: `2px dashed ${over ? 'var(--osd-accent)' : C.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 19,
          color: C.muted,
          cursor: 'pointer',
          background: over ? 'rgba(47,91,255,0.06)' : 'transparent',
          outline: 'none',
        }}
      >
        Glisser un logo ici, cliquer pour parcourir,
        <br />
        ou cliquer puis coller (Ctrl+V) — PNG, SVG, JPG, WebP
      </div>
      <input
        ref={input}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
      {logo && (
        <button type="button" className="ctg-btn" onClick={onRemove}>
          Retirer
        </button>
      )}
    </div>
  );
};

// ─── NQ App synchronisation (dev server only) ───────────────────────────────
// NQ App (Q:\National-Quantum-Company-System, http://127.0.0.1:8400) is the reference for
// sessions: dates, days, status and head-count follow it. Nothing is ever written to NQ App,
// and nothing private (rates, payments, notes) is copied: only the fields of nqFields().
// Decided 2026-11-19: NQ → catalogue only; options imported but never shown; private lessons
// and events that are not trainings are left out.
const NQ_API = 'http://127.0.0.1:8400/api/engagements';
type NqEngagement = {
  id: number;
  kind: string;
  title: string;
  status: string;
  start_date: string;
  end_date?: string | null;
  days_milli?: number | null;
  participants?: number | null;
  mode?: string | null;
  notes?: string | null;
  client_name?: string | null;
};
const NQ_STATUS: Record<string, string> = { realise: 'Réalisée', confirme: 'Confirmée', option: 'Option', annule: 'Annulée' };
const NQ_STATUS_STYLE: Record<string, CSSProperties> = {
  realise: BADGE_STYLE('#DCFCE7', '#166534'),
  confirme: BADGE_STYLE('#DBEAFE', '#1E40AF'),
  option: BADGE_STYLE('#EDE9FE', '#5B21B6'),
  annule: BADGE_STYLE('#F3F4F6', '#6B7280'),
};
function BADGE_STYLE(background: string, color: string): CSSProperties {
  return { background, color };
}

function nqField(notes: string | null | undefined, key: string): string {
  const m = new RegExp(`${key.replace(/[/]/g, '\\/')} : ([^\\n|]*)`).exec(notes ?? '');
  return m ? m[1].trim() : '';
}
const normTxt = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const STOPWORDS = new Set(
  'de la le les des et pour a l d du en au aux avec ia formation un une sur par dans j session introduction base'.split(' '),
);
const tokensOf = (s: string) =>
  new Set(
    normTxt(s)
      .split(' ')
      .filter((t) => t.length > 1 && !STOPWORDS.has(t))
      .map((t) => (t.length > 4 ? t.replace(/s$/, '').replace(/e+$/, '') : t)),
  );
/** Dice coefficient on stemmed words: 1 = same words, 0 = nothing in common. */
function similarity(a: string, b: string): number {
  const A = tokensOf(a);
  const B = tokensOf(b);
  let n = 0;
  for (const t of A) if (B.has(t)) n++;
  return A.size + B.size ? (2 * n) / (A.size + B.size) : 0;
}
const dayNum = (d?: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(d ?? '') ? Date.parse(d!) / 864e5 : /^\d{4}-\d{2}$/.test(d ?? '') ? Date.parse(`${d}-15`) / 864e5 : NaN;

/** Private lessons and events that are not trainings never reach the catalogue. */
function nqExcluded(e: NqEngagement): string | null {
  if (e.kind !== 'formation') return 'Pas une formation';
  if (/^(Nadia Sboui|Mehrez Boufaden)$/i.test(e.client_name ?? '')) return 'Cours particulier';
  if (/hackathon|pitch|cours iot/i.test(e.title)) return 'Événement, pas une formation';
  if (/titre non renseign/i.test(e.title)) return 'Titre non renseigné dans NQ App';
  return null;
}

// Organisme / donneur d'ordre (NQ App) → centre and, sometimes, final client (catalogue).
const NQ_ORG_RULES: [RegExp, string, string?][] = [
  [/docaposte bpo/i, 'docaposte-institute', 'docaposte-bpo'],
  [/docaposte/i, 'docaposte-institute'],
  [/technologia|t[ée]luq|canada/i, 'technologia'],
  [/atos/i, 'global-knowledge', 'atos'],
  [/sogeti/i, 'global-knowledge', 'sogeti'],
  [/computacenter/i, 'global-knowledge', 'computacenter'],
  [/\bgk\b|global ?knowledge/i, 'global-knowledge'],
  [/demos|caissedesdepots/i, 'demos', 'caisse-des-depots'],
  [/\bplb\b/i, 'plb'],
  [/fitec/i, 'fitec'],
  [/passerelle|\bpmn\b/i, 'pmn'],
  [/omicrone/i, 'fitec', 'omicrone'],
  [/m2i|mii formation/i, 'm2i'],
  [/majda/i, 'zitouna-academy', 'majda'],
  [/elitek/i, 'elitek'],
  [/classx/i, 'classx'],
  [/telnet/i, 'gomycode', 'telnet'],
  [/gomycode/i, 'gomycode'],
  [/skillia/i, 'skillia'],
  [/compto/i, 'national-quantum', 'compto'],
  [/\bfsb\b|idea lab|pole dev bizerte/i, 'national-quantum', 'fsb'],
  [/zitouna/i, 'zitouna-academy'],
  [/prohat|alenia/i, 'prohat'],
  [/beder/i, 'inspark', 'beder'],
  [/smart for green/i, 'national-quantum'],
];
const GENERIC = new Set(['groupe', 'group', 'inc', 'agence', 'compagnie', 'quebec', 'services', 'solutions', 'formation', 'lab', 'smart', 'national']);
// NQ titles that name a catalogue formation in other words.
const NQ_TITLE_ALIASES: [RegExp, string][] = [
  [/gh-?300/i, 'gh300'],
  [/gemini/i, 'gemini-entreprise'],
  [/core programming/i, 'gk-java'],
  [/\btdd\b|test driven/i, 'tdd'],
  [/[ée]thique/i, 'ia114'],
  [/copilot.*avanc|github avanc/i, 'copilot-avance'],
  [/copilot/i, 'copilot-debutant'],
  [/[ée]co-?(responsable|conception)/i, 'eco-conception'],
  [/ui.?(et )?ux|figma/i, 'figma-uiux'],
  [/agile|scrum|jira/i, 'agile-scrum'],
  [/certif.*java|java.*certif|\boc[ap]\b/i, 'certif-java'],
  [/gen ?ai|genai/i, 'genai-pro'],
  [/\brhs?\b|ressources humaines/i, 'ia-pour-les-rh'],
  [/nosql|\bsql\b|base de donn/i, 'bases-de-donnees'],
  [/\btesting\b|test dans/i, 'testing'],
  [/vernis technolog|panorama des technolog/i, 'panorama-tech'],
  [/\bgit\b|github|versionn/i, 'git'],
];
const NQ_GK_CODES: [RegExp, string][] = [
  [/GKSI/, 'gksi'],
  [/GKDVPJ/, 'projet-info'],
  [/GKSQL/, 'bases-de-donnees'],
  [/GKCOBJ|GKCOKJ/, 'conception-objet'],
  [/GKJAVA|GKOTH/, 'gk-java'],
  [/GKIADEV/, 'dev-ia-boostez'],
];
const nqCode = (title: string) => /\b((?:IA|TI)\s?\d{3})/i.exec(title)?.[1].replace(/\s/g, '').toUpperCase() ?? '';
const nqCleanTitle = (title: string) =>
  title
    .replace(/^(?:IA|TI)\s?\d{3}F?\s*[-–:]\s*/i, '')
    .replace(/^S\d+\s*-\s*/i, '')
    .trim();

function nqGuess(cat: Catalogue, e: NqEngagement) {
  const org = nqField(e.notes, 'Organisme');
  const final = nqField(e.notes, 'Session / client final');
  let centre = '';
  let client = '';
  for (const text of [org, e.client_name ?? '']) {
    const rule = NQ_ORG_RULES.find(([re]) => re.test(text));
    if (rule) {
      centre = rule[1];
      client = rule[2] ?? '';
      break;
    }
  }
  if (!client) {
    const hay = tokensOf(`${final} ${e.title}`);
    const hit = cat.clients.find((c) => [...tokensOf(c.nom)].some((t) => t.length >= 4 && !GENERIC.has(t) && hay.has(t)));
    if (hit) client = hit.id;
  }
  if (!cat.centres.some((c) => c.id === centre)) centre = '';
  if (!cat.clients.some((c) => c.id === client)) client = '';
  const via = /freelance provider/i.test(e.client_name ?? '') ? 'freelance-provider' : /fcit/i.test(e.client_name ?? '') ? 'fcit' : '';
  // Formation: catalogue code (IA132…) first, then title, then the GK course code.
  let formation = '';
  const code = nqCode(e.title);
  if (code) formation = cat.formations.find((f) => (f.code ?? '').toUpperCase() === code)?.id ?? '';
  if (!formation) {
    const alias = NQ_TITLE_ALIASES.find(([re]) => re.test(e.title))?.[1];
    if (alias && cat.formations.some((f) => f.id === alias)) formation = alias;
  }
  if (!formation) {
    let score = 0;
    for (const f of cat.formations) {
      const sc = similarity(nqCleanTitle(e.title), `${f.titre} ${f.code ?? ''}`);
      if (sc > score) {
        score = sc;
        formation = f.id;
      }
    }
    if (score < 0.5) formation = '';
  }
  if (!formation) {
    const gk = nqField(e.notes, 'Code');
    formation = NQ_GK_CODES.find(([re]) => re.test(gk))?.[1] ?? '';
    if (!cat.formations.some((f) => f.id === formation)) formation = '';
  }
  return { formation, client, centre, via };
}

/** The only fields copied from NQ App. The mode is taken for new sessions only: NQ App
 *  marks several remote sessions « présentiel ». Head-counts above 300 are typing slips. */
function nqFields(e: NqEngagement, prev?: Session): Partial<Session> {
  const p = e.participants != null && e.participants > 0 && e.participants <= 300 ? e.participants : null;
  return {
    date: e.start_date,
    jours: e.days_milli != null ? e.days_milli / 1000 : prev?.jours,
    participants: p ?? prev?.participants ?? null,
    mode: prev ? prev.mode : e.mode === 'presentiel' ? 'presentiel' : 'distanciel',
    option: e.status === 'option' || undefined,
    annulee: e.status === 'annule' || undefined,
  };
}
function nqChanges(s: Session, f: Partial<Session>): string[] {
  const out: string[] = [];
  if (f.date !== s.date) out.push(`date ${fmtDay(s.date)} → ${fmtDay(f.date)}`);
  if (f.jours !== s.jours) out.push(`jours ${s.jours ?? '?'} → ${f.jours ?? '?'}`);
  if ((f.participants ?? null) !== (s.participants ?? null)) out.push(`participants ${s.participants ?? '?'} → ${f.participants ?? '?'}`);
  if (!!f.option !== !!s.option) out.push(f.option ? 'devient une option (masquée)' : 'n’est plus une option');
  if (!!f.annulee !== !!s.annulee) out.push(f.annulee ? 'annulée' : 'n’est plus annulée');
  return out;
}

type NqAction = 'ajouter' | 'associer' | 'ignorer';
type NqRow = {
  e: NqEngagement;
  linked?: Session;
  candidate?: Session;
  excluded?: string;
  guess: { formation: string; client: string; centre: string; via: string };
};
function nqPlan(cat: Catalogue, list: NqEngagement[]) {
  const byNq = new Map(cat.sessions.filter((s) => s.nq != null).map((s) => [s.nq!, s]));
  const ignored = new Set(cat.nqIgnore ?? []);
  const rows: NqRow[] = list
    .filter((e) => e.kind === 'formation')
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .map((e) => ({
      e,
      linked: byNq.get(e.id),
      excluded: nqExcluded(e) ?? (ignored.has(e.id) ? 'Ignorée lors d’une synchronisation précédente' : undefined),
      guess: nqGuess(cat, e),
    }));
  // First sync: propose to link NQ engagements to catalogue sessions not linked yet
  // (closest date, then formation or client), best pairs first.
  const free = cat.sessions.filter((s) => s.nq == null);
  const pairs: { r: NqRow; s: Session; score: number }[] = [];
  for (const r of rows) {
    if (r.linked || r.excluded) continue;
    for (const s of free) {
      const titre = cat.formations.find((f) => f.id === s.formation)?.titre ?? '';
      const sameF = !!r.guess.formation && r.guess.formation === s.formation;
      const sameC = !!r.guess.client && r.guess.client === s.client;
      let score: number;
      if (!s.date) score = sameF || sameC ? 0.6 : 0;
      else {
        const dd = Math.abs(dayNum(r.e.start_date) - dayNum(s.date));
        // Same formation: dates from the CV can be a few days off.
        const tol = s.date.length === 7 ? (sameF ? 31 : 20) : sameF ? 10 : 4;
        if (!(dd <= tol)) continue;
        score = (sameF ? 1 : similarity(nqCleanTitle(r.e.title), titre)) + (sameC ? 0.3 : 0) - dd / 40;
      }
      if (score > 0.25) pairs.push({ r, s, score });
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  const usedS = new Set<string>();
  for (const p of pairs) {
    if (p.r.candidate || usedS.has(p.s.id)) continue;
    p.r.candidate = p.s;
    usedS.add(p.s.id);
  }
  const ids = new Set(list.map((e) => e.id));
  const orphans = cat.sessions.filter((s) => s.nq != null && !ids.has(s.nq));
  const linkedIds = new Set([...byNq.values()].map((s) => s.id));
  const horsNq = cat.sessions.filter((s) => s.nq == null && !usedS.has(s.id) && !linkedIds.has(s.id));
  return { rows, orphans, horsNq };
}

const NqSync = ({ cat, busy, onApply }: { cat: Catalogue; busy: boolean; onApply: (next: Catalogue, summary: string) => void }) => {
  const [data, setData] = useState<NqEngagement[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [over, setOver] = useState<Record<number, Partial<{ action: NqAction; formation: string; client: string; centre: string; skip: boolean }>>>({});
  const [unlink, setUnlink] = useState<Record<string, boolean>>({});
  const [showHors, setShowHors] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(NQ_API, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as NqEngagement[]);
      setOver({});
      setUnlink({});
    } catch (e) {
      setErr(`NQ App ne répond pas (${(e as Error).message}). Lance-la (nq-app/start.ps1, http://127.0.0.1:8400) puis clique sur « Relire NQ App ».`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const plan = useMemo(() => (data ? nqPlan(cat, data) : null), [cat, data]);
  if (!plan) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 22 }}>
        <span style={{ fontSize: 30, fontWeight: 800 }}>Synchronisation avec NQ App</span>
        {err ? <span style={{ color: '#B42318' }}>{err}</span> : <span style={{ color: C.muted }}>Lecture de NQ App…</span>}
        <button type="button" className="ctg-btn" style={{ alignSelf: 'flex-start' }} disabled={loading} onClick={() => void load()}>
          Relire NQ App
        </button>
      </div>
    );
  }

  const fName = (id?: string) => cat.formations.find((f) => f.id === id)?.titre ?? '';
  const updates = plan.rows
    .filter((r) => r.linked)
    .map((r) => ({ r, changes: nqChanges(r.linked!, nqFields(r.e, r.linked)) }))
    .filter((x) => x.changes.length > 0);
  const upToDate = plan.rows.filter((r) => r.linked).length - updates.length;
  const fresh = plan.rows.filter((r) => !r.linked && !r.excluded);
  const excluded = plan.rows.filter((r) => !r.linked && r.excluded);
  const actionOf = (r: NqRow): NqAction =>
    over[r.e.id]?.action ?? (r.excluded ? 'ignorer' : r.candidate ? 'associer' : r.e.status === 'annule' ? 'ignorer' : 'ajouter');
  const pick = (r: NqRow) => ({
    formation: over[r.e.id]?.formation ?? r.guess.formation,
    client: over[r.e.id]?.client ?? r.guess.client,
    centre: over[r.e.id]?.centre ?? r.guess.centre,
  });
  const setOv = (id: number, v: Partial<{ action: NqAction; formation: string; client: string; centre: string; skip: boolean }>) =>
    setOver((o) => ({ ...o, [id]: { ...o[id], ...v } }));

  const nUpd = updates.filter((x) => !over[x.r.e.id]?.skip).length;
  const nAdd = [...fresh, ...excluded].filter((r) => actionOf(r) === 'ajouter').length;
  const nLink = fresh.filter((r) => actionOf(r) === 'associer').length;
  const nIgn = fresh.filter((r) => actionOf(r) === 'ignorer').length;
  const nUnlink = plan.orphans.filter((s) => unlink[s.id] !== false).length;
  const total = nUpd + nAdd + nLink + nIgn + nUnlink;

  const apply = () => {
    const next = structuredClone(cat);
    const sById = (id: string) => next.sessions.find((s) => s.id === id);
    const created = new Map<string, string>();
    const ensureFormation = (r: NqRow, centre: string): string => {
      const title = nqCleanTitle(r.e.title);
      const key = nqCode(r.e.title) || normTxt(title);
      const known = created.get(key);
      if (known) return known;
      const id = uniqueId(title, next.formations.map((f) => f.id));
      next.formations.push({
        id,
        titre: title,
        code: nqCode(r.e.title),
        jours: r.e.days_milli ? r.e.days_milli / 1000 : 1,
        niveau: '',
        centre,
        deck: '',
        visible: true,
        accroche: '',
        points: [],
      });
      created.set(key, id);
      return id;
    };
    for (const { r } of updates) {
      if (over[r.e.id]?.skip) continue;
      const s = sById(r.linked!.id);
      if (s) Object.assign(s, nqFields(r.e, s), { aVerifier: false });
    }
    const ignore = new Set(next.nqIgnore ?? []);
    for (const r of [...fresh, ...excluded]) {
      const a = actionOf(r);
      if (a === 'ignorer') {
        if (!nqExcluded(r.e)) ignore.add(r.e.id);
        continue;
      }
      ignore.delete(r.e.id);
      if (a === 'associer' && r.candidate) {
        const s = sById(r.candidate.id);
        if (s) Object.assign(s, nqFields(r.e, s), { nq: r.e.id, aVerifier: false });
        continue;
      }
      const p = pick(r);
      const formation = p.formation || ensureFormation(r, p.centre);
      next.sessions.push({
        id: uniqueId(`s-nq-${r.e.id}`, next.sessions.map((s) => s.id)),
        formation,
        client: p.client || null,
        centre: p.centre,
        via: r.guess.via,
        ...nqFields(r.e),
        ref: '',
        aVerifier: false,
        note: '',
        nq: r.e.id,
      });
    }
    for (const s of plan.orphans) {
      if (unlink[s.id] === false) continue;
      const t = sById(s.id);
      if (t) delete t.nq;
    }
    // A formation created only from options or cancelled sessions gets no slide page yet.
    for (const id of created.values()) {
      const f = next.formations.find((x) => x.id === id);
      if (f) f.visible = next.sessions.some((s) => s.formation === id && shown(s));
    }
    next.nqIgnore = [...ignore].sort((a, b) => a - b);
    next.nqSyncAt = new Date().toISOString();
    // Strip undefined flags so the JSON stays tidy.
    for (const s of next.sessions) for (const k of ['option', 'annulee', 'masquee', 'nq'] as const) if (s[k] === undefined) delete s[k];
    onApply(
      next,
      `NQ App : ${nUpd} mise(s) à jour, ${nLink} association(s), ${nAdd} ajout(s), ${created.size} nouvelle(s) formation(s).`,
    );
  };

  const cell: CSSProperties = { fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const sel: CSSProperties = { fontSize: 17, padding: '6px 8px' };
  const Status = ({ st }: { st: string }) => (
    <span className="ctg-badge" style={NQ_STATUS_STYLE[st] ?? NQ_STATUS_STYLE.annule}>
      {(NQ_STATUS[st] ?? st).toUpperCase()}
    </span>
  );
  const sessionLabel = (s: Session) =>
    `${fmtDay(s.date)} · ${fName(s.formation)}${s.client ? ` · ${cat.clients.find((c) => c.id === s.client)?.nom ?? ''}` : ''}`;

  // Plain render function (not a component): rows keep their focus while editing.
  const importRow = (r: NqRow) => {
    const a = actionOf(r);
    const p = pick(r);
    return (
      <div key={r.e.id} style={{ display: 'grid', gridTemplateColumns: '200px 150px 120px 1fr', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.line}` }}>
        <select className="ctg-in" style={sel} value={a} onChange={(e) => setOv(r.e.id, { action: e.target.value as NqAction })}>
          <option value="ajouter">Ajouter</option>
          {r.candidate && <option value="associer">Associer</option>}
          <option value="ignorer">Ignorer</option>
        </select>
        <span style={cell}>{fmtDay(r.e.start_date)}</span>
        <Status st={r.e.status} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <span style={{ ...cell, fontWeight: 700 }} title={r.e.title}>
            {r.e.title}
            {r.excluded && <span style={{ fontWeight: 500, color: C.muted }}> — {r.excluded}</span>}
          </span>
          {a === 'associer' && r.candidate && (
            <span style={{ ...cell, color: C.muted }}>
              ↔ {sessionLabel(r.candidate)}
              {(() => {
                const ch = nqChanges(r.candidate, nqFields(r.e, r.candidate));
                return ch.length ? ` · ${ch.join(', ')}` : ' · identique';
              })()}
            </span>
          )}
          {a === 'ajouter' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 8 }}>
              <select className="ctg-in" style={sel} value={p.formation} onChange={(e) => setOv(r.e.id, { formation: e.target.value })}>
                <option value="">＋ Nouvelle formation : {nqCleanTitle(r.e.title)}</option>
                {cat.formations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code ? `${f.code} · ` : ''}
                    {f.titre}
                  </option>
                ))}
              </select>
              <select className="ctg-in" style={sel} value={p.client} onChange={(e) => setOv(r.e.id, { client: e.target.value })}>
                <option value="">Inter / public</option>
                {[...cat.clients].sort((x, y) => x.nom.localeCompare(y.nom, 'fr')).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
              <select className="ctg-in" style={sel} value={p.centre} onChange={(e) => setOv(r.e.id, { centre: e.target.value })}>
                <option value="">Centre ?</option>
                {cat.centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 30, fontWeight: 800 }}>Synchronisation avec NQ App</span>
        <span style={{ fontSize: 19, color: C.muted }}>
          {data!.filter((e) => e.kind === 'formation').length} formations dans NQ App · {upToDate} déjà à jour
          {cat.nqSyncAt ? ` · dernière synchro ${fmtDay(cat.nqSyncAt.slice(0, 10))}` : ''}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button type="button" className="ctg-btn" disabled={loading} onClick={() => void load()}>
            {loading ? 'Lecture…' : 'Relire NQ App'}
          </button>
          <button type="button" className="ctg-btn primary" disabled={busy || total === 0} onClick={apply}>
            Appliquer ({total})
          </button>
        </span>
      </div>
      <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.45 }}>
        NQ App fait référence : dates, jours, effectif et statut des sessions liées le suivent. Rien n’est écrit dans NQ App, et ni les
        tarifs, ni les paiements, ni les notes ne sont copiés. Les options sont importées mais jamais affichées sur les slides.
      </div>

      <Section title={`Mises à jour (${updates.length})`}>
        {updates.length === 0 && <span style={{ fontSize: 19, color: C.muted }}>Toutes les sessions liées sont à jour.</span>}
        {updates.map(({ r, changes }) => (
          <label key={r.e.id} className="ctg-check" style={{ fontSize: 18, alignItems: 'flex-start' }}>
            <input type="checkbox" checked={!over[r.e.id]?.skip} onChange={(e) => setOv(r.e.id, { skip: !e.target.checked })} />
            <span style={{ minWidth: 0 }}>
              <b>{sessionLabel(r.linked!)}</b> <Status st={r.e.status} />
              <br />
              <span style={{ color: C.muted }}>{changes.join(' · ')}</span>
            </span>
          </label>
        ))}
      </Section>

      <Section title={`Dans NQ App, pas encore liées au catalogue (${fresh.length})`}>
        <span style={{ fontSize: 18, color: C.muted }}>
          « Associer » relie la formation NQ App à la session du catalogue indiquée ; « Ajouter » crée une session (et, si besoin, une
          formation à compléter dans l’onglet Formations).
        </span>
        {fresh.map(importRow)}
      </Section>

      <Section title={`Laissées de côté (${excluded.length})`}>
        <span style={{ fontSize: 18, color: C.muted }}>Cours particuliers, événements et formations déjà ignorées : passe-les en « Ajouter » si besoin.</span>
        {excluded.map(importRow)}
      </Section>

      {plan.orphans.length > 0 && (
        <Section title={`Liées mais disparues de NQ App (${plan.orphans.length})`}>
          {plan.orphans.map((s) => (
            <label key={s.id} className="ctg-check" style={{ fontSize: 18 }}>
              <input type="checkbox" checked={unlink[s.id] !== false} onChange={(e) => setUnlink((u) => ({ ...u, [s.id]: e.target.checked }))} />
              Délier {sessionLabel(s)} (NQ #{s.nq}) — la session reste dans le catalogue
            </label>
          ))}
        </Section>
      )}

      <Section
        title={`Hors NQ App (${plan.horsNq.length})`}
        right={
          <button type="button" className="ctg-btn" onClick={() => setShowHors((v) => !v)}>
            {showHors ? 'Masquer' : 'Afficher'}
          </button>
        }
      >
        <span style={{ fontSize: 18, color: C.muted }}>
          Sessions du catalogue sans équivalent dans NQ App (venues du CV, de factures ou d’e-mails) : elles sont gardées telles quelles.
        </span>
        {showHors &&
          plan.horsNq.map((s) => (
            <span key={s.id} style={{ ...cell, color: C.muted }}>
              {sessionLabel(s)}
              {s.masquee ? ' · masquée' : ''}
            </span>
          ))}
      </Section>
    </div>
  );
};

const KNOWN_DECKS = [
  'copilot-debutant-v2',
  'copilot-avance',
  'docaposte-dev-ia',
  'vibe-coding-docaposte',
  'ia-product-owner',
  'ia-developpeurs-code-assiste',
  'ia-agentique-feuille-de-route',
  'ia-gestion-de-projet-lessard',
  'introduction-ia-ethique',
  'claude-ia-avancee-developpeurs',
  'ia-support-infrastructure',
  'ia-avancee-automatisation',
  'outils-ia-gain-de-temps',
  'ia-pour-les-rh',
  'ia-assistant-administratif',
  'ia-marketing-communication',
  'ia-relation-client',
];

const Gestion: Page = () => {
  // Thumbnails and the overview grid render pages outside the player: show a static card there.
  const active = useIsActivePage();
  const [restore] = useState(readReturn);
  const [cat, setCat] = useState<Catalogue>(() => structuredClone(DATA));
  const [prive, setPrive] = useState<Prive>({ clients: {}, sessions: {} });
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>(restore?.tab ?? 'sessions');
  const [sel, setSel] = useState<string | null>(restore?.sel ?? null);
  const [q, setQ] = useState('');
  const [fFilter, setFFilter] = useState('');
  const [msg, setMsg] = useState<{ text: string; kind: 'ok' | 'err' | 'info' } | null>(null);
  const [bust, setBust] = useState<Record<string, number>>({});
  const [newClient, setNewClient] = useState<{ nom: string; email: string } | null>(null);
  const [bulk, setBulk] = useState('');
  const catRef = useRef(cat);
  const priveRef = useRef(prive);
  catRef.current = cat;
  priveRef.current = prive;

  useEffect(() => {
    if (!active) return;
    try {
      sessionStorage.removeItem(RETURN_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [active]);

  // Fresh copy from disk (the bundled import can lag behind after an edit).
  useEffect(() => {
    if (!ADMIN) return;
    let alive = true;
    (async () => {
      const [c, p] = await Promise.all([readAsset<Catalogue>('catalogue.json'), readAsset<Prive>('catalogue-prive.json')]);
      if (!alive) return;
      if (c) setCat(c);
      if (p) setPrive({ clients: p.clients ?? {}, sessions: p.sessions ?? {} });
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!msg || msg.kind === 'err') return;
    const t = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(t);
  }, [msg]);

  const upd = (fn: (c: Catalogue) => void) => {
    setCat((c) => {
      const n = structuredClone(c);
      fn(n);
      return n;
    });
    setDirty(true);
  };
  const updPrive = (fn: (p: Prive) => void) => {
    setPrive((p) => {
      const n = structuredClone(p);
      fn(n);
      return n;
    });
    setDirty(true);
  };

  const save = async (nextCat = catRef.current, nextPrive = priveRef.current) => {
    setBusy(true);
    try {
      await writeAsset('catalogue-prive.json', JSON.stringify(nextPrive, null, 2) + '\n', 'application/json');
      sessionStorage.setItem(RETURN_KEY, JSON.stringify({ tab, sel, t: Date.now() } satisfies ReturnState));
      await writeAsset('catalogue.json', JSON.stringify(nextCat, null, 2) + '\n', 'application/json');
      setDirty(false);
      setMsg({ text: 'Enregistré — les slides se mettent à jour.', kind: 'ok' });
    } catch (e) {
      setMsg({ text: `Échec de l’enregistrement : ${(e as Error).message}`, kind: 'err' });
    } finally {
      setBusy(false);
    }
  };

  // A logo file can be shared (e.g. two Docaposte entities): never delete one still in use.
  const logoShared = (c: Catalogue, file: string, exceptId: string) =>
    [...c.clients, ...c.centres].some((x) => x.id !== exceptId && x.logo === file);
  const uploadLogo = async (kind: 'client' | 'centre', id: string, file: File) => {
    const ext = EXT_BY_MIME[file.type];
    if (!ext) return setMsg({ text: 'Format non pris en charge : PNG, SVG, JPG ou WebP.', kind: 'err' });
    if (file.size > 3_000_000) return setMsg({ text: 'Logo trop lourd (3 Mo maximum).', kind: 'err' });
    const list = kind === 'client' ? catRef.current.clients : catRef.current.centres;
    const entity = list.find((x) => x.id === id);
    if (!entity) return;
    const name = `logo-${kind === 'centre' ? 'centre-' : ''}${id}.${ext}`;
    setBusy(true);
    try {
      await writeAsset(name, file, file.type);
      if (entity.logo && entity.logo !== name && !logoShared(catRef.current, entity.logo, id))
        await fetch(ASSET_URL(entity.logo), { method: 'DELETE' }).catch(() => {});
      const next = structuredClone(catRef.current);
      const target = (kind === 'client' ? next.clients : next.centres).find((x) => x.id === id);
      if (target) target.logo = name;
      setCat(next);
      setBust((b) => ({ ...b, [name]: Date.now() }));
      // A new logo file hot-reloads the deck: save now so nothing typed is lost.
      await save(next);
    } catch (e) {
      setMsg({ text: `Échec du téléversement : ${(e as Error).message}`, kind: 'err' });
      setBusy(false);
    }
  };
  const removeLogo = async (kind: 'client' | 'centre', id: string) => {
    const list = kind === 'client' ? catRef.current.clients : catRef.current.centres;
    const entity = list.find((x) => x.id === id);
    if (!entity?.logo) return;
    const file = entity.logo;
    const next = structuredClone(catRef.current);
    const target = (kind === 'client' ? next.clients : next.centres).find((x) => x.id === id);
    if (target) target.logo = null;
    setCat(next);
    await save(next);
    if (!logoShared(next, file, id)) await fetch(ASSET_URL(file), { method: 'DELETE' }).catch(() => {});
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify({ catalogue: cat, prive }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `catalogue-formations-${todayIso()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  // ── lookups
  const fById = (id?: string) => cat.formations.find((f) => f.id === id);
  const cById = (id?: string | null) => (id ? cat.clients.find((c) => c.id === id) : undefined);
  const ceById = (id?: string) => cat.centres.find((c) => c.id === id);
  const sessionsOf = (pred: (s: Session) => boolean) =>
    cat.sessions.filter(pred).sort((a, b) => (b.date ?? '9999').localeCompare(a.date ?? '9999'));

  const open = (t: Tab, id: string | null) => {
    setTab(t);
    setSel(id);
    setNewClient(null);
    setBulk('');
  };

  // ── list (left column)
  const needle = q.trim().toLowerCase();
  const match = (...parts: (string | undefined | null)[]) =>
    !needle || parts.some((p) => (p ?? '').toLowerCase().includes(needle));

  let list: ReactNode = null;
  let addLabel = '';
  let onAdd: (() => void) | null = null;
  if (tab === 'sessions') {
    const items = sessionsOf(
      (s) =>
        (!fFilter || s.formation === fFilter) &&
        match(fById(s.formation)?.titre, fById(s.formation)?.code, cById(s.client)?.nom, ceById(s.centre)?.nom, s.ref, s.note, s.date),
    ).sort((a, b) => (b.date || '9999').localeCompare(a.date || '9999'));
    addLabel = '+ Nouvelle session';
    onAdd = () => {
      const id = `s-${Date.now().toString(36)}`;
      const f = fById(fFilter) ?? cat.formations[0];
      upd((c) =>
        c.sessions.push({
          id,
          formation: f?.id ?? '',
          client: null,
          centre: f?.centre ?? '',
          via: '',
          date: todayIso(),
          jours: f?.jours ?? 1,
          participants: null,
          mode: 'distanciel',
          ref: '',
          aVerifier: false,
          note: '',
        }),
      );
      open('sessions', id);
    };
    list = items.map((s) => {
      const st = statutOf(s);
      const f = fById(s.formation);
      return (
        <button key={s.id} type="button" className={`ctg-item${sel === s.id ? ' on' : ''}`} onClick={() => open('sessions', s.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: C.muted }}>
            <span style={{ fontWeight: 700, color: C.text }}>{fmtDay(s.date)}</span>
            <span className="ctg-badge" style={BADGE[st]}>{STATUT_LABEL[st].toUpperCase()}</span>
            {s.aVerifier && <span title="À vérifier">⚠</span>}
            {s.nq != null && <span title={`NQ App #${s.nq}`} style={{ fontSize: 14, fontWeight: 800, color: '#075985' }}>NQ</span>}
            {s.masquee && <span title="Pas affichée sur les slides">🚫</span>}
            <span style={{ marginLeft: 'auto' }}>{s.participants != null ? `${s.participants} pers.` : ''}</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {f?.code ? `${f.code} · ` : ''}
            {f?.titre ?? '(formation supprimée)'}
          </div>
          <div style={{ fontSize: 18, color: C.muted, marginTop: 2 }}>
            {cById(s.client)?.nom ?? 'Inter / public'} · {ceById(s.centre)?.nom ?? 'centre ?'}
          </div>
        </button>
      );
    });
  } else if (tab === 'clients') {
    const items = [...cat.clients].filter((c) => match(c.nom, c.secteur)).sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    addLabel = '+ Nouveau client';
    onAdd = () => {
      const id = uniqueId('nouveau-client', cat.clients.map((c) => c.id));
      upd((c) => c.clients.push({ id, nom: 'Nouveau client', logo: null, site: '', secteur: '', visible: true }));
      open('clients', id);
    };
    list = items.map((c) => {
      const n = cat.sessions.filter((s) => s.client === c.id).length;
      return (
        <button key={c.id} type="button" className={`ctg-item${sel === c.id ? ' on' : ''}`} onClick={() => open('clients', c.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <LogoTile tile={{ key: c.id, nom: c.nom, logo: c.logo, icone: c.icone, kind: 'client' }} w={110} h={46} bust={c.logo ? bust[c.logo] : undefined} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{c.nom}</div>
              <div style={{ fontSize: 17, color: C.muted }}>
                {plural(n, 'session', 'sessions')}
                {c.visible === false ? ' · masqué' : ''}
                {!c.logo ? ' · sans logo' : ''}
              </div>
            </div>
          </div>
        </button>
      );
    });
  } else if (tab === 'formations') {
    const items = cat.formations.filter((f) => match(f.titre, f.code, f.deck));
    addLabel = '+ Nouvelle formation';
    onAdd = () => {
      const id = uniqueId('nouvelle-formation', cat.formations.map((f) => f.id));
      upd((c) =>
        c.formations.push({ id, titre: 'Nouvelle formation', code: '', jours: 1, niveau: 'Débutant', centre: '', deck: '', visible: true, accroche: '', points: [] }),
      );
      open('formations', id);
    };
    list = items.map((f) => {
      const n = cat.sessions.filter((s) => s.formation === f.id).length;
      return (
        <button key={f.id} type="button" className={`ctg-item${sel === f.id ? ' on' : ''}`} onClick={() => open('formations', f.id)}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {f.code ? `${f.code} · ` : ''}
            {f.titre}
          </div>
          <div style={{ fontSize: 17, color: C.muted }}>
            {fmtJours(f.jours)} · {plural(n, 'session', 'sessions')}
            {f.visible ? '' : ' · masquée'}
          </div>
        </button>
      );
    });
  } else if (tab === 'centres') {
    addLabel = '+ Nouveau centre';
    onAdd = () => {
      const id = uniqueId('nouveau-centre', cat.centres.map((c) => c.id));
      upd((c) => c.centres.push({ id, nom: 'Nouveau centre', logo: null, site: '' }));
      open('centres', id);
    };
    list = cat.centres
      .filter((c) => match(c.nom))
      .map((c) => (
        <button key={c.id} type="button" className={`ctg-item${sel === c.id ? ' on' : ''}`} onClick={() => open('centres', c.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <LogoTile tile={{ key: c.id, nom: c.nom, logo: c.logo, icone: c.icone, kind: 'client' }} w={110} h={46} bust={c.logo ? bust[c.logo] : undefined} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{c.nom}</div>
              <div style={{ fontSize: 17, color: C.muted }}>
                {plural(cat.sessions.filter((s) => s.centre === c.id || s.via === c.id).length, 'session', 'sessions')}
                {c.masque ? ' · jamais affiché' : ''}
              </div>
            </div>
          </div>
        </button>
      ));
  }

  // ── editor (right column)
  let editor: ReactNode = (
    <div style={{ fontSize: 24, color: C.muted, padding: 40 }}>Sélectionne un élément dans la liste, ou crée-en un nouveau.</div>
  );

  const SessionLinks = ({ items }: { items: Session[] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.length === 0 && <span style={{ fontSize: 19, color: C.muted }}>Aucune session.</span>}
      {items.map((s) => (
        <button key={s.id} type="button" className="ctg-item" style={{ padding: '8px 12px' }} onClick={() => open('sessions', s.id)}>
          <span style={{ fontSize: 19 }}>
            <b>{fmtDay(s.date)}</b> · {fById(s.formation)?.titre ?? '?'} · {cById(s.client)?.nom ?? 'Inter / public'}
            {s.participants != null ? ` · ${s.participants} pers.` : ''}
          </span>
        </button>
      ))}
    </div>
  );

  if (tab === 'sessions' && sel) {
    const s = cat.sessions.find((x) => x.id === sel);
    if (s) {
      const setS = (fn: (x: Session) => void) =>
        upd((c) => {
          const t = c.sessions.find((x) => x.id === s.id);
          if (t) fn(t);
        });
      const p = prive.sessions[s.id] ?? {};
      const stagiaires = p.stagiaires ?? [];
      const setP = (fn: (x: { stagiaires?: Stagiaire[]; notes?: string }) => void) =>
        updPrive((pv) => {
          const t = (pv.sessions[s.id] ??= {});
          fn(t);
        });
      const partial = /^\d{4}-\d{2}$/.test(s.date ?? '');
      const st = statutOf(s);
      editor = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Session · {fmtDay(s.date)}</span>
            <span className="ctg-badge" style={BADGE[st]}>{STATUT_LABEL[st].toUpperCase()}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="ctg-btn"
                onClick={() => {
                  const id = `s-${Date.now().toString(36)}`;
                  upd((c) => c.sessions.push({ ...structuredClone(s), id, nq: undefined, date: todayIso() }));
                  open('sessions', id);
                }}
              >
                Dupliquer
              </button>
              <DangerButton
                label="Supprimer"
                onConfirm={() => {
                  upd((c) => (c.sessions = c.sessions.filter((x) => x.id !== s.id)));
                  updPrive((pv) => delete pv.sessions[s.id]);
                  setSel(null);
                }}
              />
            </span>
          </div>
          <Field label="Formation">
            <select className="ctg-in" value={s.formation} onChange={(e) => setS((x) => (x.formation = e.target.value))}>
              {cat.formations.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code ? `${f.code} · ` : ''}
                  {f.titre}
                </option>
              ))}
            </select>
          </Field>
          <Row>
            <Field label="Client" w="60%">
              <select
                className="ctg-in"
                value={newClient ? '__new' : (s.client ?? '')}
                onChange={(e) => {
                  if (e.target.value === '__new') return setNewClient({ nom: '', email: '' });
                  setNewClient(null);
                  setS((x) => (x.client = e.target.value || null));
                }}
              >
                <option value="">— Inter-entreprises / public (logo du centre) —</option>
                {[...cat.clients]
                  .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                <option value="__new">＋ Nouveau client…</option>
              </select>
            </Field>
            {s.client && !newClient && (
              <button type="button" className="ctg-btn" onClick={() => open('clients', s.client ?? null)}>
                Fiche client (logo, e-mail) →
              </button>
            )}
          </Row>
          {newClient && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', padding: 16, borderRadius: 12, background: 'rgba(47,91,255,0.06)' }}>
              <Field label="Nom du nouveau client" w="40%">
                <input className="ctg-in" autoFocus value={newClient.nom} onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })} />
              </Field>
              <Field label="E-mail du contact" w="36%">
                <input className="ctg-in" type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
              </Field>
              <button
                type="button"
                className="ctg-btn primary"
                disabled={!newClient.nom.trim()}
                onClick={() => {
                  const id = uniqueId(newClient.nom, cat.clients.map((c) => c.id));
                  upd((c) => {
                    c.clients.push({ id, nom: newClient.nom.trim(), logo: null, site: '', secteur: '', visible: true });
                    const t = c.sessions.find((x) => x.id === s.id);
                    if (t) t.client = id;
                  });
                  if (newClient.email.trim()) updPrive((pv) => (pv.clients[id] = { ...(pv.clients[id] ?? {}), email: newClient.email.trim() }));
                  setNewClient(null);
                  setMsg({ text: 'Client créé — ajoute son logo depuis sa fiche.', kind: 'info' });
                }}
              >
                Créer
              </button>
              <button type="button" className="ctg-btn" onClick={() => setNewClient(null)}>
                Annuler
              </button>
            </div>
          )}
          <Row>
            <Field label="Centre de formation" w="50%">
              <select className="ctg-in" value={s.centre ?? ''} onChange={(e) => setS((x) => (x.centre = e.target.value))}>
                <option value="">— à préciser —</option>
                {cat.centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Via (intermédiaire)" w="50%">
              <select className="ctg-in" value={s.via ?? ''} onChange={(e) => setS((x) => (x.via = e.target.value))}>
                <option value="">— direct —</option>
                {cat.centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </Field>
          </Row>
          <Row>
            <Field label={partial ? `Date de début (approx. ${fmtDay(s.date)})` : 'Date de début'} w="34%">
              <input
                className="ctg-in"
                type="date"
                value={partial ? '' : (s.date ?? '')}
                onChange={(e) => setS((x) => (x.date = e.target.value))}
              />
            </Field>
            <Field label="Nombre de jours" w="18%">
              <input
                className="ctg-in"
                type="number"
                min={0.5}
                step={0.5}
                value={s.jours ?? ''}
                onChange={(e) => setS((x) => (x.jours = e.target.value === '' ? undefined : Number(e.target.value)))}
              />
            </Field>
            <Field label="Participants" w="18%">
              <input
                className="ctg-in"
                type="number"
                min={0}
                value={s.participants ?? ''}
                onChange={(e) => setS((x) => (x.participants = e.target.value === '' ? null : Number(e.target.value)))}
              />
            </Field>
            <Field label="Modalité" w="30%">
              <select className="ctg-in" value={s.mode ?? 'distanciel'} onChange={(e) => setS((x) => (x.mode = e.target.value))}>
                <option value="distanciel">Distanciel</option>
                <option value="presentiel">Présentiel</option>
                <option value="hybride">Hybride</option>
              </select>
            </Field>
          </Row>
          <Row>
            <Field label="Référence (n° d’action, bon de commande…)" w="50%">
              <input className="ctg-in" value={s.ref ?? ''} onChange={(e) => setS((x) => (x.ref = e.target.value))} />
            </Field>
            <label className="ctg-check" style={{ paddingBottom: 12 }}>
              <input type="checkbox" checked={!!s.aVerifier} onChange={(e) => setS((x) => (x.aVerifier = e.target.checked))} />À vérifier
            </label>
            <label className="ctg-check" style={{ paddingBottom: 12 }}>
              <input type="checkbox" checked={!!s.annulee} onChange={(e) => setS((x) => (x.annulee = e.target.checked))} />
              Annulée
            </label>
            <label className="ctg-check" style={{ paddingBottom: 12 }}>
              <input type="checkbox" checked={!!s.masquee} onChange={(e) => setS((x) => (x.masquee = e.target.checked))} />
              Ne pas afficher sur les slides
            </label>
          </Row>
          {s.nq != null && (
            <div style={{ fontSize: 19, color: C.muted, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="ctg-badge" style={{ background: '#E0F2FE', color: '#075985' }}>NQ APP #{s.nq}</span>
              Dates, jours, effectif et statut suivent NQ App à chaque synchronisation (onglet NQ App).
              {s.option && <b style={{ color: '#5B21B6' }}>Encore en option dans NQ App : pas affichée.</b>}
            </div>
          )}
          <Field label="Remarque">
            <input className="ctg-in" value={s.note ?? ''} onChange={(e) => setS((x) => (x.note = e.target.value))} />
          </Field>
          <Section
            title={`Stagiaires (${stagiaires.length}) — privé, jamais affiché`}
            right={
              stagiaires.length > 0 && stagiaires.length !== s.participants ? (
                <button type="button" className="ctg-btn" onClick={() => setS((x) => (x.participants = stagiaires.length))}>
                  Participants = {stagiaires.length}
                </button>
              ) : undefined
            }
          >
            {stagiaires.map((st2, i) => (
              <Row key={i} gap={12}>
                <input
                  className="ctg-in"
                  placeholder="Nom"
                  value={st2.nom}
                  onChange={(e) => setP((x) => ((x.stagiaires ??= [])[i] = { ...x.stagiaires![i], nom: e.target.value }))}
                />
                <input
                  className="ctg-in"
                  placeholder="E-mail"
                  value={st2.email ?? ''}
                  onChange={(e) => setP((x) => ((x.stagiaires ??= [])[i] = { ...x.stagiaires![i], email: e.target.value }))}
                />
                <button type="button" className="ctg-btn" onClick={() => setP((x) => x.stagiaires?.splice(i, 1))}>
                  ✕
                </button>
              </Row>
            ))}
            <Row gap={12}>
              <textarea
                className="ctg-in"
                rows={2}
                placeholder={'Coller une liste, une personne par ligne : « Nom <email> », « Nom ; email »…'}
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
              />
              <button
                type="button"
                className="ctg-btn"
                onClick={() => {
                  const add = bulk.trim() ? parseStagiaires(bulk) : [{ nom: '', email: '' }];
                  setP((x) => (x.stagiaires = [...(x.stagiaires ?? []), ...add]));
                  setBulk('');
                }}
              >
                {bulk.trim() ? 'Importer' : '+ Ajouter'}
              </button>
            </Row>
          </Section>
          <Field label="Notes privées">
            <textarea className="ctg-in" rows={2} value={p.notes ?? ''} onChange={(e) => setP((x) => (x.notes = e.target.value))} />
          </Field>
        </div>
      );
    }
  } else if (tab === 'clients' && sel) {
    const c = cat.clients.find((x) => x.id === sel);
    if (c) {
      const setC = (fn: (x: Client) => void) =>
        upd((cc) => {
          const t = cc.clients.find((x) => x.id === c.id);
          if (t) fn(t);
        });
      const p = prive.clients[c.id] ?? {};
      const setP = (fn: (x: { email?: string; contact?: string; notes?: string }) => void) =>
        updPrive((pv) => fn((pv.clients[c.id] ??= {})));
      const items = sessionsOf((s) => s.client === c.id);
      editor = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Client · {c.nom}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="ctg-btn primary"
                onClick={() => {
                  const id = `s-${Date.now().toString(36)}`;
                  const last = items[0];
                  upd((cc) =>
                    cc.sessions.push({
                      id,
                      formation: last?.formation ?? cc.formations[0]?.id ?? '',
                      client: c.id,
                      centre: last?.centre ?? '',
                      via: last?.via ?? '',
                      date: todayIso(),
                      jours: last?.jours ?? 1,
                      participants: null,
                      mode: last?.mode ?? 'distanciel',
                      ref: '',
                      aVerifier: false,
                      note: '',
                    }),
                  );
                  open('sessions', id);
                }}
              >
                + Session pour ce client
              </button>
              <DangerButton
                label="Supprimer"
                onConfirm={() => {
                  upd((cc) => {
                    cc.clients = cc.clients.filter((x) => x.id !== c.id);
                    for (const s of cc.sessions) if (s.client === c.id) s.client = null;
                  });
                  updPrive((pv) => delete pv.clients[c.id]);
                  if (c.logo) void fetch(ASSET_URL(c.logo), { method: 'DELETE' }).catch(() => {});
                  setSel(null);
                }}
              />
            </span>
          </div>
          {items.length > 0 && (
            <span style={{ fontSize: 18, color: C.muted, marginTop: -8 }}>
              Supprimer ce client transforme ses {items.length} session(s) en sessions inter / public.
            </span>
          )}
          <Row>
            <Field label="Nom" w="50%">
              <input className="ctg-in" value={c.nom} onChange={(e) => setC((x) => (x.nom = e.target.value))} />
            </Field>
            <Field label="Secteur" w="50%">
              <input className="ctg-in" value={c.secteur ?? ''} onChange={(e) => setC((x) => (x.secteur = e.target.value))} />
            </Field>
          </Row>
          <Field label="Logo">
            <LogoDrop
              nom={c.nom}
              logo={c.logo}
              bust={c.logo ? bust[c.logo] : undefined}
              onFile={(f) => void uploadLogo('client', c.id, f)}
              onRemove={() => void removeLogo('client', c.id)}
            />
          </Field>
          <Row>
            <Field label="Site web" w="60%">
              <input className="ctg-in" value={c.site ?? ''} onChange={(e) => setC((x) => (x.site = e.target.value))} />
            </Field>
            <label className="ctg-check" style={{ paddingBottom: 12 }}>
              <input type="checkbox" checked={c.visible !== false} onChange={(e) => setC((x) => (x.visible = e.target.checked))} />
              Afficher sur les slides
            </label>
          </Row>
          <label className="ctg-check">
            <input type="checkbox" checked={!!c.icone} onChange={(e) => setC((x) => (x.icone = e.target.checked))} />
            Le logo est une icône seule : afficher le nom à côté
          </label>
          <Section title="Contact — privé, jamais affiché">
            <Row>
              <Field label="Nom du contact" w="45%">
                <input className="ctg-in" value={p.contact ?? ''} onChange={(e) => setP((x) => (x.contact = e.target.value))} />
              </Field>
              <Field label="E-mail" w="55%">
                <input className="ctg-in" type="email" value={p.email ?? ''} onChange={(e) => setP((x) => (x.email = e.target.value))} />
              </Field>
            </Row>
            <Field label="Notes">
              <textarea className="ctg-in" rows={2} value={p.notes ?? ''} onChange={(e) => setP((x) => (x.notes = e.target.value))} />
            </Field>
          </Section>
          <Section title={`Sessions (${items.length})`}>
            <SessionLinks items={items} />
          </Section>
        </div>
      );
    }
  } else if (tab === 'formations' && sel) {
    const f = cat.formations.find((x) => x.id === sel);
    if (f) {
      const setF = (fn: (x: Formation) => void) =>
        upd((cc) => {
          const t = cc.formations.find((x) => x.id === f.id);
          if (t) fn(t);
        });
      const idx = cat.formations.findIndex((x) => x.id === f.id);
      const move = (d: number) =>
        upd((cc) => {
          const [it] = cc.formations.splice(idx, 1);
          cc.formations.splice(Math.max(0, Math.min(cc.formations.length, idx + d)), 0, it);
        });
      const items = sessionsOf((s) => s.formation === f.id);
      editor = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Formation</span>
            <span style={{ fontSize: 19, color: C.muted }}>
              position {idx + 1} / {cat.formations.length}
            </span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button type="button" className="ctg-btn" disabled={idx === 0} onClick={() => move(-1)}>
                ↑ Monter
              </button>
              <button type="button" className="ctg-btn" disabled={idx === cat.formations.length - 1} onClick={() => move(1)}>
                ↓ Descendre
              </button>
              <DangerButton
                label="Supprimer"
                disabled={items.length > 0}
                onConfirm={() => {
                  upd((cc) => (cc.formations = cc.formations.filter((x) => x.id !== f.id)));
                  setSel(null);
                }}
              />
            </span>
          </div>
          {items.length > 0 && (
            <span style={{ fontSize: 18, color: C.muted, marginTop: -8 }}>
              Pour supprimer cette formation, supprime ou réaffecte d’abord ses sessions — ou décoche « Visible ».
            </span>
          )}
          <Field label="Titre">
            <input className="ctg-in" value={f.titre} onChange={(e) => setF((x) => (x.titre = e.target.value))} />
          </Field>
          <Row>
            <Field label="Code" w="18%">
              <input className="ctg-in" value={f.code ?? ''} onChange={(e) => setF((x) => (x.code = e.target.value))} />
            </Field>
            <Field label="Durée (jours)" w="16%">
              <input
                className="ctg-in"
                type="number"
                min={0.5}
                step={0.5}
                value={f.jours}
                onChange={(e) => setF((x) => (x.jours = Number(e.target.value) || 1))}
              />
            </Field>
            <Field label="Niveau" w="22%">
              <select className="ctg-in" value={f.niveau ?? ''} onChange={(e) => setF((x) => (x.niveau = e.target.value))}>
                <option value="">—</option>
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
                <option>Tous niveaux</option>
              </select>
            </Field>
            <Field label="Centre principal" w="30%">
              <select className="ctg-in" value={f.centre ?? ''} onChange={(e) => setF((x) => (x.centre = e.target.value))}>
                <option value="">—</option>
                {cat.centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </Field>
            <label className="ctg-check" style={{ paddingBottom: 12 }}>
              <input type="checkbox" checked={f.visible} onChange={(e) => setF((x) => (x.visible = e.target.checked))} />
              Visible
            </label>
          </Row>
          <Field label="Accroche (2 lignes max sur la slide)">
            <textarea className="ctg-in" rows={2} value={f.accroche ?? ''} onChange={(e) => setF((x) => (x.accroche = e.target.value))} />
          </Field>
          <Field label="Points clés (un par ligne, 4 affichés)">
            <textarea
              className="ctg-in"
              rows={4}
              value={(f.points ?? []).join('\n')}
              onChange={(e) => setF((x) => (x.points = e.target.value.split('\n')))}
              onBlur={() => setF((x) => (x.points = (x.points ?? []).map((p) => p.trim()).filter(Boolean)))}
            />
          </Field>
          <Field label="Deck du support (id du dossier slides/)" w="60%">
            <input className="ctg-in" list="ctg-decks" value={f.deck ?? ''} onChange={(e) => setF((x) => (x.deck = e.target.value))} />
            <datalist id="ctg-decks">
              {KNOWN_DECKS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </Field>
          <Section title={`Sessions (${items.length})`}>
            <SessionLinks items={items} />
          </Section>
        </div>
      );
    }
  } else if (tab === 'centres' && sel) {
    const ce = cat.centres.find((x) => x.id === sel);
    if (ce) {
      const setCe = (fn: (x: Centre) => void) =>
        upd((cc) => {
          const t = cc.centres.find((x) => x.id === ce.id);
          if (t) fn(t);
        });
      const used = cat.sessions.filter((s) => s.centre === ce.id || s.via === ce.id).length + cat.formations.filter((f) => f.centre === ce.id).length;
      editor = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>Centre · {ce.nom}</span>
            <span style={{ marginLeft: 'auto' }}>
              <DangerButton
                label="Supprimer"
                disabled={used > 0}
                onConfirm={() => {
                  upd((cc) => (cc.centres = cc.centres.filter((x) => x.id !== ce.id)));
                  setSel(null);
                }}
              />
            </span>
          </div>
          <Row>
            <Field label="Nom" w="50%">
              <input className="ctg-in" value={ce.nom} onChange={(e) => setCe((x) => (x.nom = e.target.value))} />
            </Field>
            <Field label="Site web" w="50%">
              <input className="ctg-in" value={ce.site ?? ''} onChange={(e) => setCe((x) => (x.site = e.target.value))} />
            </Field>
          </Row>
          <Field label="Logo (affiché pour les sessions inter / public)">
            <LogoDrop
              nom={ce.nom}
              logo={ce.logo}
              bust={ce.logo ? bust[ce.logo] : undefined}
              onFile={(f) => void uploadLogo('centre', ce.id, f)}
              onRemove={() => void removeLogo('centre', ce.id)}
            />
          </Field>
          <label className="ctg-check">
            <input type="checkbox" checked={!!ce.masque} onChange={(e) => setCe((x) => (x.masque = e.target.checked))} />
            Ne jamais afficher sur les slides (intermédiaire)
          </label>
          <label className="ctg-check">
            <input type="checkbox" checked={!!ce.icone} onChange={(e) => setCe((x) => (x.icone = e.target.checked))} />
            Le logo est une icône seule : afficher le nom à côté
          </label>
        </div>
      );
    }
  }
  if (tab === 'nq') {
    editor = (
      <NqSync
        cat={cat}
        busy={busy}
        onApply={(next, summary) => {
          setCat(next);
          setDirty(true);
          setMsg({ text: summary, kind: 'info' });
          void save(next);
        }}
      />
    );
  }
  if (tab === 'formateur') {
    const fo = cat.formateur;
    const setFo = (k: keyof Formateur, v: string) => upd((cc) => (cc.formateur[k] = v));
    editor = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <span style={{ fontSize: 30, fontWeight: 800 }}>Formateur · couverture et contact</span>
        <Row>
          <Field label="Nom" w="50%">
            <input className="ctg-in" value={fo.nom} onChange={(e) => setFo('nom', e.target.value)} />
          </Field>
          <Field label="Titre" w="50%">
            <input className="ctg-in" value={fo.titre} onChange={(e) => setFo('titre', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="E-mail (affiché)" w="50%">
            <input className="ctg-in" value={fo.email ?? ''} onChange={(e) => setFo('email', e.target.value)} />
          </Field>
          <Field label="Site / LinkedIn (affiché)" w="50%">
            <input className="ctg-in" value={fo.site ?? ''} onChange={(e) => setFo('site', e.target.value)} />
          </Field>
        </Row>
        <Field label="Titre de la couverture">
          <input className="ctg-in" value={fo.accroche ?? ''} onChange={(e) => setFo('accroche', e.target.value)} />
        </Field>
        <Field label="Sous-titre de la couverture">
          <textarea className="ctg-in" rows={2} value={fo.sousTitre ?? ''} onChange={(e) => setFo('sousTitre', e.target.value)} />
        </Field>
      </div>
    );
  }

  const counts: Record<Tab, number | null> = {
    sessions: cat.sessions.length,
    clients: cat.clients.length,
    formations: cat.formations.length,
    centres: cat.centres.length,
    formateur: null,
    nq: null,
  };
  const TABS: [Tab, string][] = [
    ['sessions', 'Sessions'],
    ['clients', 'Clients'],
    ['formations', 'Formations'],
    ['centres', 'Centres'],
    ['formateur', 'Formateur'],
    ['nq', 'NQ App'],
  ];
  const aVerifier = cat.sessions.filter((s) => s.aVerifier).length;

  if (!ADMIN) {
    return (
      <div style={{ ...fill, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: C.muted }}>
        La gestion du catalogue n’est disponible que sur le serveur local.
      </div>
    );
  }
  if (!active) {
    return (
      <div style={{ ...fill, padding: '100px 110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
        <Eyebrow>Configuration</Eyebrow>
        <div style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 800 }}>Gestion du catalogue</div>
        <div style={{ fontSize: 34, color: C.muted }}>
          {plural(cat.sessions.length, 'session', 'sessions')} · {plural(cat.clients.length, 'client', 'clients')} ·{' '}
          {plural(cat.formations.length, 'formation', 'formations')}
        </div>
      </div>
    );
  }

  return (
    <div
      className="ctg-root"
      // data-inspector-ui: the inspector leaves this page alone; role="dialog": the
      // editor's own Ctrl+S / Ctrl+Z shortcuts skip it, so Ctrl+S saves the catalogue.
      // data-wheel-nav-ignore: the mouse wheel scrolls the lists instead of changing page.
      data-inspector-ui
      data-wheel-nav-ignore
      role="dialog"
      aria-label="Gestion du catalogue"
      style={{ ...fill, padding: '34px 44px', display: 'flex', flexDirection: 'column', gap: 22 }}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          e.stopPropagation();
          if (!busy) void save();
          return;
        }
        const t = e.target as HTMLElement;
        if (t.closest('input, textarea, select, button, [data-ctg-key]')) e.stopPropagation();
      }}
    >
      <style>{ADMIN_CSS}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 800, marginRight: 14, whiteSpace: 'nowrap', flex: 'none' }}>
          Gestion du catalogue
        </span>
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={`ctg-tab${tab === id ? ' on' : ''}`} onClick={() => open(id, null)}>
            {label}
            {counts[id] != null ? ` (${counts[id]})` : ''}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {msg && (
            <span style={{ fontSize: 19, fontWeight: 700, color: msg.kind === 'err' ? '#B42318' : msg.kind === 'ok' ? '#15803D' : C.accent, maxWidth: 520 }}>
              {msg.text}
            </span>
          )}
          {!msg && dirty && <span style={{ fontSize: 19, fontWeight: 700, color: C.warm }}>Modifications non enregistrées</span>}
          <button type="button" className="ctg-btn" onClick={exportAll}>
            Exporter
          </button>
          <button type="button" className="ctg-btn primary" disabled={busy || !dirty} onClick={() => void save()}>
            {busy ? 'Enregistrement…' : 'Enregistrer (Ctrl+S)'}
          </button>
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 28 }}>
        {tab !== 'formateur' && tab !== 'nq' && (
          <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input className="ctg-in" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
              {onAdd && (
                <button type="button" className="ctg-btn primary" onClick={onAdd}>
                  {addLabel}
                </button>
              )}
            </div>
            {tab === 'sessions' && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select className="ctg-in" value={fFilter} onChange={(e) => setFFilter(e.target.value)}>
                  <option value="">Toutes les formations</option>
                  {cat.formations.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code ? `${f.code} · ` : ''}
                      {f.titre}
                    </option>
                  ))}
                </select>
                {aVerifier > 0 && (
                  <span style={{ fontSize: 18, color: C.muted, whiteSpace: 'nowrap' }}>⚠ {aVerifier} à vérifier</span>
                )}
              </div>
            )}
            <div className="ctg-scroll" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 6 }}>
              {list}
            </div>
          </div>
        )}
        <div
          className="ctg-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            background: C.card,
            border: `2px solid ${C.line}`,
            borderRadius: 16,
            padding: '26px 30px',
          }}
        >
          {editor}
        </div>
      </div>
    </div>
  );
};

// ─── Deck assembly ──────────────────────────────────────────────────────────
const OVERVIEWS = Array.from({ length: OVERVIEW_COUNT }, (_, i) => makeOverview(i));
const FORMATION_PAGES = VISIBLE.map(makeFormationPage);
const PAGES: Page[] = [Cover, References, ...OVERVIEWS, ...FORMATION_PAGES, Contact, ...(ADMIN ? [Gestion] : [])];
const GESTION_INDEX = PAGES.length - 1;

if (ADMIN && readReturn() && typeof window !== 'undefined') {
  setTimeout(() => goto(GESTION_INDEX), 350);
}

export const notes: (string | undefined)[] = [
  `Se présenter en une phrase : formateur IA et développement, ${G.done.length} sessions animées, ${G.clients.length} entreprises clientes.
Les chiffres de la couverture sont calculés automatiquement depuis la page Gestion.`,
  `Ne pas lire les logos : citer deux ou trois références proches du secteur de l’interlocuteur.
Préciser que les formations sont animées pour des centres reconnus (${G.centres.map((c) => c.nom).join(', ')}).`,
  ...OVERVIEWS.map(() => `Laisser l’interlocuteur choisir : chaque carte est cliquable et ouvre la page de la formation.`),
  ...VISIBLE.map((f) => {
    const v = formationView(DATA, f);
    const refs = v.doneTiles.filter((t) => t.kind === 'client').map((t) => t.nom);
    return `${f.code ? `${f.code} — ` : ''}${f.titre} (${fmtJours(f.jours)}).
${v.done.length > 0 ? `${plural(v.done.length, 'session animée', 'sessions animées')}, dernière : ${fmtMonth(v.done.map((s) => s.date ?? '').sort().pop())}.` : 'Pas encore de session animée : la présenter comme nouveauté.'}
${refs.length > 0 ? `Références à citer : ${refs.slice(0, 4).join(', ')}.` : ''}
${v.next.length > 0 ? `Prochaine session : ${fmtDay(v.next.map((s) => s.date ?? '').sort()[0])}.` : ''}`.trim();
  }),
  `Conclure sur l’adaptation au contexte : programme ajusté aux outils et aux cas réels de l’équipe.`,
];

export const meta: SlideMeta = {
  title: 'Catalogue des formations — Houssem Eddine Lassoued',
  createdAt: '2026-11-18T19:53:34.665Z',
};
export default PAGES satisfies Page[];
