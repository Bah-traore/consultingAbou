"use client";

import "./globals.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import InteractiveBackground from "@/components/InteractiveBackground";
import FloatingActions from "@/components/FloatingActions";
import FloatingNavMenu from "@/components/FloatingNavMenu";
import DynamicHeader from "@/components/DynamicHeader";
import Footer from "@/components/Footer";
import { useCustomization, useApplyCustomStyles } from "@/hooks/use-customization";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  const { fetchCustomization } = useCustomization();
  
  // Appliquer les styles personnalisés (seulement sur pages non-admin)
  if (!isAdminPage) {
    useApplyCustomStyles();
  }
  
  useEffect(() => {
    // Charger la personnalisation au montage du composant (seulement sur pages non-admin)
    if (!isAdminPage) {
      fetchCustomization();
    }
  }, [fetchCustomization, isAdminPage]);
  
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {/* Sur pages admin : pas de background interactif ni header/footer publics */}
        {isAdminPage ? (
          // Layout admin isolé - juste les enfants
          <div className="min-h-screen bg-slate-50">
            {children}
          </div>
        ) : (
          // Layout public normal avec tous les composants
          <InteractiveBackground>
            <div className="mx-auto flex min-h-screen w-full flex-col px-4 sm:px-6 lg:px-10">
              {/* Header dynamique - s'adapte selon la page */}
              <DynamicHeader />

              {children}

              <FloatingActions
                whatsappPhone=""
                whatsappMessage="Bonjour, je souhaite en savoir plus sur vos prestations."
                email=""
              />

              <FloatingNavMenu
                whatsappPhone="+22370000000"
                whatsappMessage="Bonjour, je souhaite en savoir plus sur vos prestations."
              />

              {/* Footer dynamique avec contacts et réseaux sociaux */}
              <Footer />
            </div>
          </InteractiveBackground>
        )}
      </body>
    </html>
  );
}
