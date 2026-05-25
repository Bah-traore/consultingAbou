import { Metadata } from "next";
import { AdminSidebar } from '@/components/AdminSidebar';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, API_ENDPOINTS } from "@/lib/api";

export const metadata: Metadata = {
  title: "Administration - Abou BAH Consulting",
  description: "Interface d'administration",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/admin/login');
        setLoading(false);
        return;
      }

      try {
        // Vérifier que le token est valide en appelant un endpoint protégé
        const response = await apiGet(API_ENDPOINTS.DASHBOARD.STATS, { requireAuth: true });
        setAuthenticated(true);
      } catch (error) {
        // Token invalide ou expiré
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Redirection déjà gérée dans l'effet
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="">
        {children}
      </div>
    </div>
  );
}