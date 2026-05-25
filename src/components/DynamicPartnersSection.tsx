"use client";

import { useCustomization } from "@/hooks/use-customization";
import PartnersCarousel from "@/components/PartnersCarousel";

export default function DynamicPartnersSection() {
  const { customization, isLoading: isCustomizationLoading } = useCustomization();
  
  // Ne pas afficher si la section est explicitement désactivée
  // Permettre l'affichage pendant le chargement initial (customization === null)
  if (customization && !customization.show_partners_section) {
    return null;
  }
  
  // Fallback si customization n'est pas encore chargé (SSR/hydratation)
  if (!customization) {
    return (
      <footer className="w-full flex flex-col items-center bg-background pt-8 pb-4 mt-16 border-t">
        <h3 className="text-lg font-semibold mb-4">Nos partenaires</h3>
        <PartnersCarousel />
      </footer>
    );
  }
  
  return (
    <footer className="w-full flex flex-col items-center bg-background pt-8 pb-4 mt-16 border-t">
      <h3 
        className="text-lg font-semibold mb-4"
        style={{ color: customization.text_color }}
      >
        Nos partenaires
      </h3>
      <PartnersCarousel />
    </footer>
  );
}
