"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { API_ENDPOINTS, Temoignage, apiGet } from "@/lib/api";
import { useCustomization } from "@/hooks/use-customization";
import Image from "next/image";

export default function DynamicTestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const { customization, isLoading: isCustomizationLoading } = useCustomization();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await apiGet<any>(API_ENDPOINTS.TEMOIGNAGES.LIST);
         setTestimonials(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Ne rien afficher si la section est explicitement désactivée ou en chargement
  // Permettre l'affichage pendant le chargement initial (customization === null)
  if (customization && !customization.show_testimonials_section) {
    return null;
  }
  
  if (loading || testimonials.length === 0) {
    return null;
  }

  const defaultTitle = "Ce que disent nos clients";
  const defaultDescription = "Découvrez les retours d'expérience de ceux qui nous ont fait confiance.";

  // Fallback si customization n'est pas encore chargé (SSR/hydratation)
  if (!customization) {
    return (
      <section className="mt-12">
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {defaultTitle}
          </h2>
          <p className="max-w-3xl text-pretty text-sm sm:text-base text-muted-foreground">
            {defaultDescription}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20" />
                  <div>
                    <p className="font-medium">{testimonial.first_name} {testimonial.last_name}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-muted-foreground">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl" 
            style={{ color: customization.text_color }}>
          {customization.testimonials_title || 'Ce que disent nos clients'}
        </h2>
        <p className="max-w-3xl text-pretty text-sm sm:text-base"
           style={{ color: customization.text_color + 'CC' }}>
          {customization.testimonials_description || 'Découvrez les retours d\'expérience de ceux qui nous ont fait confiance.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card 
            key={testimonial.id}
            className="transition-all hover:shadow-lg"
            style={{ borderColor: customization.primary_color + '40' }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                {testimonial.photo ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2"
                       style={{ borderColor: customization.primary_color }}>
                    <Image
                      src={testimonial.photo}
                      alt={`${testimonial.first_name} ${testimonial.last_name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    style={{ backgroundColor: customization.primary_color }}
                  >
                    {testimonial.first_name[0]}{testimonial.last_name[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium" style={{ color: customization.text_color }}>
                    {testimonial.first_name} {testimonial.last_name}
                  </p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? 'fill-current' : ''
                        }`}
                        style={{ 
                          color: i < testimonial.rating ? customization.accent_color : '#D1D5DB'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic" style={{ color: customization.text_color + 'CC' }}>
                "{testimonial.comment}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
