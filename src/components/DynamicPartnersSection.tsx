"use client";

import { useCustomization } from "@/hooks/use-customization";
import PartnersCarousel from "@/components/PartnersCarousel";

export default function DynamicPartnersSection() {
  const { customization } = useCustomization();

  // Ne pas afficher si la section est explicitement désactivée
  if (customization && !customization.show_partners_section) {
    return null;
  }

  // PartnersCarousel gère lui-même le cas "aucun partenaire" et renvoie null
  return (
    <footer className="w-full flex flex-col items-center bg-background pt-8 pb-4 mt-16 border-t">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: customization?.text_color }}
      >
        Nos partenaires
      </h3>
      <PartnersCarousel />
    </footer>
  );
}
