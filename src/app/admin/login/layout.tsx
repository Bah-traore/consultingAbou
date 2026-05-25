import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion - Abou BAH Consulting",
  description: "Connectez-vous pour accéder au panneau d'administration",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ce layout isole la page de login du layout admin parent
  // Il rend directement les enfants sans la sidebar
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}