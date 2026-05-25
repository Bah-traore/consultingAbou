"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminPageLayout({ children, title, subtitle }: AdminPageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    setCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/admin/login');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // Obtenir le titre de page basé sur le chemin
  const getPageTitle = () => {
    if (title) return title;
    
    const pathMap: Record<string, string> = {
      '/admin': 'Tableau de bord',
      '/admin/services': 'Gestion des Services',
      '/admin/partenaires': 'Gestion des Partenaires',
      '/admin/temoignages': 'Gestion des Témoignages',
      '/admin/articles': 'Gestion des Articles',
      '/admin/contacts': 'Gestion des Contacts',
      '/admin/rendezvous': 'Gestion des Rendez-vous',
      '/admin/slides': 'Gestion du Diaporama',
      '/admin/customization': 'Personnalisation du Site',
      '/admin/login': 'Connexion Admin',
    };
    
    return pathMap[pathname || '/admin'] || 'Administration';
  };

  const getPageSubtitle = () => {
    if (subtitle) return subtitle;
    
    const subtitleMap: Record<string, string> = {
      '/admin': 'Vue d\'ensemble de votre activité',
      '/admin/services': 'Gérez vos prestations et services',
      '/admin/partenaires': 'Gérez vos partenaires et collaborations',
      '/admin/temoignages': 'Modérez les témoignages clients',
      '/admin/articles': 'Publiez et gérez vos articles',
      '/admin/contacts': 'Consultez les messages reçus',
      '/admin/rendezvous': 'Gérez les demandes de rendez-vous',
      '/admin/slides': 'Configurez le diaporama d\'accueil',
      '/admin/customization': 'Personnalisez l\'apparence du site',
    };
    
    return subtitleMap[pathname || '/admin'] || 'Interface d\'administration';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Component */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1  min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h2>
                <p className="text-sm text-slate-500 mt-1">{getPageSubtitle()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Connecté</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
