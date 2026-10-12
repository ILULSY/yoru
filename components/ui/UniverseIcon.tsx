import { BookOpen, Clapperboard, Cpu, Gamepad2, Gem, Sparkles, Tv, Zap, type LucideProps } from "lucide-react";
import type { UniverseSlug } from "@/types/content";

const ICONS: Record<UniverseSlug, React.ComponentType<LucideProps>> = {
  cinema: Clapperboard,
  series: Tv,
  anime: Sparkles,
  manga: BookOpen,
  "jeux-video": Gamepad2,
  comics: Zap,
  collectors: Gem,
  tech: Cpu,
};

export function UniverseIcon({ universe, ...props }: { universe: UniverseSlug } & LucideProps) {
  const Icon = ICONS[universe];
  return <Icon aria-hidden {...props} />;
}

/** Classe du motif graphique propre à chaque univers. */
export const PATTERN_CLASS: Record<UniverseSlug, string> = {
  cinema: "rays",
  series: "scanlines",
  anime: "speedlines",
  manga: "tone",
  "jeux-video": "pixels",
  comics: "benday",
  collectors: "holo animate-holo",
  tech: "grid-tech",
};
