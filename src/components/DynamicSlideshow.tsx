"use client";

import { useEffect, useState } from "react";
import { useSwiperSlide } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { API_ENDPOINTS, apiGet, fixImageUrl } from "@/lib/api";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  // Configuration globale du diaporama
  slideshow_autoplay_delay?: number;
  slideshow_title_color?: string;
  slideshow_subtitle_color?: string;
  slideshow_overlay_color?: string;
  slideshow_background_color?: string;
  slideshow_colors?: Record<string, string>;
  overlay_opacity?: number;
  title_position?: string;
  image_fit?: string;
  // Personnalisation visuelle par slide
  slide_background_color?: string;
  slide_title_color?: string;
  slide_subtitle_color?: string;
  slide_overlay_color?: string;
  slide_content_background_color?: string;
  slide_content_border_color?: string;
  slide_content_border_radius?: number;
  slide_content_padding?: number;
  slide_show_border?: boolean;
  // Champs de dispositif de texte additionnels
  slide_content_text?: string;
  slide_badge_text?: string;
  slide_badge_color?: string;
  slide_button_text?: string;
  slide_button_link?: string;
  slide_button_color?: string;
  slide_button_text_color?: string;
}

export default function DynamicSlideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await apiGet<any>(API_ENDPOINTS.SLIDES.LIST);
        const slideArray = Array.isArray(data) ? data : data.results || [];
        const fixedSlides = slideArray.map((slide: Slide) => ({
          ...slide,
          image: slide.image ? fixImageUrl(slide.image) : null
        }));
        setSlides(fixedSlides);
      } catch (err) {
        console.error("Erreur lors du chargement des slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Si en chargement ou aucun slide
  if (loading || slides.length === 0) {
    return null;
  }

  // Récupérer la configuration du diaporama depuis le premier slide actif
  const firstActiveSlide = slides.find(s => s.is_active);
  const autoplayDelay = firstActiveSlide?.slideshow_autoplay_delay || 3500;
  
  // Couleurs globales du diaporama (utilisées comme valeurs par défaut pour tous les slides)
  const slideshowGlobalColors = {
    title_color: firstActiveSlide?.slideshow_title_color || '#FFFFFF',
    subtitle_color: firstActiveSlide?.slideshow_subtitle_color || '#FFFFFF',
    overlay_color: firstActiveSlide?.slideshow_overlay_color || 'rgba(0, 0, 0, 0.7)',
    background_color: firstActiveSlide?.slideshow_background_color || 'rgba(0, 0, 0, 0.4)',
    ...((firstActiveSlide?.slideshow_colors as any) || {})
  };

  return (
    <div className="w-full max-w-[2568px] mx-auto h-[350px] md:h-[500px] lg:h-[700px] rounded-xl overflow-hidden shadow-lg mb-8">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        speed={1200}
        loop
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {slides.filter(s => s.is_active).map((slide) => (
          <SwiperSlide key={slide.id}>
            <SlideContent slide={slide} globalColors={slideshowGlobalColors} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SlideContent({ slide, globalColors }: { slide: Slide; globalColors: any }) {
  const swiperSlide = useSwiperSlide();
  
  // Masquer le contenu si la slide n'est pas active
  if (!swiperSlide.isActive) return null;
  
  // Configuration de l'opacité (paramètre individuel du slide)
  const overlayOpacity = slide.overlay_opacity ?? 0.70;
  
  // Configuration de la position du titre (paramètre individuel du slide)
  const position = slide.title_position || 'center';
  
  // Mapping des positions avec classes Tailwind appropriées
  // Pour flex-col: justify-* = vertical (y), items-* = horizontal (x)
  // self-* force l'alignement du contenu dans le flex container
  const positionClasses: Record<string, string> = {
    'top-left': 'top-0 left-0 right-0 justify-start items-start self-start',
    'top-center': 'top-0 left-0 right-0 justify-start items-center',
    'top-right': 'top-0 left-0 right-0 justify-start items-end self-end',
    'center-left': 'top-0 bottom-0 left-0 right-0 justify-center items-start self-start',
    'center': 'top-0 bottom-0 left-0 right-0 justify-center items-center',
    'center-right': 'top-0 bottom-0 left-0 right-0 justify-center items-end self-end',
    'bottom-left': 'bottom-0 left-0 right-0 justify-end items-start self-start',
    'bottom-center': 'bottom-0 left-0 right-0 justify-end items-center',
    'bottom-right': 'bottom-0 left-0 right-0 justify-end items-end self-end',
  };
  
  // Mapping de l'alignement du texte selon la position
  const textAlignMap: Record<string, string> = {
    'top-left': 'text-left',
    'top-center': 'text-center',
    'top-right': 'text-right',
    'center-left': 'text-left',
    'center': 'text-center',
    'center-right': 'text-right',
    'bottom-left': 'text-left',
    'bottom-center': 'text-center',
    'bottom-right': 'text-right',
  };
  
  // Configuration du mode d'affichage de l'image (paramètre individuel du slide)
  const imageFit = slide.image_fit || 'contain';
  const objectFitMap: Record<string, string> = {
    'contain': 'contain',
    'cover': 'cover',
    'fill': 'fill',
  };
  
  // Couleurs du slide - priorité aux champs individuels du slide, puis aux couleurs globales
  const titleColor = slide.slide_title_color || globalColors?.title_color || '#FFFFFF';
  const subtitleColor = slide.slide_subtitle_color || globalColors?.subtitle_color || '#E5E7EB';
  const overlayColor = slide.slide_overlay_color || globalColors?.overlay_color || 'rgba(0, 0, 0, 0.6)';
  const contentBackgroundColor = slide.slide_content_background_color || globalColors?.background_color || 'rgba(0, 0, 0, 0.4)';
  const borderColor = slide.slide_content_border_color || '#3B82F6';
  const borderRadius = slide.slide_content_border_radius ?? 16;
  const padding = slide.slide_content_padding ?? 24;
  const showBorder = slide.slide_show_border || false;
  const bgColor = slide.slide_background_color || '#1E3A8A';
  
  // Nouvelles couleurs pour badge et bouton
  const badgeColor = slide.slide_badge_color || '#3B82F6';
  const buttonText = slide.slide_button_text || '';
  const buttonLink = slide.slide_button_link || '';
  const buttonColor = slide.slide_button_color || '#1E40AF';
  const buttonTextColor = slide.slide_button_text_color || '#FFFFFF';
  
  // Convertir rgba en style pour background
  const parseRgbaColor = (color: string) => {
    if (color.startsWith('rgba') || color.startsWith('rgb')) {
      return color;
    }
    // Si c'est une couleur hex, on retourne telle quelle pour CSS
    return color;
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Image de fond ou couleur de fond */}
      {slide.image ? (
        <div
          className="absolute inset-0 bg-center"
          style={{ 
            backgroundImage: `url(${slide.image})`,
            backgroundSize: objectFitMap[imageFit] || 'contain',
            backgroundRepeat: 'no-repeat',
          }}
          onError={(e) => {
            const target = e.currentTarget;
            if (target && target.style) {
              target.style.backgroundImage = `url('/fallback-slide.jpg')`;
              target.title = 'Image non disponible';
            }
          }}
        />
      ) : (
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: bgColor }} 
        />
      )}
      {/* Overlay sombre */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: overlayColor }} 
      />
      
      {/* Contenu positionné */}
      <div 
        className={`absolute z-20 flex flex-col p-4 md:p-6 ${positionClasses[position] || positionClasses['center']}`}
      >
        <div 
          className="backdrop-blur-sm w-full max-w-[90vw] md:max-w-3xl break-words overflow-hidden"
          style={{ 
            backgroundColor: contentBackgroundColor,
            borderRadius: `${borderRadius}px`,
            padding: `${padding}px`,
            ...(showBorder ? { borderWidth: '2px', borderStyle: 'solid', borderColor } : {}),
          }}
        >
          {/* Badge optionnel */}
          {slide.slide_badge_text && (
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ backgroundColor: badgeColor, color: '#FFFFFF' }}
            >
              {slide.slide_badge_text}
            </span>
          )}
          
          <h2 
            className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg break-words ${textAlignMap[position] || 'text-center'}`} 
            style={{ color: titleColor }}
          >
            {slide.title}
          </h2>
          <p 
            className={`text-base md:text-lg lg:text-2xl drop-shadow break-words leading-relaxed ${textAlignMap[position] || 'text-center'}`} 
            style={{ color: subtitleColor }}
          >
            {slide.subtitle}
          </p>
          
          {/* Texte de contenu optionnel */}
          {slide.slide_content_text && (
            <p 
              className={`text-sm md:text-base mt-3 drop-shadow break-words leading-relaxed ${textAlignMap[position] || 'text-center'}`} 
              style={{ color: subtitleColor, opacity: 0.9 }}
            >
              {slide.slide_content_text}
            </p>
          )}
          
          {/* Bouton optionnel */}
          {buttonText && (
            <div className={`mt-4 ${textAlignMap[position] || 'text-center'}`}>
              {buttonLink ? (
                <a
                  href={buttonLink}
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {buttonText} →
                </a>
              ) : (
                <button
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                >
                  {buttonText} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}