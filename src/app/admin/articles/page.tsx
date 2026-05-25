"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  Tag
} from "lucide-react";
import Image from "next/image";
import { fixImageUrl } from "@/lib/api";


interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  status: 'draft' | 'published';
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  article_card_background_color: string;
  article_title_color: string;
  article_excerpt_color: string;
  article_tag_background_color: string;
  article_tag_text_color: string;
}

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    is_featured: false,
    featured_image: null as File | null,
    article_card_background_color: "#FFFFFF",
    article_title_color: "#1F2937",
    article_excerpt_color: "#6B7280",
    article_tag_background_color: "#3B82F6",
    article_tag_text_color: "#FFFFFF",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    fetchArticles(accessToken);
  }, [router]);

  const fetchArticles = async (accessToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/articles/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      const rawArticles = data.results || data;
      const fixedArticles = Array.isArray(rawArticles) ? 
        rawArticles.map((article: Article) => ({
          ...article,
          featured_image: article.featured_image ? fixImageUrl(article.featured_image) : null
        })) : [];
      setArticles(fixedArticles);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      tags: "",
      is_featured: false,
      featured_image: null,
      article_card_background_color: "#FFFFFF",
      article_title_color: "#1F2937",
      article_excerpt_color: "#6B7280",
      article_tag_background_color: "#3B82F6",
      article_tag_text_color: "#FFFFFF",
    });
    setDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      is_featured: article.is_featured,
      featured_image: null,
      article_card_background_color: article.article_card_background_color || "#FFFFFF",
      article_title_color: article.article_title_color || "#1F2937",
      article_excerpt_color: article.article_excerpt_color || "#6B7280",
      article_tag_background_color: article.article_tag_background_color || "#3B82F6",
      article_tag_text_color: article.article_tag_text_color || "#FFFFFF",
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
      formDataToSend.append('title', formData.title);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('is_featured', String(formData.is_featured));
      formDataToSend.append('article_card_background_color', formData.article_card_background_color);
      formDataToSend.append('article_title_color', formData.article_title_color);
      formDataToSend.append('article_excerpt_color', formData.article_excerpt_color);
      formDataToSend.append('article_tag_background_color', formData.article_tag_background_color);
      formDataToSend.append('article_tag_text_color', formData.article_tag_text_color);
      
      if (formData.featured_image) {
        formDataToSend.append('featured_image', formData.featured_image);
      }

      if (editingArticle) {
        // Update
        response = await fetch(`${apiUrl}/api/admin/articles/${editingArticle.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create
        response = await fetch(`${apiUrl}/api/admin/articles/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      setDialogOpen(false);
      fetchArticles(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/articles/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchArticles(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/articles/${id}/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la publication');

      fetchArticles(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const toggleFeatured = async (article: Article) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/articles/${article.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_featured: !article.is_featured }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      fetchArticles(token!);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "drafts") return matchesSearch && article.status === 'draft';
    if (activeTab === "published") return matchesSearch && article.status === 'published';
    return matchesSearch;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gestion des Articles</h2>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel article
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{articles.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {articles.filter(a => a.status === 'published').length}
              </div>
              <p className="text-sm text-muted-foreground">Publiés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {articles.filter(a => a.status === 'draft').length}
              </div>
              <p className="text-sm text-muted-foreground">Brouillons</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Tabs */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="drafts">Brouillons</TabsTrigger>
                <TabsTrigger value="published">Publiés</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      {article.featured_image ? (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {article.excerpt}
                        </div>
                        {Array.isArray(article.tags) && article.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {article.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {article.author.first_name} {article.author.last_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={article.status === 'published' ? "default" : "secondary"}>
                          {article.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                        {article.is_featured && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            ⭐ Vedette
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {article.status === 'published' ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.published_at)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePublish(article.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Publier"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(article)}
                          title={article.is_featured ? "Retirer vedette" : "Mettre en vedette"}
                        >
                          <Eye className={`h-4 w-4 ${article.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
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
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col lg:flex-row max-h-[90vh]">
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[60%]">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Modifier l'article" : "Créer un nouvel article"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'article ci-dessous.
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
              <Label htmlFor="excerpt">Extrait / Résumé</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Court résumé de l'article..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="éducation, formation, coaching..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image">Image à la une</Label>
              <Input
                id="featured_image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData({ ...formData, featured_image: e.target.files[0] });
                  }
                }}
              />
              {(formData.featured_image || (editingArticle && editingArticle.featured_image)) && (
                <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden bg-gray-50 border">
                  <img
                    src={formData.featured_image ? URL.createObjectURL(formData.featured_image) : (editingArticle?.featured_image || '')}
                    alt="Aperçu"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_featured">Article en vedette</Label>
            </div>

            {/* Section Personnalisation des couleurs */}
            <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <Label className="text-sm font-semibold">Personnalisation des couleurs</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="article_card_background_color">Fond carte</Label>
                  <div className="flex gap-2">
                    <Input
                      id="article_card_background_color"
                      type="color"
                      value={formData.article_card_background_color}
                      onChange={(e) => setFormData({ ...formData, article_card_background_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.article_card_background_color}
                      onChange={(e) => setFormData({ ...formData, article_card_background_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article_title_color">Couleur titre</Label>
                  <div className="flex gap-2">
                    <Input
                      id="article_title_color"
                      type="color"
                      value={formData.article_title_color}
                      onChange={(e) => setFormData({ ...formData, article_title_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.article_title_color}
                      onChange={(e) => setFormData({ ...formData, article_title_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article_excerpt_color">Couleur extrait</Label>
                  <div className="flex gap-2">
                    <Input
                      id="article_excerpt_color"
                      type="color"
                      value={formData.article_excerpt_color}
                      onChange={(e) => setFormData({ ...formData, article_excerpt_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.article_excerpt_color}
                      onChange={(e) => setFormData({ ...formData, article_excerpt_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article_tag_background_color">Fond tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="article_tag_background_color"
                      type="color"
                      value={formData.article_tag_background_color}
                      onChange={(e) => setFormData({ ...formData, article_tag_background_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.article_tag_background_color}
                      onChange={(e) => setFormData({ ...formData, article_tag_background_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article_tag_text_color">Texte tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="article_tag_text_color"
                      type="color"
                      value={formData.article_tag_text_color}
                      onChange={(e) => setFormData({ ...formData, article_tag_text_color: e.target.value })}
                      className="h-9 w-16 cursor-pointer"
                    />
                    <Input
                      value={formData.article_tag_text_color}
                      onChange={(e) => setFormData({ ...formData, article_tag_text_color: e.target.value })}
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
                {editingArticle ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="hidden lg:flex lg:w-[40%] bg-slate-900/60 border-l border-slate-700 overflow-y-auto p-6 flex-col justify-center items-center gap-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold self-start">
              Aperçu carte article
            </Label>
            <p className="text-[11px] text-muted-foreground self-start mb-2">
              Rendu fidèle à la page /blog
            </p>
            <div
              className="w-full max-w-[280px] rounded-xl border border-border/70 overflow-hidden shadow-md transition-all duration-300"
              style={{ backgroundColor: formData.article_card_background_color }}
            >
              {/* Image à la une */}
              {(formData.featured_image || (editingArticle && editingArticle.featured_image)) ? (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={formData.featured_image ? URL.createObjectURL(formData.featured_image) : (editingArticle?.featured_image || '')}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <span className="text-slate-500 text-xs">Aucune image</span>
                </div>
              )}
              <div className="p-4 space-y-2">
                {/* Tags */}
                {formData.tags && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.split(',').slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] font-semibold rounded-full"
                        style={{
                          backgroundColor: formData.article_tag_background_color,
                          color: formData.article_tag_text_color
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {/* Titre */}
                <h3
                  className="text-sm font-bold leading-snug line-clamp-2"
                  style={{ color: formData.article_title_color }}
                >
                  {formData.title || "Titre de l'article"}
                </h3>
                {/* Extrait */}
                <p
                  className="text-xs leading-relaxed line-clamp-3"
                  style={{ color: formData.article_excerpt_color }}
                >
                  {formData.excerpt || "L'extrait de l'article apparaît ici. Il est limité à 3 lignes pour ne pas surcharger la carte."}
                </p>
                {/* Footer carte */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] opacity-50" style={{ color: formData.article_excerpt_color }}>
                    {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: formData.article_tag_background_color }}
                  >
                    Lire la suite →
                  </span>
                </div>
              </div>
            </div>
          </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
