import type { Product, VisualKind } from "@/types/shop";
import { HOUSE_LICENSE, LICENSE_MAP } from "@/data/shop/licenses";
import { cn } from "@/lib/utils";

/**
 * Visuel d'illustration généré pour chaque produit : un « packshot » pop art
 * en SVG (aucune photo ni logo officiel). Il sera remplacé par les photos
 * fournies par le distributeur lorsque le catalogue réel sera branché.
 */

const K = "#111114";
const P = "#F8F5EF";
const PALETTE = ["#FF2D95", "#FFE600", "#00E5FF", "#8B35FF", "#3155FF", "#C6FF1A", "#FF6B35"];

function accentFor(color: string, seed: string) {
  const options = PALETTE.filter((c) => c.toLowerCase() !== color.toLowerCase());
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return options[h % options.length]!;
}

const display = { fontFamily: "var(--font-display), Impact, sans-serif" } as const;

type Pose = "spiky" | "hat" | "blade" | "critter";

/** Pose de la silhouette selon la licence (aucun personnage n'est reproduit). */
function poseFor(license: string | null): Pose {
  if (license === "one-piece") return "hat";
  if (license === "demon-slayer" || license === "jujutsu-kaisen") return "blade";
  if (license === "pokemon") return "critter";
  return "spiky";
}

/** Silhouette stylisée, dessinée dans un cadre 130 × 190. */
function Hero({ x, y, s = 1, fill = K, pose = "spiky" }: { x: number; y: number; s?: number; fill?: string; pose?: Pose }) {
  if (pose === "critter") {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
        <polygon points="28,70 14,4 52,50" />
        <polygon points="102,70 116,4 78,50" />
        <ellipse cx="65" cy="86" rx="44" ry="38" />
        <ellipse cx="65" cy="152" rx="40" ry="36" />
        <polygon points="104,150 128,108 118,146 130,140 110,172" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      {pose === "spiky" && <polygon points="43,38 35,8 51,24 55,0 65,20 77,-2 79,22 95,6 87,38" />}
      {pose === "hat" && (
        <>
          <ellipse cx="65" cy="28" rx="40" ry="8" />
          <path d="M45 28 Q47 6 65 6 Q83 6 85 28 Z" />
        </>
      )}
      {pose === "blade" && <path d="M44 44 Q44 14 65 14 Q88 14 88 44 L96 70 L84 60 Z" />}
      <circle cx="65" cy="40" r="19" />
      <path d="M47 58 L83 58 L91 120 L39 120 Z" />
      {pose === "hat" ? (
        <>
          <polygon points="83,62 126,58 126,72 81,78" />
          <circle cx="126" cy="65" r="9" />
          <polygon points="47,62 30,100 40,104 55,72" />
        </>
      ) : pose === "blade" ? (
        <>
          <polygon points="47,62 30,96 40,100 55,72" />
          <polygon points="83,62 100,90 92,96 79,74" />
          <polygon points="94,92 128,4 132,6 100,96" />
        </>
      ) : (
        <>
          <polygon points="47,62 15,30 23,22 57,60" />
          <polygon points="83,62 111,90 105,98 79,74" />
        </>
      )}
      <polygon points="43,118 33,190 49,190 61,126" />
      <polygon points="69,126 87,190 103,190 87,118" />
    </g>
  );
}

function Shape({
  kind,
  c,
  a,
  label,
  character,
  id,
  pose,
}: {
  kind: VisualKind;
  c: string;
  a: string;
  label: string;
  character?: string;
  id: string;
  pose: Pose;
}) {
  const stroke = { stroke: K, strokeWidth: 6, strokeLinejoin: "round" as const };
  switch (kind) {
    case "booster": {
      const teeth = (y: number, dir: 1 | -1) =>
        Array.from({ length: 11 }, (_, i) => `${130 + i * 14},${y} ${137 + i * 14},${y - 12 * dir}`).join(" ") + ` 284,${y}`;
      return (
        <g transform="rotate(-6 200 200)">
          <polygon points={`130,70 ${teeth(70, 1)} 284,70 284,330 130,330`} fill={a} {...stroke} />
          <polygon points={`130,330 ${teeth(330, -1)} 284,330`} fill={a} {...stroke} />
          <rect x="130" y="150" width="154" height="72" fill={`url(#holo-${id})`} stroke={K} strokeWidth="4" />
          <circle cx="207" cy="112" r="26" fill={P} {...stroke} />
          <circle cx="207" cy="112" r="9" fill={c} stroke={K} strokeWidth="4" />
          <text x="207" y="268" textAnchor="middle" fontSize="34" fill={K} style={display}>
            {label}
          </text>
          <text x="207" y="304" textAnchor="middle" fontSize="20" fill={K} style={display} letterSpacing="4">
            BOOSTER
          </text>
        </g>
      );
    }
    case "display":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={118 + i * 40} y={86 - (i % 2) * 10} width="34" height="80" fill={i % 2 ? a : P} {...stroke} strokeWidth={5} transform={`rotate(${i * 4 - 8} ${135 + i * 40} 120)`} />
          ))}
          <polygon points="85,150 125,118 355,118 315,150" fill={c} {...stroke} />
          <polygon points="315,150 355,118 355,290 315,322" fill={K} {...stroke} />
          <rect x="85" y="150" width="230" height="172" fill={P} {...stroke} />
          <rect x="85" y="196" width="230" height="56" fill={`url(#holo-${id})`} stroke={K} strokeWidth="4" />
          <text x="200" y="186" textAnchor="middle" fontSize="30" fill={K} style={display}>
            {label}
          </text>
          <text x="200" y="298" textAnchor="middle" fontSize="26" fill={K} style={display} letterSpacing="3">
            36 BOOSTERS
          </text>
        </g>
      );
    case "deck":
      return (
        <g transform="rotate(5 200 200)">
          <rect x="138" y="96" width="128" height="232" rx="12" fill={a} {...stroke} />
          <path d="M138 140 L266 140" stroke={K} strokeWidth="5" />
          <path d="M150 96 Q202 70 254 96" fill={P} {...stroke} />
          <rect x="152" y="160" width="100" height="100" fill={P} {...stroke} />
          <Hero x={170} y={170} s={0.5} pose={pose} />
          <text x="202" y="292" textAnchor="middle" fontSize="22" fill={K} style={display}>
            {label}
          </text>
          <text x="202" y="315" textAnchor="middle" fontSize="15" fill={K} style={display} letterSpacing="3">
            STARTER DECK
          </text>
        </g>
      );
    case "coffret":
      return (
        <g transform="rotate(-3 200 210)">
          <rect x="70" y="140" width="260" height="180" fill={a} {...stroke} />
          <rect x="60" y="112" width="280" height="54" fill={P} {...stroke} />
          <rect x="186" y="112" width="28" height="208" fill={K} />
          <circle cx="200" cy="232" r="46" fill={`url(#holo-${id})`} {...stroke} />
          <text x="130" y="150" textAnchor="middle" fontSize="22" fill={K} style={display}>
            {label}
          </text>
          <text x="275" y="150" textAnchor="middle" fontSize="20" fill={K} style={display} letterSpacing="2">
            COFFRET
          </text>
        </g>
      );
    case "sleeves":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={120 + i * 18} y={90 - i * 12} width="140" height="200" rx="10" fill={[a, P, c][i]} {...stroke} transform={`rotate(${-8 + i * 7} 200 200)`} />
          ))}
          <text x="230" y="215" textAnchor="middle" fontSize="44" fill={K} style={display} transform="rotate(6 230 200)">
            POP
          </text>
          <text x="230" y="250" textAnchor="middle" fontSize="20" fill={K} style={display} transform="rotate(6 230 200)">
            ×100
          </text>
        </g>
      );
    case "binder":
      return (
        <g transform="rotate(-4 200 205)">
          <rect x="100" y="80" width="210" height="250" rx="14" fill={K} {...stroke} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={122 + (i % 3) * 58} y={100 + Math.floor(i / 3) * 72} width="48" height="62" rx="4" fill={[a, c, P][i % 3]} stroke={P} strokeWidth="3" />
          ))}
          <rect x="292" y="80" width="14" height="250" fill={a} stroke={K} strokeWidth="4" />
        </g>
      );
    case "figure":
      return (
        <g transform="rotate(-3 200 205)">
          <rect x="112" y="52" width="176" height="306" fill={a} {...stroke} />
          <rect x="112" y="52" width="176" height="48" fill={K} />
          <text x="200" y="88" textAnchor="middle" fontSize="28" fill={a} style={display}>
            {label}
          </text>
          <rect x="132" y="112" width="136" height="196" fill={P} {...stroke} />
          <g clipPath={`url(#win-${id})`}>
            <rect x="132" y="112" width="136" height="196" fill={`url(#dots-${id})`} />
            <Hero x={134} y={118} s={1} pose={pose} />
          </g>
          <path d="M140 118 L170 118 L140 170 Z" fill="#ffffff" opacity="0.55" />
          <text x="200" y="342" textAnchor="middle" fontSize="26" fill={K} style={display}>
            {(character ?? "").toUpperCase()}
          </text>
        </g>
      );
    case "statue":
      return (
        <g>
          <ellipse cx="200" cy="300" rx="96" ry="24" fill={K} />
          <rect x="112" y="300" width="176" height="46" fill={a} {...stroke} />
          <ellipse cx="200" cy="300" rx="88" ry="20" fill={P} {...stroke} />
          <Hero x={118} y={82} s={1.28} pose={pose} />
          <g transform="translate(300 110) rotate(14)">
            <polygon points="0,-46 12,-16 44,-22 22,2 40,30 8,22 0,52 -10,22 -42,30 -22,2 -44,-22 -12,-16" fill={c === "#FFE600" ? "#FF2D95" : "#FFE600"} {...stroke} strokeWidth={4} />
            <text x="0" y="7" textAnchor="middle" fontSize="14" fill={K} style={display}>
              LIMITÉE
            </text>
          </g>
          <text x="200" y="332" textAnchor="middle" fontSize="20" fill={K} style={display}>
            {(character ?? "").toUpperCase()}
          </text>
        </g>
      );
    case "plush":
      return (
        <g>
          <ellipse cx="128" cy="98" rx="24" ry="44" fill={a} {...stroke} transform="rotate(-24 128 98)" />
          <ellipse cx="272" cy="98" rx="24" ry="44" fill={a} {...stroke} transform="rotate(24 272 98)" />
          <ellipse cx="200" cy="262" rx="98" ry="80" fill={a} {...stroke} />
          <circle cx="200" cy="170" r="78" fill={a} {...stroke} />
          <circle cx="172" cy="162" r="11" fill={K} />
          <circle cx="228" cy="162" r="11" fill={K} />
          <circle cx="175" cy="158" r="4" fill="#fff" />
          <circle cx="231" cy="158" r="4" fill="#fff" />
          <ellipse cx="150" cy="190" rx="14" ry="9" fill="#FF2D95" opacity="0.8" />
          <ellipse cx="250" cy="190" rx="14" ry="9" fill="#FF2D95" opacity="0.8" />
          <path d="M188 192 Q200 204 212 192" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="150" cy="320" rx="30" ry="18" fill={P} {...stroke} />
          <ellipse cx="250" cy="320" rx="30" ry="18" fill={P} {...stroke} />
        </g>
      );
    case "mug":
      return (
        <g transform="rotate(-4 200 220)">
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${165 + i * 34} 130 q-14 -18 0 -36 q14 -18 0 -36`} fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          ))}
          <path d="M266 180 a46 46 0 1 1 0 92" fill="none" stroke={K} strokeWidth="22" />
          <path d="M266 180 a46 46 0 1 1 0 92" fill="none" stroke={P} strokeWidth="10" />
          <rect x="120" y="150" width="152" height="176" rx="16" fill={P} {...stroke} />
          <rect x="138" y="186" width="116" height="96" fill={a} {...stroke} strokeWidth={4} />
          <text x="196" y="246" textAnchor="middle" fontSize="30" fill={K} style={display}>
            {label}
          </text>
        </g>
      );
    case "tshirt":
    case "hoodie":
      return (
        <g transform="rotate(3 200 210)">
          {kind === "hoodie" && <path d="M160 92 Q200 40 240 92 L232 120 Q200 100 168 120 Z" fill={K} {...stroke} />}
          <path
            d="M118 108 L166 88 Q200 116 234 88 L282 108 L326 164 L288 190 L272 172 L272 330 L128 330 L128 172 L112 190 L74 164 Z"
            fill={kind === "hoodie" ? a : P}
            {...stroke}
          />
          {kind === "hoodie" && <path d="M156 268 L244 268 L256 316 L144 316 Z" fill={K} opacity="0.85" />}
          <circle cx="200" cy={kind === "hoodie" ? 186 : 200} r="46" fill={kind === "hoodie" ? P : a} {...stroke} strokeWidth={4} />
          <text x="200" y={kind === "hoodie" ? 198 : 212} textAnchor="middle" fontSize={label.length > 5 ? 22 : 34} fill={K} style={display}>
            {label}
          </text>
        </g>
      );
    case "poster":
      return (
        <g transform="rotate(-5 200 205)">
          <rect x="112" y="62" width="176" height="262" fill={P} {...stroke} />
          <rect x="128" y="78" width="144" height="196" fill={a} />
          <rect x="128" y="78" width="144" height="196" fill={`url(#dots-${id})`} />
          <Hero x={135} y={84} s={1} fill={K} pose={pose} />
          <text x="200" y="306" textAnchor="middle" fontSize="28" fill={K} style={display}>
            {label}
          </text>
          <rect x="96" y="52" width="46" height="18" fill="#FFE600" opacity="0.85" transform="rotate(-30 119 61)" />
          <rect x="258" y="52" width="46" height="18" fill="#FFE600" opacity="0.85" transform="rotate(30 281 61)" />
        </g>
      );
    case "flag":
      return (
        <g>
          <rect x="96" y="56" width="12" height="300" fill={K} />
          <circle cx="102" cy="52" r="10" fill={a} {...stroke} strokeWidth={4} />
          <path d="M108 78 Q168 56 226 78 T334 86 L334 214 Q280 194 226 212 T108 204 Z" fill={K} {...stroke} />
          <circle cx="220" cy="128" r="30" fill={P} />
          <rect x="203" y="146" width="34" height="20" rx="4" fill={P} />
          <circle cx="209" cy="128" r="8" fill={K} />
          <circle cx="231" cy="128" r="8" fill={K} />
          <path d="M168 150 L272 196 M272 150 L168 196" stroke={P} strokeWidth="12" strokeLinecap="round" />
        </g>
      );
    case "headband":
      return (
        <g>
          <path d="M40 220 Q200 170 360 220 L360 262 Q200 212 40 262 Z" fill={a} {...stroke} />
          <path d="M40 240 L12 300 M52 250 L36 316" stroke={K} strokeWidth="14" strokeLinecap="round" />
          <path d="M40 240 L12 300 M52 250 L36 316" stroke={a} strokeWidth="6" strokeLinecap="round" />
          <rect x="138" y="172" width="124" height="70" rx="10" fill="#C9CCD3" {...stroke} />
          <path d="M200 207 m-22 0 a22 22 0 1 1 22 22 a14 14 0 1 1 -14 -14 a7 7 0 1 1 7 7" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" />
          {[150, 250].map((x) => (
            <circle key={x} cx={x} cy="184" r="4" fill={K} />
          ))}
        </g>
      );
    case "keychain":
      return (
        <g>
          <circle cx="200" cy="96" r="30" fill="none" stroke={K} strokeWidth="12" />
          <circle cx="200" cy="96" r="30" fill="none" stroke="#C9CCD3" strokeWidth="5" />
          <path d="M200 126 L200 160" stroke={K} strokeWidth="8" strokeDasharray="8 6" />
          <polygon
            points="200,160 222,214 280,214 234,248 252,304 200,270 148,304 166,248 120,214 178,214"
            fill={a}
            {...stroke}
            transform="rotate(4 200 240)"
          />
          <text x="200" y="250" textAnchor="middle" fontSize="22" fill={K} style={display}>
            {(character ?? label).toUpperCase()}
          </text>
        </g>
      );
    case "mat":
      return (
        <g transform="rotate(-6 200 210)">
          <rect x="44" y="124" width="312" height="168" rx="16" fill={K} {...stroke} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={68 + i * 56} y="168" width="42" height="58" rx="4" fill="none" stroke={a} strokeWidth="3" strokeDasharray="6 5" />
          ))}
          <text x="200" y="268" textAnchor="middle" fontSize="30" fill={a} style={display}>
            {label}
          </text>
        </g>
      );
    case "tote":
      return (
        <g transform="rotate(3 200 220)">
          <path d="M156 150 Q156 84 200 84 Q244 84 244 150" fill="none" stroke={K} strokeWidth="12" />
          <rect x="116" y="146" width="168" height="196" fill={P} {...stroke} />
          {/* Croissant de lune du logo */}
          <path d="M194.24 206.64A26 26 0 1 0 225.36 237.76A22 22 0 0 1 194.24 206.64Z" fill="#8B35FF" stroke={K} strokeWidth="3" />
          <text x="200" y="300" textAnchor="middle" fontSize="44" fill={K} style={display} letterSpacing="2">
            YORU
          </text>
        </g>
      );
  }
}

export function ProductVisual({
  product,
  className,
  priorityLabel,
}: {
  product: Pick<Product, "slug" | "visual" | "license" | "character" | "name">;
  className?: string;
  /** Variante pour éviter les doublons d'identifiants SVG quand un produit apparaît deux fois. */
  priorityLabel?: string;
}) {
  const lic = product.license ? (LICENSE_MAP[product.license] ?? HOUSE_LICENSE) : HOUSE_LICENSE;
  const c = lic.color;
  const a = accentFor(c, product.slug);
  const id = `${product.slug}${priorityLabel ? `-${priorityLabel}` : ""}`;
  const onDark = c === "#111114";
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);

  return (
    <svg viewBox="0 0 400 400" className={cn("block size-full", className)} role="img" aria-label={`Visuel d'illustration : ${product.name}`}>
      <defs>
        <linearGradient id={`holo-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF2D95" />
          <stop offset="0.35" stopColor="#FFE600" />
          <stop offset="0.65" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#8B35FF" />
        </linearGradient>
        <pattern id={`dots-${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2.4" fill={K} opacity="0.22" />
        </pattern>
        <clipPath id={`win-${id}`}>
          <rect x="132" y="112" width="136" height="196" />
        </clipPath>
        <filter id={`pop-${id}`} x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="10" dy="10" stdDeviation="0" floodColor={onDark ? "#FFE600" : K} floodOpacity="1" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={c} />
      <g opacity={onDark ? 0.18 : 0.12}>
        {rays.map((r) => (
          <polygon key={r} points="200,210 186,-200 214,-200" fill={onDark ? P : K} transform={`rotate(${r} 200 210)`} />
        ))}
      </g>
      <rect width="400" height="400" fill={`url(#dots-${id})`} opacity={onDark ? 0 : 0.6} />
      <text
        x="200"
        y="388"
        textAnchor="middle"
        fontSize={lic.short.length > 6 ? 70 : 110}
        fill="none"
        stroke={onDark ? P : K}
        strokeWidth="2.5"
        opacity="0.3"
        style={display}
      >
        {lic.short.toUpperCase()}
      </text>
      <ellipse cx="200" cy="356" rx="120" ry="16" fill={K} opacity="0.25" />
      <g filter={`url(#pop-${id})`}>
        <Shape kind={product.visual} c={c} a={a} label={lic.short.toUpperCase()} character={product.character} id={id} pose={poseFor(product.license)} />
      </g>
    </svg>
  );
}
