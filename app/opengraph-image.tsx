import { ImageResponse } from "next/og";

export const alt = "YORU — Collect the night.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CRESCENT = "M21.12 11.32A13 13 0 1 0 36.68 26.88A11 11 0 0 1 21.12 11.32Z";
const STAR = "M5 0l1.3 3.7L10 5 6.3 6.3 5 10 3.7 6.3 0 5l3.7-1.3z";

/** Image de partage par défaut, générée au build (aucune image ni police externe). */
export default function OpengraphImage() {
  const colors = ["#8B35FF", "#3155FF", "#FF2D95", "#8B35FF", "#00E5FF", "#FFE600"];
  const stars = [
    { x: 640, y: 90, s: 22 },
    { x: 760, y: 200, s: 12 },
    { x: 690, y: 300, s: 14 },
    { x: 470, y: 64, s: 12 },
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111114",
          color: "#F8F5EF",
          padding: 64,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 24 }}>
          {colors.map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>

        {/* Grande lune */}
        <svg width="520" height="520" viewBox="8 8 32 32" style={{ position: "absolute", right: -60, top: 40 }}>
          <path d={CRESCENT} fill="#8B35FF" />
        </svg>
        {stars.map((s, i) => (
          <svg key={i} width={s.s} height={s.s} viewBox="0 0 10 10" style={{ position: "absolute", left: s.x, top: s.y }}>
            <path d={STAR} fill="#F8F5EF" />
          </svg>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24 }}>
          <svg width="76" height="76" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22.5" fill="#111114" stroke="#8B35FF" strokeWidth="1.5" />
            <path d={CRESCENT} fill="#8B35FF" />
            <path d="M33 12.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#F8F5EF" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2 }}>YORU</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, textTransform: "uppercase" }}>Collect</div>
          <div style={{ fontSize: 132, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, textTransform: "uppercase", color: "#8B35FF" }}>
            the night.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 26, fontWeight: 700 }}>
          {["Anime", "Manga", "Cinéma", "Séries", "Jeux vidéo", "Comics", "Collectors"].map((t, i) => (
            <div
              key={t}
              style={{
                padding: "8px 16px",
                border: "3px solid #F8F5EF",
                background: i % 2 ? "transparent" : colors[i % colors.length],
                color: i % 2 ? "#F8F5EF" : i % colors.length === 5 || i % colors.length === 4 ? "#111114" : "#F8F5EF",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
