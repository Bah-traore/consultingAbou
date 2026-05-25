"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageLayout } from "@/components/AdminPageLayout";
import { fixImageUrl } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  Presentation,
  Target,
  Award
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  category: string;
  icon: string;
  is_active: boolean;
  order: number;
  service_background_color: string;
  service_title_color: string;
  service_description_color: string;
  service_category_color: string;
  service_category_text_color: string;
  created_at: string;
  updated_at: string;
}

export default function AdminServices() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  interface FormDataState {
    title: string;
    description: string;
    image: File | null;
    category: string;
    icon: string;
    is_active: boolean;
    order: number;
    service_background_color: string;
    service_title_color: string;
    service_description_color: string;
    service_category_color: string;
    service_category_text_color: string;
  }
  
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    description: "",
    image: null,
    category: "formation",
    icon: "BookOpen",
    is_active: true,
    order: 1,
    service_background_color: "#FFFFFF",
    service_title_color: "#1F2937",
    service_description_color: "#6B7280",
    service_category_color: "#3B82F6",
    service_category_text_color: "#FFFFFF",
  });

  useEffect(() => {
    // Vérifier l'authentification
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    fetchServices(accessToken);
  }, [router]);

  const fetchServices = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/services/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      const rawServices = data.results || data;
      const fixedServices = Array.isArray(rawServices) ?
        rawServices.map((service: Service) => ({
          ...service,
          image: service.image ? fixImageUrl(service.image) : null
        })) : [];
      setServices(fixedServices);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les services');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      image: null,
      category: "formation",
      icon: "BookOpen",
      is_active: true,
      order: services.length + 1,
      service_background_color: "#FFFFFF",
      service_title_color: "#1F2937",
      service_description_color: "#6B7280",
      service_category_color: "#3B82F6",
      service_category_text_color: "#FFFFFF",
    });
    setDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      icon: service.icon || "BookOpen",
      is_active: service.is_active,
      order: service.order,
      image: null,
      service_background_color: service.service_background_color || "#FFFFFF",
      service_title_color: service.service_title_color || "#1F2937",
      service_description_color: service.service_description_color || "#6B7280",
      service_category_color: service.service_category_color || "#3B82F6",
      service_category_text_color: service.service_category_text_color || "#FFFFFF",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      let response;
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs du formulaire au FormData
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('icon', formData.icon);
      formDataToSend.append('is_active', String(formData.is_active));
      formDataToSend.append('order', String(formData.order));
      
      // Ajouter les champs de couleurs
      formDataToSend.append('service_background_color', formData.service_background_color);
      formDataToSend.append('service_title_color', formData.service_title_color);
      formDataToSend.append('service_description_color', formData.service_description_color);
      formDataToSend.append('service_category_color', formData.service_category_color);
      formDataToSend.append('service_category_text_color', formData.service_category_text_color);
      
      // Ajouter l'image si elle existe
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingService) {
        // Update
        response = await fetch(`${apiUrl}/api/admin/services/${editingService.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create
        response = await fetch(`${apiUrl}/api/admin/services/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      setDialogOpen(false);
      fetchServices(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/services/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchServices(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/services/${service.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !service.is_active }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      fetchServices(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout title="Gestion des Services" subtitle="Gérez vos prestations et services">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau service
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.order}</TableCell>
                  <TableCell>
                    <Badge variant={service.is_active ? "default" : "secondary"}>
                      {service.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(service)}
                        title={service.is_active ? "Désactiver" : "Activer"}
                      >
                        {service.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col lg:flex-row max-h-[90vh]">
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[60%]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Modifier le service" : "Créer un nouveau service"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du service ci-dessous.
            </DialogDescription>
          </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formation">Formation</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="accompagnement">Accompagnement</SelectItem>
                  <SelectItem value="preparation">Préparation concours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image du service</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFormData({ ...formData, image: e.target.files[0] });
                }
              }}
            />
            {(formData.image || (editingService && editingService.image)) && (
              <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden bg-gray-50 border">
                <img
                  src={formData.image ? URL.createObjectURL(formData.image) : (editingService?.image || '')}
                  alt="Aperçu"
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BookOpen">BookOpen</SelectItem>
                    <SelectItem value="Presentation">Presentation</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                    <SelectItem value="Award">Award</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
            </div>

          {/* Section Personnalisation des couleurs */}
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <Label className="text-sm font-semibold">Personnalisation des couleurs</Label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_background_color">Fond carte</Label>
                <div className="flex gap-2">
                  <Input
                    id="service_background_color"
                    type="color"
                    value={formData.service_background_color}
                    onChange={(e) => setFormData({ ...formData, service_background_color: e.target.value })}
                    className="h-9 w-16 cursor-pointer"
                  />
                  <Input
                    value={formData.service_background_color}
                    onChange={(e) => setFormData({ ...formData, service_background_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_title_color">Couleur titre</Label>
                <div className="flex gap-2">
                  <Input
                    id="service_title_color"
                    type="color"
                    value={formData.service_title_color}
                    onChange={(e) => setFormData({ ...formData, service_title_color: e.target.value })}
                    className="h-9 w-16 cursor-pointer"
                  />
                  <Input
                    value={formData.service_title_color}
                    onChange={(e) => setFormData({ ...formData, service_title_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_description_color">Couleur description</Label>
                <div className="flex gap-2">
                  <Input
                    id="service_description_color"
                    type="color"
                    value={formData.service_description_color}
                    onChange={(e) => setFormData({ ...formData, service_description_color: e.target.value })}
                    className="h-9 w-16 cursor-pointer"
                  />
                  <Input
                    value={formData.service_description_color}
                    onChange={(e) => setFormData({ ...formData, service_description_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_category_color">Couleur catégorie</Label>
                <div className="flex gap-2">
                  <Input
                    id="service_category_color"
                    type="color"
                    value={formData.service_category_color}
                    onChange={(e) => setFormData({ ...formData, service_category_color: e.target.value })}
                    className="h-9 w-16 cursor-pointer"
                  />
                  <Input
                    value={formData.service_category_color}
                    onChange={(e) => setFormData({ ...formData, service_category_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_category_text_color">Texte catégorie</Label>
                <div className="flex gap-2">
                  <Input
                    id="service_category_text_color"
                    type="color"
                    value={formData.service_category_text_color}
                    onChange={(e) => setFormData({ ...formData, service_category_text_color: e.target.value })}
                    className="h-9 w-16 cursor-pointer"
                  />
                  <Input
                    value={formData.service_category_text_color}
                    onChange={(e) => setFormData({ ...formData, service_category_text_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>



          <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_active">Service actif</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingService ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="hidden lg:flex lg:w-[40%] bg-slate-900/60 border-l border-slate-700 overflow-y-auto p-6 flex-col justify-center items-center gap-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold self-start">
              Aperçu carte service
            </Label>
            <p className="text-[11px] text-muted-foreground self-start mb-2">
              Rendu fidèle à la page /services
            </p>
            {/* Carte fidèle à ServicesSection.tsx */}
            <div
              className="w-full max-w-[280px] rounded-xl border border-border/70 overflow-hidden shadow-md transition-all duration-300"
              style={{ backgroundColor: formData.service_background_color }}
            >
              {/* Image si disponible */}
              {(formData.image || (editingService && editingService.image)) && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={formData.image ? URL.createObjectURL(formData.image) : (editingService?.image || '')}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {/* CardHeader : icône + titre + description */}
              <div className="px-5 pt-5 pb-2">
                <div
                  className="flex items-start gap-3 font-semibold text-base mb-2"
                  style={{ color: formData.service_title_color }}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-background/20">
                    {(() => {
                      const icons: Record<string, React.ElementType> = { BookOpen, Presentation, Target, Award };
                      const Icon = icons[formData.icon] || BookOpen;
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </span>
                  <span className="line-clamp-2 leading-snug">{formData.title || 'Titre du service'}</span>
                </div>
                <p
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: formData.service_description_color }}
                >
                  {formData.description || 'La description du service apparaît ici sur 3 lignes maximum avant d\'être tronquée.'}
                </p>
              </div>
              {/* CardContent : badge catégorie */}
              <div className="px-5 pb-5 pt-2">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize border"
                  style={{
                    backgroundColor: formData.service_category_color,
                    color: formData.service_category_text_color,
                    borderColor: formData.service_category_color
                  }}
                >
                  {formData.category || 'catégorie'}
                </span>
              </div>
            </div>
          </div>

          </div>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}