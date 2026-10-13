// Publie la version vitrine sur GitHub Pages (branche gh-pages) depuis cet ordinateur.
// Usage : npm run publier
// Le projet est copié dans un dossier temporaire (votre dossier n'est pas modifié),
// préparé pour l'export statique, construit, puis envoyé sur la branche gh-pages.
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = process.cwd();
const run = (cmd, args, cwd, env = {}) => execFileSync(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
const out = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8" }).trim();

const remote = out("git", ["remote", "get-url", "origin"], root);
const match = /github\.com[/:]([^/]+)\/([^/.]+)/.exec(remote);
if (!match) throw new Error(`Dépôt GitHub introuvable (origin : ${remote})`);
const [, owner, repo] = match;
const siteUrl = `https://${owner.toLowerCase()}.github.io/${repo}`;

const work = mkdtempSync(path.join(tmpdir(), "yoru-pages-"));
try {
  console.log(`Copie du projet dans ${work}`);
  cpSync(root, work, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(root, src);
      return !/^(node_modules|\.next|\.git|out)(\/|$)/.test(rel) && !/^\.env(\..*)?\.local$|^\.env$/.test(rel);
    },
  });
  run("npm", ["ci", "--prefer-offline", "--no-audit", "--no-fund"], work);
  run("node", ["deploy/github-pages/prepare.mjs", "--copie"], work);
  run("npx", ["next", "build"], work, {
    STATIC_EXPORT: "1",
    PAGES_BASE_PATH: `/${repo}`,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_GITHUB_REPO: `${owner}/${repo}`,
    NEXT_PUBLIC_GITHUB_BRANCH: "main",
    NEXT_TELEMETRY_DISABLED: "1",
  });

  const site = path.join(work, "out");
  const name = out("git", ["config", "user.name"], root);
  const email = out("git", ["config", "user.email"], root);
  run("git", ["init", "-q", "-b", "gh-pages"], site);
  run("git", ["-c", `user.name=${name}`, "-c", `user.email=${email}`, "add", "-A"], site);
  run("git", ["-c", `user.name=${name}`, "-c", `user.email=${email}`, "commit", "-q", "-m", `Publication de la vitrine (${new Date().toISOString()})`], site);
  run("git", ["push", "-f", "-q", remote, "gh-pages"], site);
  console.log(`\nEnvoyé. Le site sera à jour dans 1 à 2 minutes : ${siteUrl}/`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
