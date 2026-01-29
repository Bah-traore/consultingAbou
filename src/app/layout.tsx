import "./globals.css";
import Image from "next/image";
import Link from "next/link";

import InteractiveBackground from "@/components/InteractiveBackground";
import FloatingActions from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <InteractiveBackground>
          <div className="mx-auto flex min-h-screen w-full flex-col px-4 sm:px-6 lg:px-10">
          <header className="sticky top-0 z-40 -mx-4 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between">
              <Link href="#" className="flex items-center gap-3">
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
                  <p className="text-sm font-semibold">Abou BAH</p>
                  <p className="text-xs text-muted-foreground">Consulting</p>
                </div>
              </Link>

              <nav className="hidden items-center gap-6 text-sm md:flex">
                <a href="#services" className="text-muted-foreground hover:text-foreground">
                  Services
                </a>
                <a href="#methode" className="text-muted-foreground hover:text-foreground">
                  Méthode
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </nav>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="hidden sm:inline-flex">
                  <a href="#services">Découvrir</a>
                </Button>
                <Button asChild>
                  <a href="#contact">Prendre rendez-vous</a>
                </Button>
              </div>
            </div>
          </header>

          {children}

          <FloatingActions
            whatsappPhone=""
            whatsappMessage="Bonjour, je souhaite en savoir plus sur vos prestations."
            email=""
          />

          <footer className="mt-16 border-t py-8 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Abou BAH Consulting. Tous droits réservés.
          </footer>
          </div>
        </InteractiveBackground>
      </body>
    </html>
  );
}
