"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Presentation, Target, Award, ArrowRight } from "lucide-react";
import { API_ENDPOINTS, Service, apiGet, fixImageUrl } from "@/lib/api";
import { useCustomization } from "@/hooks/use-customization";
import Link from "next/link";

// Mapping des icônes
const iconMap: Record<string, any> = {
  BookOpen: BookOpen,
  Presentation: Presentation,
  Target: Target,
  Award: Award,
};

// Groupement par catégorie
type ServicesByCategory = {
  [key: string]: Service[];
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { customization } = useCustomization();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiGet<any>(API_ENDPOINTS.SERVICES.LIST);
        const rawServices = Array.isArray(data) ? data : data.results || [];
        const fixedServices = rawServices.map((service: Service) => ({
          ...service,
          image: service.image ? fixImageUrl(service.image) : null
        }));
        setServices(fixedServices);
      } catch (err) {
        setError("Impossible de charger les services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filtrer les services
  const filteredServices = filter === "all" 
    ? services 
    : services.filter(s => s.category === filter);

  // Grouper par catégorie
  const servicesByCategory: ServicesByCategory = filteredServices.reduce((acc, service) => {
    const category = service.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as ServicesByCategory);

  // Catégories disponibles (exclure undefined)
  const categories = Array.from(new Set(services.map(s => s.category).filter((c): c is string => !!c)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des prestations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold mb-2">Erreur</p>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 px-6 md:px-12 lg:px-24"
        style={{ backgroundColor: customization?.services_background_color || '#F8FAFC' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            style={{ color: customization?.services_title_color || '#1F2937' }}
          >
            {customization?.services_title || 'Nos Prestations'}
          </h1>
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: customization?.services_description_color || '#6B7280' }}
          >
            {customization?.services_description || 
              'Découvrez l\'ensemble de nos services conçus pour accompagner votre réussite professionnelle et pédagogique. Chaque prestation allie expertise, méthode et résultats concrets.'}
          </p>
        </div>
      </section>

      {/* Filtres par catégorie */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="lg"
            >
              Tous les services
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category || 'all')}
                size="lg"
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des services */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {Object.keys(servicesByCategory).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Aucun service trouvé pour cette catégorie.
              </p>
            </div>
          ) : (
            Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category} className="mb-16 last:mb-0">
                {/* Titre de catégorie */}
                <div className="mb-8">
                  <h2 
                    className="text-3xl font-bold capitalize mb-2"
                    style={{ color: customization?.services_title_color || '#1F2937' }}
                  >
                    {category}
                  </h2>
                  <div 
                    className="h-1 w-20 rounded-full"
                    style={{ backgroundColor: customization?.primary_color || '#1E40AF' }}
                  />
                </div>

                {/* Grille de services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryServices.map((service) => {
                    const IconComponent = iconMap[service.icon] || BookOpen;
                    
                    return (
                      <Card
                        key={service.id}
                        className="group relative overflow-hidden border-border/70 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.55)]"
                        style={{ backgroundColor: service.service_background_color || '#FFFFFF' }}
                      >
                        {/* Image du service si disponible */}
                        {service.image && (
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none'; }}
                            />
                          </div>
                        )}
                        
                        {/* Effet de gradient au hover */}
                        <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_25%_20%,hsl(var(--secondary)/0.22),transparent_60%),radial-gradient(520px_circle_at_75%_60%,hsl(var(--primary)/0.18),transparent_62%)]" />
                        </div>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
                        
                        <CardHeader>
                          <CardTitle className="flex items-start gap-3" style={{ color: service.service_title_color || '#1F2937' }}>
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-background text-primary shrink-0">
                              <IconComponent className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <span className="leading-tight">{service.title}</span>
                          </CardTitle>
                          <CardDescription 
                            className="mt-4 line-clamp-4"
                            style={{ color: service.service_description_color || '#6B7280' }}
                          >
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className="capitalize text-sm" 
                              style={{ 
                                borderColor: service.service_category_color || '#3B82F6', 
                                color: service.service_category_text_color || '#FFFFFF',
                                backgroundColor: service.service_category_color || '#3B82F6'
                              }}>
                              {service.category}
                            </Badge>
                            <Link href={`/contact?service=${service.slug}`}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="gap-2 text-primary hover:text-primary/80"
                              >
                                En savoir plus
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contactez-nous pour discuter de vos besoins spécifiques. Nous adaptons nos prestations à chaque situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="gap-2">
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}