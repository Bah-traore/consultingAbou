"use client";

import DynamicSlideshow from "@/components/DynamicSlideshow";
import DynamicHero from "@/components/DynamicHero";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Presentation, Target, Award } from "lucide-react";
import Link from "next/link";
import DynamicAboutSection from "@/components/DynamicAboutSection";
import DynamicTestimonialsSection from "@/components/DynamicTestimonialsSection";
import DynamicBlogSection from "@/components/DynamicBlogSection";
import DynamicPartnersSection from "@/components/DynamicPartnersSection";
import { useCustomization } from "@/hooks/use-customization";

// Mapping des icônes pour l'aperçu
const iconMap: Record<string, any> = {
  BookOpen: BookOpen,
  Presentation: Presentation,
  Target: Target,
  Award: Award,
};

export default function Home() {
  const { customization } = useCustomization();

  return (
    <main className="flex-1">
      {/* Diaporama dynamique - configurable depuis l'admin */}
      <DynamicSlideshow />
      
      {/* Section Hero - 100% dynamique */}
      <DynamicHero />
      
      {/* Section Services - Aperçu simplifié avec lien vers page dédiée */}
      <section 
        id="services" 
        className="py-20 px-6 md:px-12 lg:px-24 scroll-mt-24"
        style={{ backgroundColor: customization?.services_background_color || '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* En-tête de section */}
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ color: customization?.services_title_color || '#1F2937' }}
            >
              {customization?.services_title || 'Nos Prestations'}
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: customization?.services_description_color || '#6B7280' }}
            >
              {customization?.services_description || 
                'Des services conçus pour produire un vrai changement. Chaque prestation combine méthode, clarté et mise en pratique.'}
            </p>
          </div>

          {/* Aperçu des catégories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { category: 'formation', icon: BookOpen, label: 'Formation' },
              { category: 'coaching', icon: Target, label: 'Coaching' },
              { category: 'accompagnement', icon: Presentation, label: 'Accompagnement' },
              { category: 'preparation', icon: Award, label: 'Préparation concours' },
            ].map(({ category, icon: Icon, label }) => (
              <div 
                key={category}
                className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ 
                  backgroundColor: customization?.services_card_background_color || '#FFFFFF',
                  borderColor: customization?.primary_color || '#E5E7EB'
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 
                    className="font-semibold text-lg capitalize"
                    style={{ color: customization?.services_card_title_color || '#1F2937' }}
                  >
                    {label}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* CTA vers page complète */}
          <div className="text-center">
            <Link href="/services">
              <Button size="lg" className="gap-2">
                Voir toutes nos prestations
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Section À propos - S'affiche seulement si activé dans l'admin */}
      <DynamicAboutSection />
      
      {/* Section Témoignages - S'affiche seulement si activé dans l'admin */}
      <DynamicTestimonialsSection />
      
      {/* Section Blog - S'affiche seulement si activé dans l'admin */}
      <DynamicBlogSection />
      
      {/* Section Partenaires - S'affiche seulement si activé dans l'admin */}
      <DynamicPartnersSection />
    </main>
  );
}
