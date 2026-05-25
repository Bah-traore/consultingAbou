"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Loader2,
  Palette,
  Type,
  Layout,
  CheckCircle,
  XCircle
} from "lucide-react";
import { fixImageUrl } from "@/lib/api";


interface SiteCustomization {
  id: number;
  // Hero Section
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_link: string;
  show_hero_section: boolean;
  
  // Services Section
  services_title: string;
  services_description: string;
  services_background_color: string;
  services_title_color: string;
  services_description_color: string;
  services_card_background_color: string;
  services_card_title_color: string;
  services_card_description_color: string;
  services_image: string | null;
  
  // About Section
  about_title: string;
  about_description: string;
  about_background_color: string;
  about_title_color: string;
  about_description_color: string;
  about_card_background_color: string;
  about_image: string | null;
  show_about_section: boolean;
  
  // Testimonials Section
  testimonials_title: string;
  testimonials_description: string;
  testimonials_background_color: string;
  testimonials_title_color: string;
  testimonials_description_color: string;
  testimonials_card_background_color: string;
  testimonials_border_color: string;
  testimonials_image: string | null;
  show_testimonials_section: boolean;
  
  // Blog Section
  blog_title: string;
  blog_description: string;
  blog_background_color: string;
  blog_title_color: string;
  blog_description_color: string;
  blog_card_background_color: string;
  blog_border_color: string;
  show_blog_section: boolean;
  
  // Partners Section
  partners_title: string;
  partners_background_color: string;
  partners_title_color: string;
  partners_card_background_color: string;
  partners_border_color: string;
  show_partners_section: boolean;
  
  // CTA Section
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
  cta_background_color: string;
  cta_title_color: string;
  cta_description_color: string;
  cta_button_primary_color: string;
  cta_button_text_color: string;
  show_cta_section: boolean;
  
  // Global Colors
  primary_color: string;
  secondary_color: string;
  text_color: string;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminCustomization() {
  const router = useRouter();
  const [customization, setCustomization] = useState<SiteCustomization | null>(null);
  const [fileFields, setFileFields] = useState<{
    testimonials_image?: File;
    services_image?: File;
    about_image?: File;
  }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    
    setToken(accessToken);
    fetchCustomization(accessToken);
  }, [router]);

  const fetchCustomization = async (accessToken: string) => {
    try {
      // const response = await fetch('/api/admin/customization/', {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/customization/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (data) {
        const imageFields = ['testimonials_image', 'services_image', 'about_image', 'hero_image_badge_icon', 'hero_image', 'hero_background_image'];
        imageFields.forEach(field => {
          if (data[field]) {
            data[field] = fixImageUrl(data[field]);
          }
        });
      }
      setCustomization(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger la configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!customization) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const formData = new FormData();
      
      // Ajouter tous les champs textuels sauf les champs d'image
      Object.entries(customization).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Ne pas ajouter les champs d'image ici car ils seront ajoutés séparément
          if (!['testimonials_image', 'services_image', 'about_image', 'hero_image_badge_icon'].includes(key)) {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Ajouter les fichiers si présents
      if (fileFields.testimonials_image) {
        formData.append('testimonials_image', fileFields.testimonials_image);
      }
      if (fileFields.services_image) {
        formData.append('services_image', fileFields.services_image);
      }
      if (fileFields.about_image) {
        formData.append('about_image', fileFields.about_image);
      }
      
      let response;
      if (customization.id) {
        // Update existing
        response = await fetch(`${apiUrl}/api/admin/customization/${customization.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Pas de Content-Type pour FormData, le navigateur le définit automatiquement
          },
          body: formData,
        });
      } else {
        // Create new
        response = await fetch(`${apiUrl}/api/admin/customization/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Pas de Content-Type pour FormData, le navigateur le définit automatiquement
          },
          body: formData,
        });
      }

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      const data = await response.json();
      if (data) {
        const imageFields = ['testimonials_image', 'services_image', 'about_image', 'hero_image_badge_icon', 'hero_image', 'hero_background_image'];
        imageFields.forEach(field => {
          if (data[field]) {
            data[field] = fixImageUrl(data[field]);
          }
        });
      }
      setCustomization(data);
      setSuccess('Configuration sauvegardée avec succès !');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteCustomization, value: any) => {
    if (!customization) return;
    setCustomization({ ...customization, [field]: value });
  };

  const updateFileField = (field: 'testimonials_image' | 'services_image' | 'about_image', file: File | null) => {
    if (file) {
      setFileFields(prev => ({ ...prev, [field]: file }));
    } else {
      setFileFields(prev => {
        const newFields = { ...prev };
        delete newFields[field];
        return newFields;
      });
    }
  };

  const ColorPicker = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void 
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-1 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );

  const SectionToggle = ({ 
    label, 
    checked, 
    onChange 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void 
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <Label className="text-base font-medium">{label}</Label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 cursor-pointer"
      />
    </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Personnalisation du Site</h2>
            <p className="text-sm text-muted-foreground">
              Configurez l'apparence et le contenu de votre site
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
            <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          {/* Global Colors */}
          <TabsContent value="global" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Couleurs Globales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Couleur principale"
                  value={customization?.primary_color || "#1E40AF"}
                  onChange={(v) => updateField('primary_color', v)}
                />
                <ColorPicker
                  label="Couleur secondaire"
                  value={customization?.secondary_color || "#F59E0B"}
                  onChange={(v) => updateField('secondary_color', v)}
                />
                <ColorPicker
                  label="Couleur du texte"
                  value={customization?.text_color || "#1F2937"}
                  onChange={(v) => updateField('text_color', v)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Section Hero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectionToggle
                  label="Afficher la section Hero"
                  checked={customization?.show_hero_section ?? true}
                  onChange={(v) => updateField('show_hero_section', v)}
                />
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Titre principal</Label>
                  <Input
                    id="hero_title"
                    value={customization?.hero_title || ""}
                    onChange={(e) => updateField('hero_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Sous-titre</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={customization?.hero_subtitle || ""}
                    onChange={(e) => updateField('hero_subtitle', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero_button_text">Texte du bouton</Label>
                    <Input
                      id="hero_button_text"
                      value={customization?.hero_button_text || ""}
                      onChange={(e) => updateField('hero_button_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_button_link">Lien du bouton</Label>
                    <Input
                      id="hero_button_link"
                      value={customization?.hero_button_link || ""}
                      onChange={(e) => updateField('hero_button_link', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Section Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services_title">Titre</Label>
                  <Input
                    id="services_title"
                    value={customization?.services_title || ""}
                    onChange={(e) => updateField('services_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services_description">Description</Label>
                  <Textarea
                    id="services_description"
                    value={customization?.services_description || ""}
                    onChange={(e) => updateField('services_description', e.target.value)}
                    rows={2}
                  />
                </div>
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Couleurs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Fond de section"
                    value={customization?.services_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('services_background_color', v)}
                  />
                  <ColorPicker
                    label="Titre"
                    value={customization?.services_title_color || "#1F2937"}
                    onChange={(v) => updateField('services_title_color', v)}
                  />
                  <ColorPicker
                    label="Description"
                    value={customization?.services_description_color || "#6B7280"}
                    onChange={(v) => updateField('services_description_color', v)}
                  />
                  <ColorPicker
                    label="Fond des cartes"
                    value={customization?.services_card_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('services_card_background_color', v)}
                  />
                  <ColorPicker
                    label="Titre des cartes"
                    value={customization?.services_card_title_color || "#1F2937"}
                    onChange={(v) => updateField('services_card_title_color', v)}
                  />
                  <ColorPicker
                    label="Description des cartes"
                    value={customization?.services_card_description_color || "#6B7280"}
                    onChange={(v) => updateField('services_card_description_color', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Section À Propos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectionToggle
                  label="Afficher la section À propos"
                  checked={customization?.show_about_section ?? true}
                  onChange={(v) => updateField('show_about_section', v)}
                />
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="about_title">Titre</Label>
                  <Input
                    id="about_title"
                    value={customization?.about_title || ""}
                    onChange={(e) => updateField('about_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about_description">Description</Label>
                  <Textarea
                    id="about_description"
                    value={customization?.about_description || ""}
                    onChange={(e) => updateField('about_description', e.target.value)}
                    rows={3}
                  />
                </div>
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Couleurs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Fond de section"
                    value={customization?.about_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('about_background_color', v)}
                  />
                  <ColorPicker
                    label="Titre"
                    value={customization?.about_title_color || "#1F2937"}
                    onChange={(v) => updateField('about_title_color', v)}
                  />
                  <ColorPicker
                    label="Description"
                    value={customization?.about_description_color || "#6B7280"}
                    onChange={(v) => updateField('about_description_color', v)}
                  />
                  <ColorPicker
                    label="Fond de carte"
                    value={customization?.about_card_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('about_card_background_color', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Section Témoignages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectionToggle
                  label="Afficher la section Témoignages"
                  checked={customization?.show_testimonials_section ?? true}
                  onChange={(v) => updateField('show_testimonials_section', v)}
                />
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="testimonials_title">Titre</Label>
                  <Input
                    id="testimonials_title"
                    value={customization?.testimonials_title || ""}
                    onChange={(e) => updateField('testimonials_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonials_description">Description</Label>
                  <Textarea
                    id="testimonials_description"
                    value={customization?.testimonials_description || ""}
                    onChange={(e) => updateField('testimonials_description', e.target.value)}
                    rows={2}
                  />
                </div>
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Couleurs
                </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <ColorPicker
                 label="Fond de section"
                 value={customization?.testimonials_background_color || "#FFFFFF"}
                 onChange={(v) => updateField('testimonials_background_color', v)}
               />
               <ColorPicker
                 label="Titre"
                 value={customization?.testimonials_title_color || "#1F2937"}
                 onChange={(v) => updateField('testimonials_title_color', v)}
               />
               <ColorPicker
                 label="Description"
                 value={customization?.testimonials_description_color || "#6B7280"}
                 onChange={(v) => updateField('testimonials_description_color', v)}
               />
               <ColorPicker
                 label="Fond des cartes"
                 value={customization?.testimonials_card_background_color || "#FFFFFF"}
                 onChange={(v) => updateField('testimonials_card_background_color', v)}
               />
               <ColorPicker
                 label="Bordure des cartes"
                 value={customization?.testimonials_border_color || "#E5E7EB"}
                 onChange={(v) => updateField('testimonials_border_color', v)}
               />
             </div>
             <Separator />
             <div className="space-y-2">
               <Label>Image de la section Témoignages</Label>
               <Input 
                 type="file" 
                 accept="image/*"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     updateFileField('testimonials_image', file);
                     // Pour l'aperçu, on peut toujours utiliser FileReader
                     const reader = new FileReader();
                     reader.onloadend = () => {
                       updateField('testimonials_image', reader.result as string);
                     };
                     reader.readAsDataURL(file);
                   } else {
                     updateFileField('testimonials_image', null);
                     updateField('testimonials_image', null);
                   }
                 }}
               />
               {customization?.testimonials_image && (
                 <div className="mt-2">
                   <img 
                     src={customization.testimonials_image} 
                     alt="Aperçu Témoignages" 
                     className="max-h-40 rounded-lg" 
                   />
                 </div>
               )}
             </div>
           </CardContent>
         </Card>
       </TabsContent>

          {/* Blog Section */}
          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Section Blog
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectionToggle
                  label="Afficher la section Blog"
                  checked={customization?.show_blog_section ?? true}
                  onChange={(v) => updateField('show_blog_section', v)}
                />
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="blog_title">Titre</Label>
                  <Input
                    id="blog_title"
                    value={customization?.blog_title || ""}
                    onChange={(e) => updateField('blog_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog_description">Description</Label>
                  <Textarea
                    id="blog_description"
                    value={customization?.blog_description || ""}
                    onChange={(e) => updateField('blog_description', e.target.value)}
                    rows={2}
                  />
                </div>
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Couleurs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Fond de section"
                    value={customization?.blog_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('blog_background_color', v)}
                  />
                  <ColorPicker
                    label="Titre"
                    value={customization?.blog_title_color || "#1F2937"}
                    onChange={(v) => updateField('blog_title_color', v)}
                  />
                  <ColorPicker
                    label="Description"
                    value={customization?.blog_description_color || "#6B7280"}
                    onChange={(v) => updateField('blog_description_color', v)}
                  />
                  <ColorPicker
                    label="Fond des cartes"
                    value={customization?.blog_card_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('blog_card_background_color', v)}
                  />
                  <ColorPicker
                    label="Bordure des cartes"
                    value={customization?.blog_border_color || "#E5E7EB"}
                    onChange={(v) => updateField('blog_border_color', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Section */}
          <TabsContent value="partners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Section Partenaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectionToggle
                  label="Afficher la section Partenaires"
                  checked={customization?.show_partners_section ?? true}
                  onChange={(v) => updateField('show_partners_section', v)}
                />
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="partners_title">Titre</Label>
                  <Input
                    id="partners_title"
                    value={customization?.partners_title || ""}
                    onChange={(e) => updateField('partners_title', e.target.value)}
                  />
                </div>
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Couleurs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Fond de section"
                    value={customization?.partners_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('partners_background_color', v)}
                  />
                  <ColorPicker
                    label="Titre"
                    value={customization?.partners_title_color || "#1F2937"}
                    onChange={(v) => updateField('partners_title_color', v)}
                  />
                  <ColorPicker
                    label="Fond des cartes"
                    value={customization?.partners_card_background_color || "#FFFFFF"}
                    onChange={(v) => updateField('partners_card_background_color', v)}
                  />
                  <ColorPicker
                    label="Bordure des cartes"
                    value={customization?.partners_border_color || "#E5E7EB"}
                    onChange={(v) => updateField('partners_border_color', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CTA Section */}
          <TabsContent value="cta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Section Call-to-Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectionToggle
                  label="Afficher la section CTA"
                  checked={customization?.show_cta_section ?? true}
                  onChange={(v) => updateField('show_cta_section', v)}
                />
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="cta_title">Titre</Label>
                  <Input
                    id="cta_title"
                    value={customization?.cta_title || ""}
                    onChange={(e) => updateField('cta_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_description">Description</Label>
                  <Textarea
                    id="cta_description"
                    value={customization?.cta_description || ""}
                    onChange={(e) => updateField('cta_description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta_button_text">Texte du bouton</Label>
                    <Input
                      id="cta_button_text"
                      value={customization?.cta_button_text || ""}
                      onChange={(e) => updateField('cta_button_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_button_link">Lien du bouton</Label>
                    <Input
                      id="cta_button_link"
                      value={customization?.cta_button_link || ""}
                      onChange={(e) => updateField('cta_button_link', e.target.value)}
                    />
                  </div>
                </div>
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Couleurs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Fond de section"
                    value={customization?.cta_background_color || "#1E40AF"}
                    onChange={(v) => updateField('cta_background_color', v)}
                  />
                  <ColorPicker
                    label="Titre"
                    value={customization?.cta_title_color || "#FFFFFF"}
                    onChange={(v) => updateField('cta_title_color', v)}
                  />
                  <ColorPicker
                    label="Description"
                    value={customization?.cta_description_color || "#E5E7EB"}
                    onChange={(v) => updateField('cta_description_color', v)}
                  />
                  <ColorPicker
                    label="Couleur du bouton"
                    value={customization?.cta_button_primary_color || "#F59E0B"}
                    onChange={(v) => updateField('cta_button_primary_color', v)}
                  />
                  <ColorPicker
                    label="Texte du bouton"
                    value={customization?.cta_button_text_color || "#000000"}
                    onChange={(v) => updateField('cta_button_text_color', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}