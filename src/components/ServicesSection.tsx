"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Presentation, Target, Award } from "lucide-react";
import { API_ENDPOINTS, Service } from "@/lib/api";
import { useCustomization } from "@/hooks/use-customization";

// Mapping des icônes
const iconMap: Record<string, any> = {
  BookOpen: BookOpen,
  Presentation: Presentation,
  Target: Target,
  Award: Award,
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { customization } = useCustomization();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SERVICES.LIST);
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        // Limiter le nombre de services selon la configuration
        const limit = customization?.items_per_page || 20;
        setServices((data.results || []).slice(0, limit));
      } catch (err) {
        setError("Impossible de charger les services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [customization]);

  if (loading) {
    return (
      <section id="services" className="mt-10 scroll-mt-24">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="mt-10 scroll-mt-24">
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="mt-10 scroll-mt-24" style={{ backgroundColor: customization?.services_background_color || '#FFFFFF' }}>
      <div className="flex flex-col gap-3">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: customization?.services_title_color || '#1F2937' }}>
          {customization?.services_title || 'Des services conçus pour produire un vrai changement'}
        </h2>
        <p className="max-w-3xl text-pretty text-sm sm:text-base" style={{ color: customization?.services_description_color || '#6B7280' }}>
          {customization?.services_description || 'Chaque prestation combine méthode, clarté et mise en pratique. L\'objectif est simple: renforcer vos compétences et rendre vos livrables irréprochables.'}
        </p>
      </div>

      <div className="mt-6 columns-1 md:columns-2 gap-6 space-y-6">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon] || BookOpen;
          
          return (
            <Card
              key={service.id}
              className="group relative overflow-hidden border-border/70 transition duration-500 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.55)] break-inside-avoid mb-6"
              style={{ 
                backgroundColor: service.service_background_color || customization?.services_card_background_color || '#FFFFFF'
              }}
            >
              {/* Image du service si disponible */}
              {service.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              
              <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_25%_20%,hsl(var(--secondary)/0.22),transparent_60%),radial-gradient(520px_circle_at_75%_60%,hsl(var(--primary)/0.18),transparent_62%)]" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
              <CardHeader>
                <CardTitle className="flex items-start gap-3" style={{ 
                  color: service.service_title_color || customization?.services_card_title_color || '#1F2937' 
                }}>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-primary">
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>{service.title}</span>
                </CardTitle>
                <CardDescription style={{ 
                  color: service.service_description_color || customization?.services_card_description_color || '#6B7280' 
                }}>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="outline" 
                  className="capitalize"
                  style={{ 
                    backgroundColor: service.service_category_color || customization?.services_card_background_color || '#3B82F6',
                    color: service.service_category_text_color || '#FFFFFF',
                    borderColor: service.service_category_color || customization?.services_card_background_color || '#3B82F6'
                  }}
                >
                  {service.category}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
