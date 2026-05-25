"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageLayout } from "@/components/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  FileText, 
  Mail, 
  Calendar,
  ImageIcon,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  services: { total: number; actifs: number };
  partenaires: { total: number; actifs: number };
  temoignages: { total: number; approved: number; pending: number };
  articles: { total: number; published: number; drafts: number };
  contacts: { total: number; unread: number };
  rendezvous: { total: number; confirmed: number; pending: number };
  slides: { total: number; actifs: number };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier l'authentification
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    fetchStats(accessToken);
  }, [router]);

  const fetchStats = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/stats/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout title="Tableau de bord" subtitle="Vue d'ensemble de votre activité">
      {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 mb-0">
        {/* Services Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Services</CardTitle>
            <Briefcase className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.services.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-green-600 font-semibold">{stats?.services.actifs || 0}</span> actifs
            </p>
          </CardContent>
        </Card>

        {/* Partenaires Card */}
        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Partenaires</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.partenaires.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-green-600 font-semibold">{stats?.partenaires.actifs || 0}</span> actifs
            </p>
          </CardContent>
        </Card>

        {/* Témoignages Card */}
        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Témoignages</CardTitle>
            <MessageSquare className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.temoignages.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-orange-600 font-semibold">{stats?.temoignages.pending || 0}</span> en attente
            </p>
          </CardContent>
        </Card>

        {/* Articles Card */}
        <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Articles</CardTitle>
            <FileText className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.articles.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-green-600 font-semibold">{stats?.articles.published || 0}</span> publiés
            </p>
          </CardContent>
        </Card>

        {/* Contacts Card */}
        <Card className="border-l-4 border-l-cyan-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Contacts</CardTitle>
            <Mail className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.contacts.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-red-600 font-semibold">{stats?.contacts.unread || 0}</span> non lus
            </p>
          </CardContent>
        </Card>

        {/* Rendez-vous Card */}
        <Card className="border-l-4 border-l-pink-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Rendez-vous</CardTitle>
            <Calendar className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.rendezvous.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-green-600 font-semibold">{stats?.rendezvous.confirmed || 0}</span> confirmés
            </p>
          </CardContent>
        </Card>

        {/* Slides Card */}
        <Card className="border-l-4 border-l-indigo-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Slides</CardTitle>
            <ImageIcon className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats?.slides.total || 0}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-green-600 font-semibold">{stats?.slides.actifs || 0}</span> actifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/services">
            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Briefcase className="h-4 w-4" />
              Gérer les services
            </Button>
          </Link>
          <Link href="/admin/temoignages">
            <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md">
              <MessageSquare className="h-4 w-4" />
              Modérer témoignages
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md">
              <FileText className="h-4 w-4" />
              Créer un article
            </Button>
          </Link>
          <Link href="/admin/customization">
            <Button className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-md">
              <Activity className="h-4 w-4" />
              Personnaliser le site
            </Button>
          </Link>
        </div>
      </div>
    </AdminPageLayout>
  );
}
