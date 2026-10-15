import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Feather, Scale, ShieldCheck } from "lucide-react";
import { UNIVERSES } from "@/data/universes";
import { AUTHORS } from "@/data/authors";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink, BtnArrow } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { VelocityMarquee } from "@/components/motion/Scroll";
import { Sparkle } from "@/components/ui/Decor";
import { LogoMark } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "À propos",
  description: "YORU, média pop culture : notre mission éditoriale, notre charte, nos univers et notre politique concernant les images.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  {
    icon: Eye,
    title: "Vérifier avant de publier",
    text: "Une actualité n'est publiée qu'une fois sourcée et datée. Les articles d'exemple du site sont signalés « Démo ».",
    color: "bg-cyan",
  },
  {
    icon: Feather,
    title: "Expliquer plutôt que crier",
    text: "Des dossiers et des guides qui donnent du contexte, pour les passionnés comme pour les curieux.",
    color: "bg-yellow",
  },
  {
    icon: Scale,
    title: "Respecter les créateurs",
    text: "Nous ne présentons jamais un visuel comme officiel s'il ne l'est pas, et nous créditons chaque photo.",
    color: "bg-pink",
  },
  {
    icon: ShieldCheck,
    title: "Respecter les lecteurs",
    text: "Pas de traceur publicitaire, pas de compte obligatoire : vos favoris restent dans votre navigateur.",
    color: "bg-lime",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="§ Qui sommes-nous"
        title="À propos"
        intro="YORU (夜, « nuit » en japonais) est un média digital consacré à toute la pop culture : cinéma, séries, anime, manga, jeux vidéo, comics, science-fiction, cartes à collectionner, figurines et culture geek."
        tone="ink"
      />

      <section className="mx-auto max-w-[88rem] px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Notre mission</p>
            <p className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight font-extrabold tracking-tight">
              Raconter la pop culture avec la même passion que ceux qui la vivent — et la même exigence que ceux qui
              l&apos;étudient.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed">
            <p>
              Nous croyons qu&apos;un film d&apos;animation, une carte rare ou un jeu indépendant méritent autant d&apos;attention
              qu&apos;une sortie de blockbuster. YORU réunit huit univers sous un même toit, avec une ligne simple : donner envie
              d&apos;explorer, sans jamais sacrifier l&apos;exactitude.
            </p>
            <p>
              Les articles sont signés par des pôles thématiques de la rédaction (
              {Object.values(AUTHORS)
                .map((a) => a.name)
                .join(", ")}
              ).
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 grid items-center gap-8 border-[4px] border-ink bg-ink p-8 text-paper shadow-pop-lg sm:grid-cols-[auto_1fr] sm:p-10">
          <div className="flex items-center gap-5" aria-hidden>
            <LogoMark className="size-20" ring />
            <span lang="ja" className="text-7xl leading-none font-bold text-violet">
              夜
            </span>
          </div>
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.3em] text-muted-ink uppercase">Pourquoi YORU ?</p>
            <p className="mt-3 text-2xl font-extrabold">
              Yoru (<span lang="ja">夜</span>) signifie « nuit » en japonais.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-paper/80">
              C&apos;est le moment des épisodes enchaînés, des tomes qu&apos;on ne lâche plus, des parties qui s&apos;étirent et des
              boosters qu&apos;on ouvre un par un. Notre devise, <span lang="en" className="font-bold text-paper">Collect the night.</span>,
              résume l&apos;idée : collectionner ces nuits-là, et les histoires, les cartes et les objets qui les accompagnent.
            </p>
          </div>
        </Reveal>
      </section>

      <div className="mt-20 -rotate-1 border-y-[4px] border-ink bg-pink py-3">
        <VelocityMarquee baseVelocity={-1.8} itemClassName="gap-6 pr-6">
          {UNIVERSES.map((u) => (
            <span key={u.slug} className="display flex items-center gap-6 text-4xl">
              {u.name}
              <Sparkle className="size-6 text-ink" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <section className="mx-auto max-w-[88rem] px-4 pt-20 sm:px-6 lg:px-8">
        <SectionHeading number="02" kicker="Charte éditoriale" title="Nos engagements" numberClassName="[--stroke:var(--color-paper-3)]" />
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
          {VALUES.map((v, i) => (
            <RevealItem key={v.title}>
              <div
                className={`h-full border-[3px] border-ink p-6 shadow-pop transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:-rotate-1 ${v.color}`}
                style={{ transform: `rotate(${[-1, 1, -0.5, 0.8][i]}deg)` }}
              >
                <v.icon className="size-8" aria-hidden />
                <h3 className="mt-4 text-xl font-extrabold">{v.title}</h3>
                <p className="mt-2 leading-relaxed">{v.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section id="images" className="mx-auto max-w-[88rem] scroll-mt-28 px-4 pt-20 sm:px-6 lg:px-8">
        <SectionHeading number="03" kicker="Transparence" title="Images & droits" numberClassName="[--stroke:var(--color-paper-3)]" />
        <Reveal className="mt-10 grid gap-8 text-lg leading-relaxed lg:grid-cols-2">
          <div className="space-y-4">
            <p>
              Les photographies du site proviennent d&apos;<strong>Unsplash</strong> et sont utilisées selon la licence Unsplash, qui
              autorise leur usage gratuit, y compris commercial. Chaque photo est créditée à son auteur.
            </p>
            <p>
              Certaines photos montrent des objets, des costumes ou des produits liés à des marques et des personnages protégés.
              Elles illustrent nos sujets à titre éditorial : <strong>ce ne sont pas des visuels officiels</strong>, et leur
              présence n&apos;implique aucun partenariat avec les ayants droit.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Les motifs graphiques (trames, rayons, pixels, bulles) sont créés en CSS pour YORU. Le logo et la mise en page sont
              originaux. Dans la boutique, les produits sont présentés soit avec les visuels de leurs éditeurs, soit avec des illustrations
              générées par YORU (sans visuel officiel) en attendant ces photos. Les logos de licences et de marques, en filigrane,
              servent uniquement à les identifier.
            </p>
            <p>
              Vous êtes ayant droit et souhaitez signaler un contenu ? <Link href="/contact" className="font-bold underline decoration-pink decoration-[3px]">Contactez-nous</Link>, nous
              traiterons votre demande rapidement.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[88rem] px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start gap-6 border-[4px] border-ink bg-yellow p-8 shadow-pop-lg sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="display text-5xl">Une idée, une erreur, une envie ?</p>
            <p className="mt-2 text-lg">La rédaction lit tous les messages.</p>
          </div>
          <ButtonLink href="/contact" size="lg">
            Nous écrire <BtnArrow />
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
