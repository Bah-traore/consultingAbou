"use client";

import { useCustomization } from "@/hooks/use-customization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function DynamicHero() {
  const { customization, isLoading } = useCustomization();
  
  if (isLoading || !customization) {
    // Fallback pendant le chargement
    return (
      <section className="relative isolate overflow-hidden py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Bienvenue chez Abou Bah Consulting
            </h1>
            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Cabinet de consultation pédagogique spécialisé dans la formation et le coaching
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild>
                <Link href="/contact">Prendre rendez-vous</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section 
      className="relative isolate overflow-hidden py-12 sm:py-16"
      style={{ backgroundColor: customization.background_color }}
    >
      {/* Image de fond si disponible */}
      {customization.hero_background_image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={customization.hero_background_image}
            alt="Hero background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}
      
      {/* Effets de dégradé */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div 
          className="absolute -left-24 top-12 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${customization.primary_color}1A` }}
        />
        <div 
          className="absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${customization.secondary_color}0D` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" style={{ backgroundColor: (customization.hero_badge_background_color || '#F59E0B') + '20', color: customization.hero_badge_text_color || '#1F2937' }}>
              {customization.hero_badge_1_text}
            </Badge>
            <Badge variant="outline" style={{ borderColor: customization.primary_color, color: customization.hero_badge_text_color || '#1F2937' }}>
              {customization.hero_badge_2_text}
            </Badge>
          </div>

          <h1 
            className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
            style={{ color: customization.hero_title_color || '#1F2937' }}
          >
            {customization.hero_title}
          </h1>

          <p 
            className="max-w-2xl text-pretty text-base sm:text-lg"
            style={{ color: customization.hero_subtitle_color || '#6B7280' }}
          >
            {customization.hero_subtitle}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button 
              asChild 
              className="sm:min-w-[190px] hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: customization.hero_button_primary_color || '#000',
                borderColor: customization.hero_button_primary_color || '#000',
                color: customization.hero_button_primary_text_color || '#000',
                border: 'none'
              }}
            >
              <Link href={customization.hero_button_link}>
                {customization.hero_button_text}
              </Link>
            </Button>
            <Button 
              asChild
              className="sm:min-w-[190px] hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: customization.hero_button_secondary_color || '#000',
                borderColor: customization.hero_button_border_color || '#000',
                color: customization.hero_button_secondary_text_color || '#000',
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              <a href="#services">Découvrir nos services</a>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-lg border p-3" style={{ backgroundColor: customization.hero_card_background_color || '#FFFFFF', borderColor: (customization.hero_card_border_color || '#3B82F6') + '40' }}>
              <p className="text-xs" style={{ color: customization.hero_card_title_color || '#9CA3AF' }}>{customization.hero_card_1_title}</p>
              <p className="text-sm font-medium" style={{ color: customization.hero_card_value_color || '#1F2937' }}>{customization.hero_card_1_value}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ backgroundColor: customization.hero_card_background_color || '#FFFFFF', borderColor: (customization.hero_card_border_color || '#3B82F6') + '40' }}>
              <p className="text-xs" style={{ color: customization.hero_card_title_color || '#9CA3AF' }}>{customization.hero_card_2_title}</p>
              <p className="text-sm font-medium" style={{ color: customization.hero_card_value_color || '#1F2937' }}>{customization.hero_card_2_value}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ backgroundColor: customization.hero_card_background_color || '#FFFFFF', borderColor: (customization.hero_card_border_color || '#3B82F6') + '40' }}>
              <p className="text-xs" style={{ color: customization.hero_card_title_color || '#9CA3AF' }}>{customization.hero_card_3_title}</p>
              <p className="text-sm font-medium" style={{ color: customization.hero_card_value_color || '#1F2937' }}>{customization.hero_card_3_value}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div 
            className="absolute -inset-4 -z-10 rounded-[28px] blur-2xl"
            style={{ 
              background: `linear-gradient(to bottom right, ${customization.primary_color}1A, transparent, ${customization.secondary_color}0D)`
            }}
          />
          <div className="relative overflow-hidden rounded-[24px] border bg-card" style={{ backgroundColor: customization.about_card_background_color || '#FFFFFF' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-background/30" />
            {customization.hero_image ? (
              <Image
                src={customization.hero_image}
                alt="Hero image"
                width={1400}
                height={900}
                priority
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
            ) : customization.about_image ? (
              <Image
                src={customization.about_image}
                alt={customization.about_title}
                width={1400}
                height={900}
                priority
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
            ) : (
              <Image
                src="/img/Abou-bah-Consulting.webp"
                alt="Abou BAH Consulting"
                width={1400}
                height={900}
                priority
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 grid gap-2 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                {customization.hero_image_badge_icon && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-background/60">
                    <Image
                      src={customization.hero_image_badge_icon}
                      alt="Badge icon"
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </div>
                )}
                {!customization.hero_image_badge_icon && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-background/60">
                    <Image
                      src="/img/Abou%20consulting%20transparent.webp"
                      alt="Logo Abou BAH Consulting"
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium leading-tight" style={{ color: customization.about_title_color || '#1F2937' }}>{customization.hero_image_badge_text}</p>
                  <p className="text-xs" style={{ color: customization.about_description_color || '#6B7280' }}>
                    {customization.hero_image_badge_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
