"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { API_ENDPOINTS, apiGet, fixImageUrl } from "@/lib/api";

interface Partenaire {
  id: number;
  nom: string;
  logo: string | null;
  site_web?: string;
  description?: string;
  is_active: boolean;
  order: number;
}

// Logo SVG générique utilisé en fallback si aucun logo n'est disponible
const PlaceholderLogo = ({ name }: { name: string }) => (
  <div
    className="h-14 flex items-center justify-center px-4 rounded-lg bg-slate-100 border border-slate-200"
    title={name}
  >
    <span className="text-sm font-semibold text-slate-500 truncate max-w-[120px]">
      {name}
    </span>
  </div>
);

export default function PartnersCarousel() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        const data = await apiGet<any>(API_ENDPOINTS.PARTENAIRES.LIST);
        const list: Partenaire[] = Array.isArray(data)
          ? data
          : data.results || [];
        setPartenaires(list.filter((p) => p.is_active));
      } catch (err) {
        console.error("Erreur chargement partenaires:", err);
        setPartenaires([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPartenaires();
  }, []);

  // Pendant le chargement, ne rien afficher
  if (loading) return null;

  // Si aucun partenaire n'est configuré, ne pas afficher la section
  if (partenaires.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-4xl py-8 px-4">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        spaceBetween={30}
        loop={partenaires.length > 3}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={3500}
        allowTouchMove={true}
        className="w-full"
      >
        {partenaires.map((partenaire) => {
          const logoUrl = fixImageUrl(partenaire.logo);
          return (
            <SwiperSlide
              key={partenaire.id}
              className="flex justify-center items-center"
            >
              {partenaire.site_web ? (
                <a
                  href={partenaire.site_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partenaire.nom}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={partenaire.nom}
                      className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
                      onError={(e) => {
                        // Si l'image échoue, cacher l'img et afficher le nom
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm font-semibold text-slate-500 px-3">${partenaire.nom}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <PlaceholderLogo name={partenaire.nom} />
                  )}
                </a>
              ) : logoUrl ? (
                <img
                  src={logoUrl}
                  alt={partenaire.nom}
                  className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-sm font-semibold text-slate-500 px-3">${partenaire.nom}</span>`;
                    }
                  }}
                />
              ) : (
                <PlaceholderLogo name={partenaire.nom} />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
