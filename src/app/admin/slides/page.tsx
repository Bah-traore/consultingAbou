"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Loader2,
  Upload,
  Image as ImageIcon,
  MoveUp,
  MoveDown
} from "lucide-react";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  order: number;
  // Personnalisation visuelle par slide
  slide_background_color: string;
  slide_title_color: string;
  slide_subtitle_color: string;
  slide_overlay_color: string;
  slide_content_background_color: string;
  slide_content_border_color: string;
  slide_content_border_radius: number;
  slide_content_padding: number;
  slide_show_border: boolean;
  // Dispositifs de texte additionnels
  slide_content_text?: string;
  slide_badge_text?: string;
  slide_badge_color?: string;
  slide_button_text?: string;
  slide_button_link?: string;
  slide_button_color?: string;
  slide_button_text_color?: string;
  // Position du titre
  title_position?: string;
  // Configuration globale du diaporama
  slideshow_autoplay_delay?: number;
  slideshow_title_color?: string;
  slideshow_subtitle_color?: string;
  slideshow_overlay_color?: string;
  slideshow_background_color?: string;
  overlay_opacity?: number;
  image_fit?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminSlides() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null as File | null,
    background_color: "#FFFFFF",
    text_color: "#000000",
    is_active: true,
    order: 0,
    // Personnalisation visuelle par slide
    slide_background_color: "#1E3A8A",
    slide_title_color: "#FFFFFF",
    slide_subtitle_color: "#E5E7EB",
    slide_overlay_color: "rgba(0, 0, 0, 0.6)",
    slide_content_background_color: "rgba(0, 0, 0, 0.4)",
    slide_content_border_color: "#3B82F6",
    slide_content_border_radius: 16,
    slide_content_padding: 24,
    slide_show_border: false,
    // Dispositifs de texte additionnels
    slide_content_text: "",
    slide_badge_text: "",
    slide_badge_color: "#3B82F6",
    slide_button_text: "",
    slide_button_link: "",
    slide_button_color: "#1E40AF",
    slide_button_text_color: "#FFFFFF",
    // Position du titre
    title_position: 'center',
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Vérifier si l'utilisateur est connecté
    if (!accessToken) {
      // Si aucun token d'accès, vérifier s'il y a un refresh token
      if (refreshToken) {
        // Tenter de rafraîchir le token
        refreshAccessToken(refreshToken)
          .then(newToken => {
            if (newToken) {
              setToken(newToken);
              localStorage.setItem('access_token', newToken);
              fetchSlides(newToken);
            } else {
              router.push('/admin/login');
            }
          })
          .catch(() => {
            router.push('/admin/login');
          });
      } else {
        router.push('/admin/login');
      }
      return;
    }
    
    setToken(accessToken);
    fetchSlides(accessToken);
  }, [router]);

  const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }
      
      const data = await response.json();
      return data.access || null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return null;
    }
  };

  const fetchSlides = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/slides/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      
      // Modifier les URLs des images pour utiliser le domaine personnalisé si configuré
      const slidesWithFixedImages = data.results ? 
        data.results.map((slide: Slide) => ({
          ...slide,
          image: slide.image ? fixImageUrl(slide.image) : null
        })) : 
        data.map((slide: Slide) => ({
          ...slide,
          image: slide.image ? fixImageUrl(slide.image) : null
        }));
      
      setSlides(slidesWithFixedImages);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les slides');
    } finally {
      setLoading(false);
    }
  };

  const fixImageUrl = (url: string): string => {
    // Vérifier si l'URL est une URL R2 et si le domaine personnalisé est configuré
    if (process.env.NEXT_PUBLIC_R2_CUSTOM_DOMAIN && url.includes('r2.cloudflarestorage.com')) {
      return url.replace(
        'https://d22c44f0b0ce9fe699f0dbc8dcfd5e3d.r2.cloudflarestorage.com',
        process.env.NEXT_PUBLIC_R2_CUSTOM_DOMAIN
      );
    }
    return url;
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      image: null,
      background_color: "#FFFFFF",
      text_color: "#000000",
      is_active: true,
      order: slides.length + 1,
      slide_background_color: "#1E3A8A",
      slide_title_color: "#FFFFFF",
      slide_subtitle_color: "#E5E7EB",
      slide_overlay_color: "rgba(0, 0, 0, 0.6)",
      slide_content_background_color: "rgba(0, 0, 0, 0.4)",
      slide_content_border_color: "#3B82F6",
      slide_content_border_radius: 16,
      slide_content_padding: 24,
      slide_show_border: false,
      slide_content_text: "",
      slide_badge_text: "",
      slide_badge_color: "#3B82F6",
      slide_button_text: "",
      slide_button_link: "",
      slide_button_color: "#1E40AF",
      slide_button_text_color: "#FFFFFF",
      title_position: 'center',
    });
    setDialogOpen(true);
  };

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: null,
      background_color: slide.background_color,
      text_color: slide.text_color,
      is_active: slide.is_active,
      order: slide.order,
      slide_background_color: slide.slide_background_color || "#1E3A8A",
      slide_title_color: slide.slide_title_color || "#FFFFFF",
      slide_subtitle_color: slide.slide_subtitle_color || "#E5E7EB",
      slide_overlay_color: slide.slide_overlay_color || "rgba(0, 0, 0, 0.6)",
      slide_content_background_color: slide.slide_content_background_color || "rgba(0, 0, 0, 0.4)",
      slide_content_border_color: slide.slide_content_border_color || "#3B82F6",
      slide_content_border_radius: slide.slide_content_border_radius ?? 16,
      slide_content_padding: slide.slide_content_padding ?? 24,
      slide_show_border: slide.slide_show_border || false,
      slide_content_text: slide.slide_content_text || "",
      slide_badge_text: slide.slide_badge_text || "",
      slide_badge_color: slide.slide_badge_color || "#3B82F6",
      slide_button_text: slide.slide_button_text || "",
      slide_button_link: slide.slide_button_link || "",
      slide_button_color: slide.slide_button_color || "#1E40AF",
      slide_button_text_color: slide.slide_button_text_color || "#FFFFFF",
      title_position: slide.title_position || 'center',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('background_color', formData.background_color);
      submitData.append('text_color', formData.text_color);
      submitData.append('is_active', formData.is_active.toString());
      submitData.append('order', formData.order.toString());
      // Personnalisation visuelle par slide
      submitData.append('slide_background_color', formData.slide_background_color);
      submitData.append('slide_title_color', formData.slide_title_color);
      submitData.append('slide_subtitle_color', formData.slide_subtitle_color);
      submitData.append('slide_overlay_color', formData.slide_overlay_color);
      submitData.append('slide_content_background_color', formData.slide_content_background_color);
      submitData.append('slide_content_border_color', formData.slide_content_border_color);
      submitData.append('slide_content_border_radius', formData.slide_content_border_radius.toString());
      submitData.append('slide_content_padding', formData.slide_content_padding.toString());
      submitData.append('slide_show_border', formData.slide_show_border.toString());
      // Dispositifs de texte additionnels
      submitData.append('slide_content_text', formData.slide_content_text);
      submitData.append('slide_badge_text', formData.slide_badge_text);
      submitData.append('slide_badge_color', formData.slide_badge_color);
      submitData.append('slide_button_text', formData.slide_button_text);
      submitData.append('slide_button_link', formData.slide_button_link);
      submitData.append('slide_button_color', formData.slide_button_color);
      submitData.append('slide_button_text_color', formData.slide_button_text_color);
      // Position du titre
      submitData.append('title_position', formData.title_position);
      
      // Handle image upload - keep existing image if not changed during edit
      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (editingSlide && editingSlide.image) {
        // Keep the existing image URL when editing without changing the image
        submitData.append('keep_image', 'true');
      }
      
      // Assurer que title_position est envoyé comme chaîne de caractères
      if (typeof formData.title_position !== 'string') {
        submitData.append('title_position', String(formData.title_position));
      } else {
        submitData.append('title_position', formData.title_position);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      let response;
      if (editingSlide) {
        // Update
        response = await fetch(`${apiUrl}/api/admin/slides/${editingSlide.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: submitData,
        });
      } else {
        // Create
        response = await fetch(`${apiUrl}/api/admin/slides/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: submitData,
        });
      }

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      setDialogOpen(false);
      fetchSlides(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce slide ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/slides/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchSlides(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const toggleActive = async (slide: Slide) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/slides/${slide.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !slide.is_active }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      fetchSlides(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const moveUp = async (slide: Slide) => {
    if (slide.order <= 1) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/slides/${slide.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: slide.order - 1 }),
      });

      if (!response.ok) throw new Error('Erreur lors du déplacement');

      fetchSlides(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const moveDown = async (slide: Slide) => {
    if (slide.order >= slides.length) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/slides/${slide.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: slide.order + 1 }),
      });

      if (!response.ok) throw new Error('Erreur lors du déplacement');

      fetchSlides(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.order - b.order);

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
          <h2 className="text-2xl font-bold">Gestion du Diaporama</h2>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau slide
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <EyeOff className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{slides.length}</div>
              <p className="text-sm text-muted-foreground">Total slides</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {slides.filter(s => s.is_active).length}
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
                placeholder="Rechercher un slide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map((slide) => (
            <Card key={slide.id} className={!slide.is_active ? "opacity-60" : ""}>
              <CardContent className="p-0">
                {/* Image Preview */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: slide.background_color }}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay with title */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                    }}
                  >
                    <h3 
                      className="font-semibold text-lg"
                      style={{ color: slide.text_color }}
                    >
                      {slide.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={slide.is_active ? "default" : "secondary"}>
                      {slide.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Ordre: {slide.order}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {slide.subtitle}
                  </p>

                  {/* Color Preview */}
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: slide.background_color }}
                      />
                      Fond
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: slide.text_color }}
                      />
                      Texte
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveUp(slide)}
                        disabled={slide.order <= 1}
                        title="Monter"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(slide)}
                        disabled={slide.order >= slides.length}
                        title="Descendre"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(slide)}
                        title={slide.is_active ? "Désactiver" : "Activer"}
                      >
                        {slide.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(slide)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(slide.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Modifier le slide" : "Créer un nouveau slide"}
            </DialogTitle>
            <DialogDescription>
              Configurez le contenu et l'apparence du slide.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {editingSlide?.image && !formData.image && (
                  <div className="mb-4">
                    <div className="relative h-32 w-full mx-auto rounded-md overflow-hidden">
                      <Image
                        src={editingSlide.image}
                        alt="Image actuelle"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Image actuelle</p>
                  </div>
                )}
                
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <Upload className="h-4 w-4" />
                  {formData.image ? formData.image.name : "Cliquer pour uploader une image"}
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG ou WebP (max 5MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="background_color">Couleur de fond</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_color">Couleur du texte</Label>
                <div className="flex gap-2">
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="flex-1"
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
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Slide actif</Label>
              </div>
            </div>

            {/* Section Personnalisation visuelle du slide */}
            <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <Label className="text-sm font-semibold">Personnalisation visuelle du slide</Label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Couleur de fond du slide */}
                <div className="space-y-2">
                  <Label htmlFor="slide_background_color">Couleur de fond (sans image)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_background_color"
                      type="color"
                      value={formData.slide_background_color}
                      onChange={(e) => setFormData({ ...formData, slide_background_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_background_color}
                      onChange={(e) => setFormData({ ...formData, slide_background_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Couleur du titre */}
                <div className="space-y-2">
                  <Label htmlFor="slide_title_color">Couleur du titre</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_title_color"
                      type="color"
                      value={formData.slide_title_color}
                      onChange={(e) => setFormData({ ...formData, slide_title_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_title_color}
                      onChange={(e) => setFormData({ ...formData, slide_title_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Couleur du sous-titre */}
                <div className="space-y-2">
                  <Label htmlFor="slide_subtitle_color">Couleur du sous-titre</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_subtitle_color"
                      type="color"
                      value={formData.slide_subtitle_color}
                      onChange={(e) => setFormData({ ...formData, slide_subtitle_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_subtitle_color}
                      onChange={(e) => setFormData({ ...formData, slide_subtitle_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Couleur de l'overlay */}
                <div className="space-y-2">
                  <Label htmlFor="slide_overlay_color">Overlay sur image</Label>
                  <Input
                    id="slide_overlay_color"
                    type="text"
                    value={formData.slide_overlay_color}
                    onChange={(e) => setFormData({ ...formData, slide_overlay_color: e.target.value })}
                    placeholder="rgba(0, 0, 0, 0.6)"
                    className="text-sm"
                  />
                </div>

                {/* Couleur de fond du contenu */}
                <div className="space-y-2">
                  <Label htmlFor="slide_content_background_color">Fond du conteneur texte</Label>
                  <Input
                    id="slide_content_background_color"
                    type="text"
                    value={formData.slide_content_background_color}
                    onChange={(e) => setFormData({ ...formData, slide_content_background_color: e.target.value })}
                    placeholder="rgba(0, 0, 0, 0.4)"
                    className="text-sm"
                  />
                </div>

                {/* Couleur de bordure */}
                <div className="space-y-2">
                  <Label htmlFor="slide_content_border_color">Couleur de bordure</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_content_border_color"
                      type="color"
                      value={formData.slide_content_border_color}
                      onChange={(e) => setFormData({ ...formData, slide_content_border_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_content_border_color}
                      onChange={(e) => setFormData({ ...formData, slide_content_border_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Rayon de bordure */}
                <div className="space-y-2">
                  <Label htmlFor="slide_content_border_radius">Rayon de bordure (px)</Label>
                  <Input
                    id="slide_content_border_radius"
                    type="number"
                    value={formData.slide_content_border_radius}
                    onChange={(e) => setFormData({ ...formData, slide_content_border_radius: parseInt(e.target.value) || 16 })}
                    min="0"
                    max="100"
                  />
                </div>

                {/* Padding du conteneur */}
                <div className="space-y-2">
                  <Label htmlFor="slide_content_padding">Padding (px)</Label>
                  <Input
                    id="slide_content_padding"
                    type="number"
                    value={formData.slide_content_padding}
                    onChange={(e) => setFormData({ ...formData, slide_content_padding: parseInt(e.target.value) || 24 })}
                    min="0"
                    max="100"
                  />
                </div>

                {/* Afficher la bordure */}
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="slide_show_border"
                    checked={formData.slide_show_border}
                    onChange={(e) => setFormData({ ...formData, slide_show_border: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="slide_show_border">Afficher la bordure du conteneur</Label>
                </div>
              </div>
            </div>

            {/* Section Position du titre */}
            <div className="bg-amber-800/50 p-4 rounded-lg space-y-4 border border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <Label className="text-sm font-semibold">Position du titre</Label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_position">Position du titre</Label>
                  <select
                    id="title_position"
                    value={formData.title_position}
                    onChange={(e) => setFormData({ ...formData, title_position: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="top-left">Haut Gauche</option>
                    <option value="top-center">Haut Centre</option>
                    <option value="top-right">Haut Droite</option>
                    <option value="center-left">Centre Gauche</option>
                    <option value="center">Centre</option>
                    <option value="center-right">Centre Droite</option>
                    <option value="bottom-left">Bas Gauche</option>
                    <option value="bottom-center">Bas Centre</option>
                    <option value="bottom-right">Bas Droite</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Dispositifs de texte additionnels */}
            <div className="bg-emerald-800/50 p-4 rounded-lg space-y-4 border border-emerald-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <Label className="text-sm font-semibold">Dispositifs de texte additionnels</Label>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Texte de contenu */}
                <div className="space-y-2">
                  <Label htmlFor="slide_content_text">Texte de contenu</Label>
                  <Input
                    id="slide_content_text"
                    value={formData.slide_content_text}
                    onChange={(e) => setFormData({ ...formData, slide_content_text: e.target.value })}
                    placeholder="Texte supplémentaire à afficher"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-2">
                  <Label htmlFor="slide_badge_text">Texte du badge</Label>
                  <Input
                    id="slide_badge_text"
                    value={formData.slide_badge_text}
                    onChange={(e) => setFormData({ ...formData, slide_badge_text: e.target.value })}
                    placeholder="Texte du badge"
                  />
                </div>

                {/* Couleur du badge */}
                <div className="space-y-2">
                  <Label htmlFor="slide_badge_color">Couleur du badge</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_badge_color"
                      type="color"
                      value={formData.slide_badge_color}
                      onChange={(e) => setFormData({ ...formData, slide_badge_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_badge_color}
                      onChange={(e) => setFormData({ ...formData, slide_badge_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Texte du bouton */}
                <div className="space-y-2">
                  <Label htmlFor="slide_button_text">Texte du bouton</Label>
                  <Input
                    id="slide_button_text"
                    value={formData.slide_button_text}
                    onChange={(e) => setFormData({ ...formData, slide_button_text: e.target.value })}
                    placeholder="Texte du bouton"
                  />
                </div>

                {/* Lien du bouton */}
                <div className="space-y-2">
                  <Label htmlFor="slide_button_link">Lien du bouton</Label>
                  <Input
                    id="slide_button_link"
                    value={formData.slide_button_link}
                    onChange={(e) => setFormData({ ...formData, slide_button_link: e.target.value })}
                    placeholder="https://exemple.com"
                  />
                </div>

                {/* Couleur du bouton */}
                <div className="space-y-2">
                  <Label htmlFor="slide_button_color">Couleur du bouton</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_button_color"
                      type="color"
                      value={formData.slide_button_color}
                      onChange={(e) => setFormData({ ...formData, slide_button_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_button_color}
                      onChange={(e) => setFormData({ ...formData, slide_button_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Couleur du texte du bouton */}
                <div className="space-y-2">
                  <Label htmlFor="slide_button_text_color">Couleur du texte du bouton</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slide_button_text_color"
                      type="color"
                      value={formData.slide_button_text_color}
                      onChange={(e) => setFormData({ ...formData, slide_button_text_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.slide_button_text_color}
                      onChange={(e) => setFormData({ ...formData, slide_button_text_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingSlide ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}