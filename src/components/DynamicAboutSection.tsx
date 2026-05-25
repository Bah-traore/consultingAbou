"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/lib/api";
import { useCustomization } from "@/hooks/use-customization";
import Image from "next/image";

export default function DynamicAboutSection() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { customization, isLoading: isCustomizationLoading } = useCustomization();

  useEffect(() => {
    // Fetch about section data if needed
    // For now, we'll use customization data directly
    setLoading(false);
  }, []);

  // Ne rien afficher si la section est explicitement désactivée
  // Permettre l'affichage pendant le chargement initial (customization === null)
  if (customization && !customization.show_about_section) {
    return null;
  }
  
  if (loading) {
    return null;
  }

  // Fallback si customization n'est pas encore chargé (SSR/hydratation)
  if (!customization) {
    return (
      <section className="mt-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              À propos de nous
            </h2>
            <p className="max-w-2xl text-pretty text-base sm:text-lg text-muted-foreground">
              Abou Bah Consulting est un cabinet de consultation pédagogique dédié à l'excellence éducative.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border bg-card">
            <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-background/30" />
            <Image
              src="/img/Abou-bah-Consulting.webp"
              alt="Abou BAH Consulting"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="mt-12"
      style={{ backgroundColor: customization.about_background_color || '#FFFFFF' }}
    >
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="flex flex-col gap-4">
          <h2 
            className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
            style={{ color: customization.about_title_color || '#1F2937' }}
          >
            {customization.about_title}
          </h2>
          <p 
            className="max-w-2xl text-pretty text-base sm:text-lg"
            style={{ color: customization.about_description_color || '#6B7280' }}
          >
            {customization.about_description}
          </p>
        </div>
        
        <div className="relative aspect-video overflow-hidden rounded-2xl border bg-card"
             style={{ 
               backgroundColor: customization.about_card_background_color || '#FFFFFF',
               borderColor: customization.primary_color + '40'
             }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-background/30" />
          {customization.about_image ? (
            <Image
              src={customization.about_image}
              alt={customization.about_title}
              width={800}
              height={600}
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <Image
              src="/img/Abou-bah-Consulting.webp"
              alt="Abou BAH Consulting"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
