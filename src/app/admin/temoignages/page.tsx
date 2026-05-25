"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2,
  Star,
  Loader2,
  MessageSquare
} from "lucide-react";
import Image from "next/image";

interface Temoignage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at: string;
}

export default function AdminTemoignages() {
  const router = useRouter();
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    fetchTemoignages(accessToken);
  }, [router]);

  const fetchTemoignages = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/temoignages/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      setTemoignages(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/temoignages/${id}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de l\'approbation');

      fetchTemoignages(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter ce témoignage ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/temoignages/${id}/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors du rejet');

      fetchTemoignages(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce témoignage ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/temoignages/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchTemoignages(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const toggleFeatured = async (temoignage: Temoignage) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/temoignages/${temoignage.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_featured: !temoignage.is_featured }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      fetchTemoignages(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const filteredTemoignages = temoignages.filter(t => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return t.status === 'pending';
    if (activeTab === "approved") return t.status === 'approved';
    if (activeTab === "rejected") return t.status === 'rejected';
    return true;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Approuvé</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Eye className="h-3 w-3" /> En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejeté</Badge>;
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
          <h2 className="text-2xl font-bold">Gestion des Témoignages</h2>
          <Badge variant="outline">
            {temoignages.length} témoignage{temoignages.length !== 1 && 's'}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{temoignages.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {temoignages.filter(t => t.status === 'approved').length}
              </div>
              <p className="text-sm text-muted-foreground">Approuvés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {temoignages.filter(t => t.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {temoignages.filter(t => t.status === 'rejected').length}
              </div>
              <p className="text-sm text-muted-foreground">Rejetés</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvés</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredTemoignages.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun témoignage trouvé</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTemoignages.map((temoignage) => (
                  <Card key={temoignage.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {/* Photo ou initiales */}
                        <div className="shrink-0">
                          {temoignage.photo ? (
                            <div className="relative h-16 w-16 rounded-full overflow-hidden">
                              <Image
                                src={temoignage.photo}
                                alt={`${temoignage.first_name} ${temoignage.last_name}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xl font-bold text-primary">
                                {temoignage.first_name[0]}{temoignage.last_name[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {temoignage.first_name} {temoignage.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{temoignage.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(temoignage.status)}
                              {temoignage.is_featured && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  ⭐ En vedette
                                </Badge>
                              )}
                            </div>
                          </div>

                          {renderStars(temoignage.rating)}

                          <p className="text-sm leading-relaxed">{temoignage.comment}</p>

                          <div className="flex items-center gap-2 pt-2">
                            {temoignage.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(temoignage.id)}
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approuver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(temoignage.id)}
                                  className="gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Rejeter
                                </Button>
                              </>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFeatured(temoignage)}
                              className="gap-2"
                            >
                              <Star className={`h-4 w-4 ${temoignage.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              {temoignage.is_featured ? 'Retirer vedette' : 'Mettre en vedette'}
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(temoignage.id)}
                              className="gap-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
