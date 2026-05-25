"use client";

import { useCustomization } from "@/hooks/use-customization";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import Link from "next/link";

export default function DynamicCTASection() {
  const { customization, isLoading } = useCustomization();
  const contactRef = useRef<HTMLDivElement | null>(null);
  const contactInView = useInView(contactRef, { rootMargin: "0px 0px -15% 0px" });
  
  // Ne rien afficher si la section est explicitement désactivée
  if (customization && !customization.show_cta_section) {
    return null;
  }
  
  // Fallback si customization n'est pas encore chargé (SSR/hydratation)
  if (!customization) {
    return (
      <section id="contact" className="mt-12 scroll-mt-24 pb-2">
        <Card
          ref={contactRef}
          className="relative overflow-hidden transition duration-500 will-change-transform will-change-opacity translate-y-0 opacity-100"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <CardHeader>
            <CardTitle>Prêt à passer à l'action ?</CardTitle>
            <CardDescription>
              Dites-nous votre besoin, nous vous proposons un accompagnement clair et adapté.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Formation • Coaching • Mise en page • Soutenance • Concours
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                <Button asChild className="sm:min-w-[180px]">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
                <Button asChild variant="outline" className="sm:min-w-[180px]">
                  <a href="#services">Voir les prestations</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  return (
    <section id="contact" className="mt-12 scroll-mt-24 pb-2">
      <Card
        ref={contactRef}
        className={`relative overflow-hidden transition duration-500 will-change-transform will-change-opacity ${
          contactInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ 
          borderColor: customization.primary_color + '40',
          backgroundColor: customization.cta_background_color || customization.background_color
        }}
      >
        <div 
          className="pointer-events-none absolute inset-0"
          style={{ 
            background: `linear-gradient(to right, ${customization.primary_color}0D, transparent, ${customization.secondary_color}0D)`
          }}
        />
        <CardHeader>
          <CardTitle style={{ color: customization.cta_title_color || customization.text_color }}>
            {customization.cta_title || 'Prêt à passer à l\'action ?'}
          </CardTitle>
          <CardDescription style={{ color: customization.cta_description_color || (customization.text_color + 'CC') }}>
            {customization.cta_description || 'Dites-nous votre besoin, nous vous proposons un accompagnement clair et adapté.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm" style={{ color: customization.text_color + '99' }}>
              Formation • Coaching • Mise en page • Soutenance • Concours
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
              <Button 
                asChild
                className="sm:min-w-[180px]"
                style={{ 
                  backgroundColor: customization.cta_button_primary_color || customization.primary_color,
                  borderColor: customization.cta_button_primary_color || customization.primary_color,
                  color: customization.cta_button_text_color || '#FFFFFF'
                }}
              >
                <Link href="/contact">{customization.cta_button_text || 'Nous contacter'}</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="sm:min-w-[180px]"
                style={{ 
                  borderColor: customization.primary_color, 
                  color: customization.primary_color 
                }}
              >
                <a href="#services">Voir les prestations</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}