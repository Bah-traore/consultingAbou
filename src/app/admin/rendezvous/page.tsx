"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  Mail,
  Phone,
  User,
  FileText
} from "lucide-react";

interface RendezVous {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  type_rdv: string;
  date_souhaitee: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export default function AdminRendezvous() {
  const router = useRouter();
  const [rendezvous, setRendezvous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    fetchRendezvous(accessToken);
  }, [router]);

  const fetchRendezvous = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/rendezvous/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      setRendezvous(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/rendezvous/${id}/confirm/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la confirmation');

      fetchRendezvous(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/rendezvous/${id}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de l\'annulation');

      fetchRendezvous(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/rendezvous/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchRendezvous(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const filteredRendezvous = rendezvous.filter(rdv => {
    const matchesSearch = 
      rdv.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.type_rdv.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && rdv.status === 'pending';
    if (activeTab === "confirmed") return matchesSearch && rdv.status === 'confirmed';
    if (activeTab === "cancelled") return matchesSearch && rdv.status === 'cancelled';
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Confirmé</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gestion des Rendez-vous</h2>
          <Badge variant="outline">
            {rendezvous.length} rendez-vous
          </Badge>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{rendezvous.length}</div>
              <p className="text-sm text-muted-foreground">Total RDV</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {rendezvous.filter(r => r.status === 'confirmed').length}
              </div>
              <p className="text-sm text-muted-foreground">Confirmés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {rendezvous.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Tabs */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmés</TabsTrigger>
                <TabsTrigger value="cancelled">Annulés</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* RDV List */}
        <div className="space-y-4">
          {filteredRendezvous.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun rendez-vous trouvé</p>
              </CardContent>
            </Card>
          ) : (
            filteredRendezvous.map((rdv) => (
              <Card key={rdv.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Info RDV */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">
                          {rdv.first_name} {rdv.last_name}
                        </h3>
                        {getStatusBadge(rdv.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${rdv.email}`} className="text-blue-600 hover:underline">
                            {rdv.email}
                          </a>
                        </div>
                        {rdv.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${rdv.phone}`} className="hover:underline">
                              {rdv.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="capitalize">{formatDate(rdv.date_souhaitee)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <Badge variant="outline" className="capitalize">
                            {rdv.type_rdv}
                          </Badge>
                        </div>
                      </div>

                      {rdv.message && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm leading-relaxed">{rdv.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {rdv.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleConfirm(rdv.id)}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(rdv.id)}
                            className="gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Annuler
                          </Button>
                        </>
                      )}

                      <a 
                        href={`mailto:${rdv.email}?subject=Confirmation RDV - ${rdv.type_rdv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="gap-2 w-full">
                          <Mail className="h-4 w-4" />
                          Contacter
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rdv.id)}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
