// ─── Module 4 · Images et contenus visuels ──────────────────────────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Images & contenus
        <br />
        visuels
      </>
    }
    sub="Générer des images utiles, rédiger un brief créatif, décliner un concept sur tous les supports, et produire une présentation."
    dur="13:30 – 14:20 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · un concept de campagne et ses supports
      </Tag>
    }
  >
    <SecItem n={1}>Génération d’images : l’anatomie d’un prompt visuel</SecItem>
    <SecItem n={2}>Créer des visuels marketing : formats, pièges, droits</SecItem>
    <SecItem n={3}>Le brief créatif</SecItem>
    <SecItem n={4}>Décliner un concept</SecItem>
    <SecItem n={5}>Créer une présentation</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Constructeur de prompt image ───────────────────────────────────────────
const M4_ImgPrompt: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const set = (id: string, v: boolean) => setOn((o) => ({ ...o, [id]: v }));
  const n = Object.values(on).filter(Boolean).length;
  const w = on.fmt ? 380 : 470;
  const h = on.fmt ? 475 : 470;
  return (
    <Frame mod={4} kind="simu">
      <Title>Génération d’images : six ingrédients, là aussi</Title>
      <Lede>Activez les ingrédients : le visuel passe d’une image de banque générique à un visuel de marque.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 24, ...dl(100) }}>
        <M2Ing id="style" on={on} set={set} name="Style" q="photo, illustration, 3D…" tone="violet" />
        <M2Ing id="comp" on={on} set={set} name="Composition" q="cadrage, angle" tone="blue" />
        <M2Ing id="light" on={on} set={set} name="Lumière" q="ambiance, moment" tone="yellow" />
        <M2Ing id="pal" on={on} set={set} name="Palette" q="couleurs de marque" tone="pink" />
        <M2Ing id="fmt" on={on} set={set} name="Format" q="ratio du support" tone="teal" />
        <M2Ing id="neg" on={on} set={set} name="Exclusions" q="ce qu’on ne veut pas" tone="coral" />
        <div style={{ marginTop: 6, fontSize: 22, color: C.muted }}>
          Ingrédients actifs : <strong style={{ fontFamily: display, fontSize: 30, color: C.violet }}>{n} / 6</strong>
        </div>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 730, top: 270, width: 480, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(200) }}>
        <div style={{ position: 'relative', width: w, height: h, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW, transition: `width 400ms ${EASE}, height 400ms ${EASE}` }}>
          <CupArt w={w} h={h} bg={on.pal ? BRAND.cream : '#E4E7EC'} accent={on.style ? BRAND.coffee : '#7A8394'} cup={on.style ? '#FFFFFF' : '#F5F6F8'} bubble={!!on.comp} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 85% 10%, rgba(255,196,120,.55), rgba(255,196,120,0) 70%)', opacity: on.light ? 1 : 0, transition: 'opacity 500ms' }} />
          {on.neg ? null : (
            <div style={{ position: 'absolute', left: 16, bottom: 14, fontFamily: display, fontWeight: 800, fontSize: 22, color: 'rgba(16,24,40,.55)', letterSpacing: '0.02em' }}>CAFFÉ BEST COFEE</div>
          )}
        </div>
      </div>
      <PromptBox title="prompt-image.txt" size={20} cls={A.right} style={{ position: 'absolute', left: 1260, top: 270, width: 540, height: 600, ...dl(300) }}>
        <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Une tasse de café vue de dessus sur une table de bureau.</div>
        <M2Line show={!!on.style} tone="violet">Photographie de produit réaliste, mise au point nette sur la tasse.</M2Line>
        <M2Line show={!!on.comp} tone="blue">Vue zénithale, tasse centrée, espace libre à droite pour un texte.</M2Line>
        <M2Line show={!!on.light} tone="yellow">Lumière naturelle douce du matin, venant d’une fenêtre.</M2Line>
        <M2Line show={!!on.pal} tone="pink">Palette : crème, brun torréfié, touches de blanc.</M2Line>
        <M2Line show={!!on.fmt} tone="teal">Format vertical 4:5 pour le fil Instagram.</M2Line>
        <M2Line show={!!on.neg} tone="coral">Sans texte, sans logo, sans personne.</M2Line>
      </PromptBox>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
        Le texte du slogan s’ajoute ensuite dans Canva ou votre outil de mise en page : l’IA écrit encore mal dans les images.
      </Hint>
    </Frame>
  );
};

// ─── Les styles visuels (cartes à retourner) ────────────────────────────────
const M4Style = ({ name, use, bg, accent, cup, bubble = false, prompt }: { name: string; use: string; bg: string; accent: string; cup: string; bubble?: boolean; prompt: string }) => (
  <FlipCard
    w={390}
    h={520}
    tone="violet"
    backTone="violet"
    flipAt={1}
    front={
      <>
        <div style={{ margin: '-6px -6px 0', borderRadius: 12, overflow: 'hidden' }}>
          <CupArt w={342} h={260} bg={bg} accent={accent} cup={cup} bubble={bubble} />
        </div>
        <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{name}</div>
        <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{use}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.violet.fg} size={18}>
          Mots-clés de style
        </Eyebrow>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 20, lineHeight: 1.55, color: C.ink }}>{prompt}</div>
      </>
    }
  />
);

const M4_Styles: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Quatre familles de styles pour la même tasse</Title>
    <Lede>Le style se décide comme une ligne éditoriale : un ou deux, pas dix. Retournez les cartes pour les mots-clés.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, display: 'flex', gap: 40, ...dl(100) }}>
      <M4Style name="Photo produit" use="E-shop, publicité, fiches produit." bg="#EFE6DA" accent={BRAND.coffee} cup="#FFFFFF" prompt="photographie produit, lumière studio douce, fond uni, mise au point nette, réaliste" />
      <M4Style name="Illustration plate" use="Infographies, carrousels, newsletters." bg="#E6F0FC" accent={C.blue} cup="#FFFFFF" bubble prompt="illustration vectorielle plate, aplats de couleur, formes simples, sans dégradé" />
      <M4Style name="Rendu 3D doux" use="Lancement, bannières, visuels « tech »." bg="#EFE9FC" accent={C.violet} cup="#F7F3FF" prompt="rendu 3D, matières mates, ombres douces, couleurs pastel, style argile" />
      <M4Style name="Aquarelle" use="Storytelling, producteurs, saisonnalité." bg="#E2F6EE" accent={C.teal} cup="#FBFFFD" prompt="aquarelle, papier texturé, bords irréguliers, couleurs naturelles, touche artisanale" />
    </div>
    <Callout title="Droits" tone="coral" icon="scale" cls={A.fade} style={{ position: 'absolute', left: 120, top: 840, width: 1680, ...dl(600) }} size={22}>
      Décrivez un style avec des mots ; n’écrivez pas « à la manière de » un illustrateur vivant ou d’une marque.
    </Callout>
  </Frame>
);

// ─── Les formats ────────────────────────────────────────────────────────────
const M4Fmt = ({ beat, w, h, ratio, use, tone }: { beat: number; w: number; h: number; ratio: string; use: string; tone: Tone }) => (
  <div className={b.pop(beat)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, ...vars({ o: 'bottom' }) }}>
    <div style={{ width: w, height: h, borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 3px ${STRONG[tone]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 30, color: T[tone].fg }}>
      {ratio}
    </div>
    <div style={{ fontSize: 20, lineHeight: 1.35, color: C.soft, textAlign: 'center', width: Math.max(w, 200) }}>{use}</div>
  </div>
);

const M4_Formats: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Visuels marketing : le bon format pour chaque support</Title>
    <Lede>Indiquez le ratio dans le prompt : recadrer après coup coupe souvent l’essentiel.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, height: 480, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <M4Fmt beat={1} w={240} h={240} ratio="1:1" use="Post carré · 1080 × 1080" tone="blue" />
      <M4Fmt beat={2} w={220} h={275} ratio="4:5" use="Fil Instagram, LinkedIn mobile · 1080 × 1350" tone="pink" />
      <M4Fmt beat={3} w={190} h={338} ratio="9:16" use="Story, Reel, TikTok · 1080 × 1920" tone="coral" />
      <M4Fmt beat={4} w={360} h={203} ratio="16:9" use="Vidéo, présentation · 1920 × 1080" tone="violet" />
      <M4Fmt beat={5} w={300} h={157} ratio="1,91:1" use="Lien partagé, annonce · 1200 × 628" tone="teal" />
      <M4Fmt beat={6} w={300} h={75} ratio="4:1" use="Bannière LinkedIn · 1584 × 396" tone="navy" />
    </div>
    <Callout title="Astuce" tone="blue" icon="layers" cls={b.on(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }} size={23}>
      Générez le visuel principal en 1:1 avec de l’espace autour du sujet, puis utilisez l’<strong>extension d’image</strong> (Canva, Firefly, Photoshop) pour les autres ratios.
    </Callout>
  </Frame>
);

// ─── Pièges d’une image générée (hotspots) ──────────────────────────────────
const M4_Pieges: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Ce visuel est-il publiable ? Six points de contrôle</Title>
    <Lede>Cherchez d’abord, puis cliquez les pastilles une à une (re-cliquez pour refermer).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 960, height: 600, ...dl(100) }}>
      <svg width={960} height={600} viewBox="0 0 960 600" style={{ display: 'block', borderRadius: 22, boxShadow: SHADOW }} aria-hidden>
        <rect width={960} height={600} fill="#EFE3D3" />
        <rect y={430} width={960} height={170} fill="#C9A27E" />
        <rect x={60} y={60} width={360} height={110} rx={12} fill="#3A2216" />
        <text x={240} y={128} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 40, fill: '#F7EDE1' }}>
          CAFÉ ARDNETE
        </text>
        <circle cx={790} cy={120} r={62} fill="#0E7A55" />
        <circle cx={790} cy={120} r={44} fill="none" stroke="#fff" strokeWidth={6} />
        <text x={790} y={132} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 30, fill: '#fff' }}>
          ★
        </text>
        <ellipse cx={480} cy={430} rx={150} ry={30} fill="#00000022" />
        <path d="M 370 300 h 220 v 100 a 50 50 0 0 1 -50 50 h -120 a 50 50 0 0 1 -50 -50 z" fill="#fff" />
        <path d="M 590 320 a 40 40 0 0 1 0 70" fill="none" stroke="#fff" strokeWidth={16} />
        <ellipse cx={480} cy={300} rx={110} ry={18} fill={BRAND.coffee} />
        <g fill="#E8B894">
          <rect x={150} y={360} width={110} height={70} rx={30} />
          <rect x={150} y={318} width={16} height={56} rx={8} />
          <rect x={170} y={306} width={16} height={64} rx={8} />
          <rect x={190} y={302} width={16} height={66} rx={8} />
          <rect x={210} y={306} width={16} height={64} rx={8} />
          <rect x={230} y={314} width={16} height={58} rx={8} />
          <rect x={250} y={326} width={16} height={50} rx={8} />
        </g>
        <g fill="#5B6B86">
          <circle cx={720} cy={300} r={26} />
          <rect x={690} y={330} width={60} height={100} rx={20} />
          <circle cx={800} cy={300} r={26} />
          <rect x={770} y={330} width={60} height={100} rx={20} />
          <circle cx={880} cy={300} r={26} />
          <rect x={850} y={330} width={60} height={100} rx={20} />
        </g>
        <text x={480} y={560} textAnchor="middle" style={{ fontFamily: body, fontSize: 24, fill: '#3A2216' }}>
          Le meilleur café du monde, garanti 100 % bio
        </text>
      </svg>
      <Hotspot n={1} x={240} y={115} title="Texte déformé" side="right" w={400}>
        « ARDNETE » : l’IA écrit mal. Le nom de marque s’ajoute toujours en mise en page.
      </Hotspot>
      <Hotspot n={2} x={790} y={120} title="Logo ressemblant" side="left" w={400}>
        Un rond vert avec une étoile : trop proche d’une marque connue. Risque de contrefaçon.
      </Hotspot>
      <Hotspot n={3} x={205} y={300} title="Six doigts" side="right" w={380}>
        Mains, dents, reflets : les détails anatomiques restent un point faible. Zoomez toujours.
      </Hotspot>
      <Hotspot n={4} x={800} y={380} title="Équipe uniforme" side="left" w={420}>
        Tous identiques : manque de diversité. Précisez âges, genres, styles variés et réalistes.
      </Hotspot>
      <Hotspot n={5} x={480} y={555} title="Allégations" side="left" w={400}>
        « Meilleur du monde », « 100 % bio » : interdit sans preuve ni certification.
      </Hotspot>
      <Hotspot n={6} x={480} y={350} title="Produit inexact" side="right" w={400}>
        Ce n’est pas la vraie tasse Ardente : pour le produit réel, partez d’une vraie photo.
      </Hotspot>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 270, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="green" icon="checkCircle" title="La check-list visuelle" cls={A.right} style={dl(300)} size={22}>
        Texte · logos · mains et visages · diversité · allégations · fidélité au produit réel · cohérence avec la charte graphique.
      </Card>
      <Card tone="violet" icon="sparkles" title="Transparence" cls={A.right} style={dl(450)} size={22}>
        Image réaliste de personnes ou de lieux ? Mention « image générée par IA ».
      </Card>
      <Card tone="blue" icon="camera" title="Produit réel = vraie photo" cls={A.right} style={dl(600)} size={22}>
        L’IA peut créer le décor autour d’une photo réelle du produit (retouche, extension de fond).
      </Card>
    </div>
  </Frame>
);

// ─── Le brief créatif ───────────────────────────────────────────────────────
const M4Field = ({ beat, n, label, children }: { beat: number; n: number; label: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '48px 220px 1fr', gap: 16, alignItems: 'center', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 18px', minHeight: 66, boxSizing: 'border-box' }}>
    <Num n={n} tone="pink" size={38} />
    <span style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>{label}</span>
    <span style={{ fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</span>
  </div>
);

const M4_Brief: Page = () => (
  <Frame mod={4} beats={8}>
    <Title>Le brief créatif : une page, huit rubriques</Title>
    <Lede>Que vous briefiez une agence, un graphiste ou une IA, c’est le même document. L’IA peut le rédiger avec vous.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 9 }}>
      <M4Field beat={1} n={1} label="Contexte">Ardente lance une offre B2B : le café de spécialité en entreprise.</M4Field>
      <M4Field beat={2} n={2} label="Objectif">150 demandes de dégustation en novembre.</M4Field>
      <M4Field beat={3} n={3} label="Cible">Office managers et RH de PME lyonnaises (persona Claire).</M4Field>
      <M4Field beat={4} n={4} label="Message clé">Le bon café rapproche les équipes, sans aucune contrainte.</M4Field>
      <M4Field beat={5} n={5} label="Ton & style">Chaleureux, artisanal, lumineux. Photo réelle + touches illustrées.</M4Field>
      <M4Field beat={6} n={6} label="Livrables">Post LinkedIn 4:5, story 9:16, bannière web, affiche A4, 6 slides.</M4Field>
      <M4Field beat={7} n={7} label="Contraintes">Charte (crème, brun, typo), logo réel, aucune allégation « bio » ou « vert ».</M4Field>
      <M4Field beat={8} n={8} label="Délais & budget">Validation le 25/10 · mise en ligne le 4/11 · 1 500 € de diffusion.</M4Field>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox title="prompt · brief" size={19} cls={A.right} style={dl(200)}>
        À partir de notre échange, rédige un <Cf>brief créatif</Cf> d’une page en 8 rubriques : contexte, objectif chiffré, cible, message clé, ton et style, livrables avec formats, contraintes, délais.
        {'\n\n'}Puis liste les <Cn>questions encore ouvertes</Cn> que je dois trancher.
      </PromptBox>
      <Callout title="Le piège" tone="coral" icon="alert" cls={A.right} style={dl(400)} size={22}>
        Un objectif flou (« faire connaître ») donne des visuels flous. Chiffrez-le.
      </Callout>
    </div>
  </Frame>
);

// ─── Décliner un concept ────────────────────────────────────────────────────
const M4Slogan = ({ size, color = BRAND.dark }: { size: number; color?: string }) => (
  <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.05, color }}>La pause qui compte.</div>
);

const M4_Concept: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Décliner un concept : « La pause qui compte. »</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 400, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', ...dl(100) }}>
      <Eyebrow c={C.navy} size={19}>
        Le concept
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.soft }}>Une tasse vue de dessus, une bulle de dialogue dans la mousse : le café qui fait parler.</div>
      <Eyebrow c={C.navy} size={19} style={{ marginTop: 20 }}>
        Palette
      </Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <span style={{ width: 56, height: 56, borderRadius: 12, background: BRAND.cream, boxShadow: `inset 0 0 0 1.5px ${C.rule}` }} />
        <span style={{ width: 56, height: 56, borderRadius: 12, background: BRAND.coffee }} />
        <span style={{ width: 56, height: 56, borderRadius: 12, background: BRAND.dark }} />
        <span style={{ width: 56, height: 56, borderRadius: 12, background: '#F2A20C' }} />
      </div>
      <Eyebrow c={C.navy} size={19} style={{ marginTop: 20 }}>
        Constantes
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.5, color: C.soft }}>
        Même motif · même slogan · même typo · logo réel en bas à droite
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 570, top: 190, width: 400, height: 500, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW }}>
      <CupArt w={400} h={500} bubble />
      <div style={{ position: 'absolute', left: 24, top: 24 }}>
        <M4Slogan size={40} />
      </div>
      <Tag tone="blue" size={18} style={{ position: 'absolute', left: 20, bottom: 18 }}>
        Post LinkedIn 4:5
      </Tag>
    </div>
    <Phone w={250} cls={b.on(2)} style={{ position: 'absolute', left: 1010, top: 190 }}>
      <div style={{ position: 'relative', height: '100%', background: BRAND.dark }}>
        <CupArt w={226} h={280} bg={BRAND.dark} cup="#F7EDE1" bubble style={{ position: 'absolute', top: 60 }} />
        <div style={{ position: 'absolute', left: 16, top: 360, right: 12 }}>
          <M4Slogan size={28} color={BRAND.cream} />
          <div style={{ marginTop: 14, display: 'inline-block', background: '#F2A20C', color: BRAND.dark, fontWeight: 700, fontSize: 15, borderRadius: 99, padding: '6px 14px' }}>Dégustation offerte ↑</div>
        </div>
      </div>
    </Phone>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1300, top: 190, width: 500, height: 210, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW, background: BRAND.cream }}>
      <CupArt w={210} h={210} bubble style={{ position: 'absolute', right: 0, top: 0 }} />
      <div style={{ position: 'absolute', left: 24, top: 40, width: 270 }}>
        <M4Slogan size={32} />
        <div style={{ marginTop: 10, fontSize: 17, color: BRAND.dark }}>Le café de spécialité, au bureau.</div>
      </div>
      <Tag tone="teal" size={17} style={{ position: 'absolute', left: 20, bottom: 12 }}>
        Bannière web
      </Tag>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1300, top: 430, width: 260, height: 368, borderRadius: 10, overflow: 'hidden', boxShadow: SHADOW, background: BRAND.coffee }}>
      <CupArt w={260} h={220} bg={BRAND.coffee} cup={BRAND.cream} accent={BRAND.dark} bubble />
      <div style={{ padding: '10px 18px' }}>
        <M4Slogan size={27} color={BRAND.cream} />
        <div style={{ marginTop: 8, fontSize: 14, color: BRAND.cream }}>Scannez pour réserver votre dégustation</div>
      </div>
    </div>
    <Tag tone="navy" size={17} cls={b.fade(4)} style={{ position: 'absolute', left: 1590, top: 440 }}>
      Affiche A4
    </Tag>
    <Callout title="Le prompt de déclinaison" tone="pink" icon="layers" cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(600) }} size={22}>
      « Garde exactement le même sujet, la même palette et le même style. Adapte uniquement la composition au format 9:16, en laissant le tiers bas libre pour le texte. »
    </Callout>
  </Frame>
);

// ─── Créer une présentation ─────────────────────────────────────────────────
const M4Thumb = ({ n, title, tone, beat }: { n: number; title: string; tone: Tone; beat: number }) => (
  <div className={b.pop(beat)} style={{ width: '100%', height: 214, boxSizing: 'border-box', background: C.card, borderRadius: 12, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[tone]}`, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>{pad(n)}</span>
    <span style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 23, lineHeight: 1.2, color: C.navy }}>{title}</span>
    <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
      <span style={{ width: 90, height: 8, borderRadius: 4, background: T[tone].bd }} />
      <span style={{ width: 60, height: 8, borderRadius: 4, background: C.panel }} />
    </div>
  </div>
);

const M4_Presentation: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Une présentation : le fond par l’IA, la forme par vous</Title>
    <PromptBox title="prompt · présentation commerciale" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 560, ...dl(100) }}>
      Construis une présentation commerciale de <Cf>6 slides</Cf> pour proposer Ardente Bureau à une DRH.
      {'\n\n'}Pour chaque slide : un titre-message (une phrase qui affirme), 3 points maximum, un visuel suggéré, et les notes de l’orateur.
      {'\n\n'}Dernière slide : une proposition d’action concrète.
    </PromptBox>
    <div style={{ position: 'absolute', left: 740, top: 190, display: 'grid', gridTemplateColumns: 'repeat(3, 340px)', gap: 20 }}>
      <M4Thumb n={1} beat={1} tone="navy" title="Vos équipes reviennent au bureau : donnons-leur une raison" />
      <M4Thumb n={2} beat={2} tone="coral" title="Le café actuel coûte cher… en motivation" />
      <M4Thumb n={3} beat={3} tone="blue" title="Ardente Bureau : installé en une semaine" />
      <M4Thumb n={4} beat={4} tone="green" title="Ce qu’en disent nos clients" />
      <M4Thumb n={5} beat={5} tone="yellow" title="Un tarif clair, sans engagement" />
      <M4Thumb n={6} beat={6} tone="violet" title="Proposition : une dégustation le 18 novembre" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="blue" icon="type" title="Titres-messages" cls={A.fade} style={{ flex: 1, ...dl(400) }} size={22}>
        Lire les titres seuls doit raconter toute l’histoire.
      </Card>
      <Card tone="violet" icon="slides" title="Outils" cls={A.fade} style={{ flex: 1, ...dl(500) }} size={22}>
        Gamma, Copilot dans PowerPoint, Canva : un premier jet en 5 minutes.
      </Card>
      <Card tone="coral" icon="palette" title="Toujours reprendre" cls={A.fade} style={{ flex: 1, ...dl(600) }} size={22}>
        Modèle de l’entreprise, vrais chiffres, vrais témoignages.
      </Card>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={2}
    title="Visuels générés"
    q="Vous voulez montrer la vraie tasse Ardente dans un décor de bureau. Quelle est la meilleure approche ?"
    explain="Le produit réel se photographie ; l’IA excelle pour le décor, l’extension de fond et les variantes. On garde la fidélité au produit et on mentionne l’usage de l’IA si le rendu est réaliste."
  >
    <Opt why="L’IA va inventer une tasse « plausible » : le client recevra un produit différent de l’image. Pratique trompeuse.">Je décris la tasse et je laisse l’IA la générer</Opt>
    <Opt ok why="Exact : produit réel + décor généré. Fidélité garantie, et l’IA fait ce qu’elle fait de mieux.">
      Je pars d’une vraie photo et l’IA génère le décor autour
    </Opt>
    <Opt why="Ce sont des créations protégées : on ne réutilise pas le visuel d’un autre, même retouché.">Je reprends le visuel d’un concurrent et je change le logo</Opt>
    <Opt why="Une banque d’images montre une tasse générique : pas votre produit, et aucun lien avec la marque.">J’achète une photo de tasse en banque d’images</Opt>
  </QcmPage>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="3"
    title="Un concept de campagne et ses supports"
    defi="campagne"
    who="En binôme · campagne de lancement"
    minutes={25}
    objective={
      <>
        Imaginer un <strong>concept de campagne</strong>, rédiger son brief créatif et produire au moins <strong>trois visuels cohérents</strong> sur des formats différents.
      </>
    }
    where={<>1 concept (phrase + motif + palette) · 1 brief créatif en 8 rubriques · 3 visuels déclinés (post, story, bannière ou affiche) · le plan de 6 slides</>}
    crit={
      <>
        <CheckItem id="a3c1" size={22}>Le concept tient en une phrase</CheckItem>
        <CheckItem id="a3c2" size={22}>Les visuels sont reconnaissables comme une même campagne</CheckItem>
        <CheckItem id="a3c3" size={22}>Check-list visuelle passée (texte, logo, mains…)</CheckItem>
        <CheckItem id="a3c4" size={22}>Les formats correspondent aux supports</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Demandez 10 concepts à partir de votre slogan, gardez-en un. <strong>2.</strong> Faites rédiger le brief créatif. <strong>3.</strong> Générez le visuel principal avec les 6 ingrédients.{' '}
    <strong>4.</strong> Déclinez-le en conservant sujet, palette et style. <strong>5.</strong> Ajoutez slogan et logo dans votre outil de mise en page.
    <Bonus>Générez le plan de 6 slides de la présentation commerciale associée.</Bonus>
  </LabPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M4_Synthese: Page = () => (
  <Frame mod={4} kind="synthese">
    <Title>Ce qu’on retient du module 4</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="violet" d={100}>
        Prompt image : <strong>sujet, style, composition, lumière, palette, format, exclusions</strong>.
      </SynthRow>
      <SynthRow n={2} tone="pink" d={200}>
        Le <strong>texte et le logo</strong> s’ajoutent en mise en page, pas dans la génération.
      </SynthRow>
      <SynthRow n={3} tone="coral" d={300}>
        Avant publication : <strong>texte, logos, mains, diversité, allégations, produit réel</strong>.
      </SynthRow>
      <SynthRow n={4} tone="blue" d={400}>
        Un <strong>brief créatif</strong> en 8 rubriques, avec un objectif chiffré.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        Décliner = <strong>garder les constantes</strong>, adapter seulement la composition.
      </SynthRow>
    </div>
    <ProjectCard mod={4}>
      Votre campagne a un concept, un brief créatif et des visuels déclinés sur plusieurs formats. Il reste à adapter les messages à chaque canal et chaque public.
    </ProjectCard>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [M4_Section, M4_ImgPrompt, M4_Styles, M4_Formats, M4_Pieges, M4_Brief, M4_Concept, M4_Presentation, M4_Qcm, M4_Atelier, M4_Synthese];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · SECTION M4 · 13:30

OBJECTIF — Relancer l’après-midi et annoncer le module visuel.

DIRE — « Bon retour ! Cet après-midi, on montre et on mesure. On commence par les visuels : comment générer une image utile, quels formats, quels pièges, comment rédiger un brief créatif, comment décliner un concept sur tous les supports, et comment produire une présentation. L’atelier 3 : un concept de campagne et ses supports. »

TRANSITION — « Comme pour le texte, une image se brief. »`,
  `⏱ 5 min · PROMPT IMAGE (interactif)

OBJECTIF — Montrer qu’un prompt d’image a ses propres ingrédients.

DIRE — « Prompt de départ : une tasse de café sur un bureau. Résultat : une image de banque, grise, avec un faux texte illisible. » Activer Style : « On choisit un rendu. » Composition : « Un cadrage, et de l’espace pour le texte. » Lumière : « Une ambiance. » Palette : « Nos couleurs de marque. » Format : « Le ratio du support. » Exclusions : « Sans texte, sans logo, sans personne : le faux texte disparaît. »

INSISTER — Le slogan et le logo s’ajoutent après, dans Canva ou votre outil de mise en page. L’IA écrit encore mal dans les images et ne connaît pas votre vrai logo.

TRANSITION — « Le style, justement : il y a quatre grandes familles. »`,
  `⏱ 3 min · STYLES (cartes à retourner)

OBJECTIF — Donner un vocabulaire de styles et la règle de cohérence.

DIRE — « Même tasse, quatre styles : photo produit, illustration plate, 3D douce, aquarelle. Chaque style a son usage. Retournons les cartes : voici les mots-clés à mettre dans le prompt. » → pour tout retourner. « Comme une ligne éditoriale : une marque choisit un ou deux styles, pas dix. »

INSISTER — Droits : décrivez le style avec des mots, ne demandez pas « à la manière de » un illustrateur vivant ou une marque.

TRANSITION — « Deuxième décision : le format. »`,
  `⏱ 3 min · FORMATS (6 clics)

OBJECTIF — Associer chaque ratio à son support.

DIRE — → « Le carré, le post classique. » → « Le 4:5, qui occupe plus d’écran sur mobile. » → « Le 9:16, stories, Reels, TikTok. » → « Le 16:9, vidéo et présentation. » → « Le 1,91:1, lien partagé et annonces. » → « Et la bannière LinkedIn, très étirée. »

INSISTER — L’astuce : générer le visuel principal avec de l’espace autour, puis utiliser l’extension d’image pour les autres formats, plutôt que recadrer.

TRANSITION — « Avant de publier un visuel, on le contrôle. Jeu des erreurs. »`,
  `⏱ 4 min · PIÈGES D’UNE IMAGE (exercice, pastilles cliquables)

OBJECTIF — Entraîner l’œil critique sur une image générée.

DIRE — « Voici un visuel généré, volontairement raté. En binôme, 45 secondes : combien de problèmes voyez-vous ? » Puis cliquer les pastilles une à une (re-cliquer pour refermer avant la suivante). 1 : le nom de marque mal écrit. 2 : un logo trop proche d’une marque connue, risque de contrefaçon. 3 : six doigts. 4 : une équipe uniforme, aucun réalisme ni diversité. 5 : des allégations interdites sans preuve. 6 : ce n’est pas le vrai produit.

INSISTER — La carte de droite : pour montrer le produit réel, on part d’une vraie photo et l’IA crée le décor. Et une image réaliste de personnes ou de lieux se signale comme générée par IA.

TRANSITION — « Pour éviter ces problèmes en amont : un bon brief. »`,
  `⏱ 4 min · BRIEF CRÉATIF (8 clics)

OBJECTIF — Donner la structure d’un brief créatif et le faire rédiger avec l’IA.

DIRE — « Huit rubriques, sur une page. » → les révéler une à une en lisant l’exemple Ardente. « Ce document, vous pouvez l’envoyer à une agence, à un graphiste… ou vous en servir pour piloter l’IA. » Montrer le prompt : « Après une conversation, on lui demande de rédiger le brief, puis de lister les questions encore ouvertes : très utile pour voir ce qu’on n’a pas décidé. »

INSISTER — Un objectif flou donne des visuels flous : 150 demandes de dégustation, pas « faire connaître ».

TRANSITION — « Le brief validé, on crée le concept et on le décline. »`,
  `⏱ 4 min · DÉCLINER UN CONCEPT (4 clics)

OBJECTIF — Montrer la cohérence d’une déclinaison multi-supports.

DIRE — « Le concept : “La pause qui compte.” Une tasse vue de dessus, une bulle de dialogue dans la mousse : le café qui fait parler. Une palette, des constantes. » → le post LinkedIn. → la story, en version sombre. → la bannière web. → l’affiche A4 avec un QR code. « Quatre supports, et on reconnaît la même campagne au premier coup d’œil. »

INSISTER — Le prompt de déclinaison : garder exactement sujet, palette, style ; ne changer que la composition.

TRANSITION — « Dernier support visuel : la présentation commerciale. »`,
  `⏱ 4 min · PRÉSENTATIONS (6 clics)

OBJECTIF — Produire le fond d’une présentation avec l’IA.

DIRE — « Le prompt demande six slides, chacune avec un titre-message : une phrase qui affirme, pas un mot-clé. » → révéler les six vignettes. « Lisez seulement les titres : vous avez toute l’histoire, du problème à la proposition d’action. » « Les outils comme Gamma, Copilot dans PowerPoint ou Canva font un premier jet en cinq minutes. Mais on reprend toujours dans le modèle de l’entreprise, avec les vrais chiffres. »

TRANSITION — « Petit QCM avant l’atelier. »`,
  `⏱ 2 min · QCM 2 (visuels)

OBJECTIF — Vérifier la bonne pratique pour montrer un produit réel.

DIRE — « Vote à main levée. » Bonne réponse : B. « Produit réel photographié, décor généré : fidélité et créativité. Générer le produit lui-même, c’est risquer de montrer quelque chose qui n’existe pas. »

TRANSITION — « À vous : atelier 3. »`,
  `⏱ 25 min · ATELIER 3 — CONCEPT ET SUPPORTS (minuteur)

OBJECTIF — Produire un concept de campagne, son brief et au moins trois visuels cohérents.

DIRE — « Vingt-cinq minutes. Partez de votre slogan du module 3. Demandez dix concepts, gardez-en un. Faites rédiger le brief créatif. Générez le visuel principal avec les ingrédients du prompt image. Déclinez-le en gardant sujet, palette et style. Et ajoutez le slogan et le logo dans votre outil de mise en page. »

ANIMATION — Lancer le minuteur. Vérifier à 10 minutes que chaque binôme a un concept en une phrase. Si un outil d’image n’est pas disponible, accepter des prompts d’image rédigés + maquettes papier. Faire passer la check-list visuelle avant la fin.

TRANSITION — « Je résume. »`,
  `⏱ 1 min · SYNTHÈSE M4

OBJECTIF — Clore le module, relier au carnet de campagne.

DIRE — « Cinq idées. » Les lire. « Votre campagne a maintenant un concept, un brief et des visuels. Prochaine étape : adapter les messages à chaque canal et chaque public. »

TRANSITION — « Module 5 : personnalisation et adaptation. »`,
];
// @@NOTES-END
