"use client";

import { useCustomization } from "@/hooks/use-customization";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import DynamicCTASection from "./DynamicCTASection";

export default function Footer() {
  const { customization } = useCustomization();
  
  if (!customization) return null;
  
  const socialLinks = [
    { url: customization.facebook_url, icon: Facebook, label: "Facebook" },
    { url: customization.twitter_url, icon: Twitter, label: "Twitter" },
    { url: customization.linkedin_url, icon: Linkedin, label: "LinkedIn" },
    { url: customization.instagram_url, icon: Instagram, label: "Instagram" },
    { url: customization.youtube_url, icon: Youtube, label: "YouTube" },
  ].filter(link => link.url);

  return (
    <footer 
      className="mt-16 py-8"
      style={{ 
        backgroundColor: customization?.primary_color || '#fff',
        borderTop: `9px solid ${customization?.secondary_color || '#fff'}`,
        color: customization?.text_color || '#FFFFFF'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section CTA intégrée dans le footer */}
        <DynamicCTASection />
        
        <div className="grid gap-8 md:grid-cols-3 mt-8">
          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold" style={{ color: customization?.text_color || '#FFFFFF' }}>
              Contact
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: customization?.text_color || '#FFFFFF' }} />
                <a href={`mailto:${customization.contact_email}`} className="hover:opacity-80 transition-opacity" style={{ color: customization?.text_color || '#FFFFFF' }}>
                  {customization.contact_email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: customization?.text_color || '#FFFFFF' }} />
                <a href={`tel:${customization.contact_phone}`} className="hover:opacity-80 transition-opacity" style={{ color: customization?.text_color || '#FFFFFF' }}>
                  {customization.contact_phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: customization?.text_color || '#FFFFFF' }} />
                <span style={{ color: customization?.text_color || '#FFFFFF' }}>{customization.contact_address}</span>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          {socialLinks.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold" style={{ color: customization?.text_color || '#FFFFFF' }}>
                Suivez-nous
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: customization?.text_color || '#FFFFFF' }}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Copyright */}
          <div>
            <p className="text-sm" style={{ color: customization?.text_color || '#FFFFFF' }}>
              © {new Date().getFullYear()} Abou BAH Consulting. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}