import "server-only";
import { fileStore } from "@/lib/shop/store/file";
import { supabaseStore } from "@/lib/shop/store/supabase";
import type { ProductStore } from "@/lib/shop/store/types";

export { StoreError } from "@/lib/shop/store/types";
export type { CatalogSnapshot, ProductStore, StoreHealth } from "@/lib/shop/store/types";
export { PRODUCTS_TAG } from "@/lib/shop/store/supabase";

/** Stockage choisi par PRODUCTS_SOURCE : "file" (défaut) ou "supabase". */
export function getStore(): ProductStore {
  return process.env.PRODUCTS_SOURCE === "supabase" ? supabaseStore : fileStore;
}
