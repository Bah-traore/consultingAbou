"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCustomization } from "@/hooks/use-customization";

export default function DynamicHeader() {
  const pathname = usePathname();
  const { customization } = useCustomization();
  
  const isHomePage = pathname === '/';
  
  // Navigation links - différents selon la page
  const navLinks = isHomePage ? [
    { href: '/services', label: 'Prestations', external: true },
    { href: '/blog', label: 'Blog', external: true },
    { href: '/contact', label: 'Contact', external: true },
  ] : [
    { href: '/', label: 'Accueil', external: true },
    { href: '/services', label: 'Prestations', external: true },
    { href: '/blog', label: 'Blog', external: true },
    { href: '/contact', label: 'Contact', external: true },
  ];

  return (
    <header 
      className="sticky top-0 z-40 -mx-0 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ 
        backgroundColor: customization?.primary_color || '#fff',
        borderBottom: `9px solid ${customization?.secondary_color || '#fff'}`
      }}
    >
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-md border bg-background">
            <Image
              src="/img/Abou%20consulting%20transparent.webp"
              alt="Abou BAH Consulting"
              fill
              sizes="36px"
              className="object-contain p-1"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold" style={{ color: customization?.text_color || '#FFFFFF' }}>
              Abou BAH
            </p>
            <p className="text-xs" style={{ color: customization?.text_color || '#FFFFFF', opacity: 0.9 }}>
              Consulting
            </p>
          </div>
        </Link>
        {/* Navigation */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            link.external ? (
              <Link 
                key={link.href}
                href={link.href}
                className="transition-colors hover:opacity-80"
                style={{ 
                  color: pathname === link.href ? customization?.secondary_color : (customization?.text_color || '#FFFFFF')
                }}
              >
                {link.label}
              </Link>
            ) : (
              <a 
                key={link.href}
                href={link.href}
                className="transition-colors hover:opacity-80"
                style={{ 
                  color: customization?.text_color || '#FFFFFF'
                }}
              >
                {link.label}
              </a>
            )
          ))}
        </nav>
        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          {isHomePage ? (
            <>
              <Button 
                asChild 
                variant="outline" 
                className="hidden sm:inline-flex"
                style={{ 
                  borderColor: customization?.secondary_color || '#8B5CF6',
                  color: customization?.primary_color || '#3B82F6',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <a href="#services">Découvrir</a>
              </Button>
              <Button 
                asChild
                style={{ 
                  backgroundColor: customization?.secondary_color || '#8B5CF6',
                  borderColor: customization?.secondary_color || '#8B5CF6',
                  color: '#FFFFFF'
                }}
              >
                <Link href="/contact">Prendre rendez-vous</Link>
              </Button>
            </>
          ) : (
            <Button 
              asChild
              style={{ 
                backgroundColor: customization?.secondary_color || '#8B5CF6',
                borderColor: customization?.secondary_color || '#8B5CF6',
                color: '#FFFFFF'
              }}
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
