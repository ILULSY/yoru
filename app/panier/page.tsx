import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CartPageClient } from "@/components/shop/CartPageClient";
import { ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Votre panier YORU.",
  alternates: { canonical: "/panier" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero kicker="§ Boutique" title="Mon panier" tone="yellow" />
      <div className="mx-auto max-w-[88rem] px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <ShopDemoNotice className="mb-8" />
        <CartPageClient />
        <ShopPerks className="mt-14" />
      </div>
    </>
  );
}
