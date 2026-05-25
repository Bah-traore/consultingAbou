'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Loader2,
  Globe,
  Upload,
  XCircle
} from "lucide-react";
import Image from "next/image";
import { AdminSidebar } from '@/components/AdminSidebar';
import { fixImageUrl } from "@/lib/api";


interface Partenaire {
  id: number;
  name: string;
  logo: string | null;
  website: string;
  description: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminPartenaires() {
  const router = useRouter();
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartenaire, setEditingPartenaire] = useState<Partenaire | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    logo: null as File | null,
    logoPreview: null as string | null,
    is_active: true,
    order: 0,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }

    setToken(accessToken);
    fetchPartenaires(accessToken);
  }, [router]);

  const fetchPartenaires = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/partenaires/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      const rawPartenaires = data.results || data;
      const fixedPartenaires = Array.isArray(rawPartenaires) ?
        rawPartenaires.map((partenaire: Partenaire) => ({
          ...partenaire,
          logo: partenaire.logo ? fixImageUrl(partenaire.logo) : null
        })) : [];
      setPartenaires(fixedPartenaires);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les partenaires');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPartenaire(null);
    setFormData({
      name: "",
      website: "",
      description: "",
      logo: null,
      logoPreview: null,
      is_active: true,
      order: partenaires.length + 1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (partenaire: Partenaire) => {
    setEditingPartenaire(partenaire);
    setFormData({
      name: partenaire.name,
      website: partenaire.website,
      description: partenaire.description,
      logo: null,
      logoPreview: partenaire.logo,
      is_active: partenaire.is_active,
      order: partenaire.order,
    });
    setDialogOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('is_active', formData.is_active.toString());
      formDataToSend.append('order', formData.order.toString());

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
       let response;
       if (editingPartenaire) {
         // Update
         response = await fetch(`${apiUrl}/api/admin/partenaires/${editingPartenaire.id}/`, {
           method: 'PUT',
           headers: {
             'Authorization': `Bearer ${token}`,
           },
           body: formDataToSend,
         });
       } else {
         // Create
         response = await fetch(`${apiUrl}/api/admin/partenaires/`, {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${token}`,
           },
           body: formDataToSend,
         });
       }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Erreur lors de la sauvegarde');
      }

      setDialogOpen(false);
      fetchPartenaires(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
       const response = await fetch(`${apiUrl}/api/admin/partenaires/${id}/`, {
         method: 'DELETE',
         headers: {
           'Authorization': `Bearer ${token}`,
         },
       });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchPartenaires(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const toggleActive = async (partenaire: Partenaire) => {
    try {
       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
       const response = await fetch(`${apiUrl}/api/admin/partenaires/${partenaire.id}/`, {
         method: 'PATCH',
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ is_active: !partenaire.is_active }),
       });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      fetchPartenaires(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const filteredPartenaires = partenaires.filter(partenaire =>
    partenaire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <AdminSidebar />
      <div className="">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gestion des Partenaires</h2>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau partenaire
            </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{partenaires.length}</div>
                <p className="text-sm text-muted-foreground">Total partenaires</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {partenaires.filter(p => p.is_active).length}
                </div>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un partenaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Logo</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Site web</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartenaires.map((partenaire) => (
                    <TableRow key={partenaire.id}>
                      <TableCell>
                        {partenaire.logo ? (
                          <Image
                            src={partenaire.logo}
                            alt={partenaire.name}
                            width={50}
                            height={50}
                            className="rounded object-contain"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-[50px] h-[50px] bg-gray-100 rounded flex items-center justify-center">
                            <Globe className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{partenaire.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {partenaire.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {partenaire.website ? (
                          <a 
                            href={partenaire.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {partenaire.website}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>{partenaire.order}</TableCell>
                      <TableCell>
                        <Badge variant={partenaire.is_active ? "default" : "secondary"}>
                          {partenaire.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(partenaire)}
                            title={partenaire.is_active ? "Désactiver" : "Activer"}
                          >
                            {partenaire.is_active ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(partenaire)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(partenaire.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPartenaires.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun partenaire trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-5xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col lg:flex-row max-h-[90vh]">
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[60%]">
          <DialogHeader>
            <DialogTitle>
              {editingPartenaire ? "Modifier le partenaire" : "Créer un nouveau partenaire"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du partenaire ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {formData.logoPreview && (
                  <Image
                    src={formData.logoPreview}
                    alt="Aperçu du logo"
                    width={80}
                    height={80}
                    className="rounded object-contain border"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Partenaire actif</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingPartenaire ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
          </div>

          {/* Right Panel - Partner Preview */}
          <div className="hidden lg:flex lg:w-[40%] bg-slate-900/60 border-l border-slate-700 overflow-y-auto p-6 flex-col justify-center items-center gap-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold self-start">
              Aperçu partenaire
            </Label>
            <p className="text-[11px] text-muted-foreground self-start mb-2">
              Rendu fidèle à la section partenaires
            </p>
            {/* Carte logo — comme dans la section partenaires du site */}
            <div className="w-full max-w-[240px] rounded-2xl border border-slate-700 bg-slate-800/70 shadow-lg overflow-hidden">
              {/* Zone logo */}
              <div className="flex items-center justify-center bg-white/5 border-b border-slate-700/60 py-6 px-4">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Logo"
                    className="max-h-16 max-w-[160px] object-contain drop-shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Globe className="w-10 h-10" />
                    <span className="text-[10px]">Logo non défini</span>
                  </div>
                )}
              </div>
              {/* Infos */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">
                  {formData.name || 'Nom du partenaire'}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {formData.description || 'Description courte du partenaire...'}
                </p>
                {formData.website && (
                  <p className="text-[10px] text-blue-400 truncate flex items-center gap-1">
                    <Globe className="w-3 h-3 shrink-0" />
                    {formData.website.replace(/^https?:\/\//, '')}
                  </p>
                )}
              </div>
              {/* Statut */}
              <div className="px-4 pb-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    formData.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                  {formData.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              ★ Sur le site : grille de logos avec effets hover
            </p>
          </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}