"use client";

import { useEffect, useState } from "react";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { API_ENDPOINTS, Service, apiGet, fixImageUrl } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mapping des icônes pour l'aperçu
const iconMap: Record<string, any> = {
  BookOpen: BookOpen,
  Presentation: Presentation,
  Target: Target,
  Award: Award,
};

// Prestations statiques par défaut (fallback)
const defaultServices: Service[] = [
  {
    id: 1,
    title: "Formation Pédagogique",
    description: "Des modules de formation sur mesure pour maîtriser les outils, les concepts et les méthodes de transmission.",
    icon: "BookOpen",
    category: "formation",
    slug: "formation",
    is_active: true,
    order: 1,
    service_background_color: "#FFFFFF",
    service_title_color: "#1F2937",
    service_description_color: "#6B7280",
    service_category_color: "#3B82F6",
    service_category_text_color: "#FFFFFF"
  },
  {
    id: 2,
    title: "Coaching Personnalisé",
    description: "Un accompagnement individuel pour franchir les étapes clés de votre parcours académique et professionnel.",
    icon: "Target",
    category: "coaching",
    slug: "coaching",
    is_active: true,
    order: 2,
    service_background_color: "#FFFFFF",
    service_title_color: "#1F2937",
    service_description_color: "#6B7280",
    service_category_color: "#8B5CF6",
    service_category_text_color: "#FFFFFF"
  },
  {
    id: 3,
    title: "Accompagnement Écrit & Oral",
    description: "Méthodologie rigoureuse pour structurer vos mémoires, rapports de stage et préparer vos soutenances.",
    icon: "Presentation",
    category: "accompagnement",
    slug: "accompagnement",
    is_active: true,
    order: 3,
    service_background_color: "#FFFFFF",
    service_title_color: "#1F2937",
    service_description_color: "#6B7280",
    service_category_color: "#10B981",
    service_category_text_color: "#FFFFFF"
  },
  {
    id: 4,
    title: "Préparation aux Concours",
    description: "Entraînements intensifs, simulations d'oraux et révisions ciblées pour réussir vos concours de l'enseignement.",
    icon: "Award",
    category: "preparation",
    slug: "preparation",
    is_active: true,
    order: 4,
    service_background_color: "#FFFFFF",
    service_title_color: "#1F2937",
    service_description_color: "#6B7280",
    service_category_color: "#F59E0B",
    service_category_text_color: "#FFFFFF"
  }
];

export default function Home() {
  const { customization } = useCustomization();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiGet<any>(API_ENDPOINTS.SERVICES.LIST);
        const rawServices = Array.isArray(data) ? data : data.results || [];
        const fixedServices = rawServices.map((service: Service) => ({
          ...service,
          image: service.image ? fixImageUrl(service.image) : null
        }));
        // Filtre les services actifs
        setServices(fixedServices.filter((s: Service) => s.is_active !== false));
      } catch (err) {
        console.error("Erreur de chargement des services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <main className="flex-1">
      {/* Diaporama dynamique - configurable depuis l'admin */}
      <DynamicSlideshow />
      
      {/* Section Hero - 100% dynamique */}
      <DynamicHero />
      
      {/* Section Services - Aperçu dynamique avec carrousel infini */}
      <section 
        id="services" 
        className="py-20 overflow-hidden scroll-mt-24"
        style={{ backgroundColor: customization?.services_background_color || '#FFFFFF' }}
      >
        <div className="w-full">
          {/* En-tête de section centré */}
          <div className="max-w-7xl mx-auto text-center mb-12 px-6">
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

          {/* Inject dynamic stylesheet for perfectly linear marquee scrolling */}
          <style dangerouslySetInnerHTML={{ __html: `
            .services-marquee .swiper-wrapper {
              transition-timing-function: linear !important;
            }
          `}} />

          {/* Carrousel infini (Marquee) x vers -x */}
          <div className="w-full mb-12">
            {loading ? (
              <div className="w-full flex gap-6 overflow-hidden py-4 px-6 justify-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[340px] h-[260px] shrink-0 rounded-xl border bg-card p-6 flex flex-col justify-between animate-pulse">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="h-12 w-12 rounded-xl bg-muted" />
                        <div className="h-6 w-20 rounded-full bg-muted" />
                      </div>
                      <div className="h-6 w-2/3 rounded bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-5/6 rounded bg-muted" />
                      </div>
                    </div>
                    <div className="h-4 w-1/3 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                modules={[Autoplay]}
                slidesPerView="auto"
                spaceBetween={24}
                loop={displayServices.length > 2}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                speed={8000}
                allowTouchMove={true}
                className="w-full py-4 services-marquee"
              >
                {displayServices.map((service) => {
                  const IconComponent = iconMap[service.icon] || BookOpen;
                  return (
                    <SwiperSlide key={service.id} style={{ width: '340px' }} className="flex">
                      <Link href={`/contact?service=${service.slug}`} className="w-full">
                        <Card
                          className="group relative overflow-hidden border border-border/70 bg-card p-6 h-[260px] flex flex-col justify-between rounded-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full"
                          style={{
                            backgroundColor: service.service_background_color || customization?.services_card_background_color || '#FFFFFF',
                          }}
                        >
                          {/* Glowing Radial Gradient on Hover */}
                          <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100">
                            <div 
                              className="absolute inset-0 bg-[radial-gradient(350px_circle_at_50%_50%,rgba(59,130,246,0.08),transparent_60%)]" 
                              style={{
                                backgroundImage: `radial-gradient(350px_circle_at_50%_50%, ${service.service_category_color || '#3B82F6'}15, transparent 60%)`
                              }}
                            />
                          </div>

                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                              <span 
                                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-background text-primary transition-all duration-300 group-hover:scale-110"
                                style={{ borderColor: customization?.primary_color || '#E5E7EB' }}
                              >
                                <IconComponent className="h-6 w-6 text-primary" style={{ color: customization?.primary_color || '#3B82F6' }} />
                              </span>
                              
                              <Badge 
                                variant="outline" 
                                className="capitalize px-3 py-1 font-medium text-xs rounded-full border-none shadow-sm"
                                style={{ 
                                  backgroundColor: service.service_category_color || '#3B82F6',
                                  color: service.service_category_text_color || '#FFFFFF'
                                }}
                              >
                                {service.category || 'Prestation'}
                              </Badge>
                            </div>

                            <h3 
                              className="font-bold text-lg leading-snug line-clamp-2 mt-2 transition-colors duration-300 group-hover:text-primary"
                              style={{ 
                                color: service.service_title_color || customization?.services_card_title_color || '#1F2937'
                              }}
                            >
                              {service.title}
                            </h3>
                            
                            <p 
                              className="text-sm line-clamp-3 text-muted-foreground"
                              style={{ 
                                color: service.service_description_color || customization?.services_card_description_color || '#6B7280'
                              }}
                            >
                              {service.description}
                            </p>
                          </div>

                          <div className="flex items-center text-sm font-semibold text-primary mt-4 gap-1 group-hover:gap-2 transition-all duration-300" style={{ color: customization?.primary_color || '#1E40AF' }}>
                            Réserver ce service
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Card>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>

          {/* CTA vers page complète centré */}
          <div className="max-w-7xl mx-auto text-center px-6">
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
