import "server-only";
import { constants, promises as fs } from "node:fs";
import path from "node:path";
import type { Product } from "@/types/shop";
import { validateCatalog } from "@/lib/shop/schema";
import type { CatalogSnapshot, ProductStore } from "@/lib/shop/store/types";
import { removeProduct, upsertProduct } from "@/lib/shop/catalog-ops";

/**
 * Catalogue dans un fichier JSON versionnable (data/shop/catalog.json).
 * Convient au développement et à un serveur Node classique (`next start`, VPS,
 * Docker avec volume). Sur un hébergement serverless (Vercel…), le disque est
 * en lecture seule : utilisez Supabase.
 */

const DIR = path.join(process.cwd(), "data", "shop");
export const CATALOG_FILE = path.join(DIR, "catalog.json");
const BACKUP_FILE = path.join(DIR, "catalog.backup.json");
export const UPLOADS_DIR = path.join(DIR, "uploads");

interface CatalogDoc {
  version: 1;
  updatedAt: string;
  products: unknown[];
}

let memo: { mtimeMs: number; snap: CatalogSnapshot } | null = null;

// Les écritures sont traitées une par une (lecture → modification → écriture).
let queue: Promise<unknown> = Promise.resolve();
function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readDoc(): Promise<CatalogDoc> {
  let raw: string;
  try {
    raw = await fs.readFile(CATALOG_FILE, "utf8");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, updatedAt: new Date().toISOString(), products: [] };
    throw e;
  }
  // Un fichier illisible fait échouer la lecture : les pages déjà générées restent servies.
  const doc = JSON.parse(raw) as Partial<CatalogDoc>;
  if (!Array.isArray(doc.products)) throw new Error(`[catalogue] ${CATALOG_FILE} : champ « products » manquant`);
  return { version: 1, updatedAt: doc.updatedAt ?? new Date().toISOString(), products: doc.products };
}

async function writeDoc(doc: CatalogDoc) {
  const tmp = `${CATALOG_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(doc, null, 2) + "\n", "utf8");
  try {
    await fs.copyFile(CATALOG_FILE, BACKUP_FILE);
  } catch {}
  await fs.rename(tmp, CATALOG_FILE);
  memo = null;
}

async function snapshot(): Promise<CatalogSnapshot> {
  let mtimeMs = 0;
  try {
    mtimeMs = (await fs.stat(CATALOG_FILE)).mtimeMs;
  } catch {}
  if (memo && memo.mtimeMs === mtimeMs && mtimeMs !== 0) return memo.snap;
  const snap = validateCatalog((await readDoc()).products);
  if (snap.problems.length) console.error(`[catalogue] fiches ignorées :\n${snap.problems.join("\n")}`);
  memo = { mtimeMs, snap };
  return snap;
}


export const fileStore: ProductStore = {
  kind: "file",
  label: "Fichier data/shop/catalog.json",
  read: snapshot,
  readFresh: snapshot,

  save(product: Product, opts) {
    return serialize(async () => {
      const doc = await readDoc();
      upsertProduct(doc.products, product, opts);
      doc.updatedAt = new Date().toISOString();
      await writeDoc(doc);
    });
  },

  remove(slug: string) {
    return serialize(async () => {
      const doc = await readDoc();
      removeProduct(doc.products, slug);
      doc.updatedAt = new Date().toISOString();
      await writeDoc(doc);
    });
  },

  async saveImage(data: Buffer, name: string) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, name), data, { flag: "wx" });
    return `/media/shop/${name}`;
  },

  async health() {
    try {
      await fs.access(DIR, constants.W_OK);
      try {
        await fs.access(CATALOG_FILE, constants.W_OK);
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
      }
      return { writable: true };
    } catch {
      return {
        writable: false,
        message:
          "Le disque du serveur est en lecture seule (c'est le cas des hébergements serverless comme Vercel). Les modifications ne peuvent pas être enregistrées ici : passez au stockage Supabase (PRODUCTS_SOURCE=supabase, voir README).",
      };
    }
  },
};
