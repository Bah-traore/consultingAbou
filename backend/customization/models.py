from django.db import models
import json
from utilitaire.r2_storage import R2PublicMediaStorage


class Slide(models.Model):
    """Modèle pour les slides du diaporama"""
    
    title = models.CharField(
        max_length=200,
        verbose_name='Titre du slide'
    )
    subtitle = models.CharField(
        max_length=500,
        verbose_name='Sous-titre du slide'
    )
    image = models.ImageField(
        upload_to='slides/',
        verbose_name='Image du slide',
        storage=R2PublicMediaStorage()
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text='Ordre d\'affichage (0 = premier)',
        verbose_name='Ordre'
    )
    overlay_opacity = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.70,
        help_text='Opacité du fond sombre sur l\'image (0.0 à 1.0)',
        verbose_name='Opacité overlay'
    )
    title_position = models.CharField(
        max_length=20,
        default='center',
        choices=[
            ('top-left', 'Haut Gauche'),
            ('top-center', 'Haut Centre'),
            ('top-right', 'Haut Droite'),
            ('center-left', 'Centre Gauche'),
            ('center', 'Centre'),
            ('center-right', 'Centre Droite'),
            ('bottom-left', 'Bas Gauche'),
            ('bottom-center', 'Bas Centre'),
            ('bottom-right', 'Bas Droite'),
        ],
        verbose_name='Position du titre'
    )
    image_fit = models.CharField(
        max_length=20,
        default='contain',
        choices=[
            ('contain', 'Contenir (sans déformer)'),
            ('cover', 'Couvrir (remplir)'),
            ('fill', 'Remplir (étirer)'),
        ],
        verbose_name='Mode d\'affichage de l\'image'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Actif'
    )
    # Personnalisation visuelle par slide
    slide_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de secours si pas d\'image (format hex: #FFFFFF)',
        verbose_name='Couleur de fond'
    )
    slide_title_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du titre du slide (format hex: #FFFFFF)',
        verbose_name='Couleur du titre'
    )
    slide_subtitle_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du sous-titre du slide (format hex: #FFFFFF)',
        verbose_name='Couleur du sous-titre'
    )
    slide_overlay_color = models.CharField(
        max_length=50,
        default='rgba(0, 0, 0, 0.7)',
        help_text='Couleur de l\'overlay sur l\'image (ex: rgba(0, 0, 0, 0.7))',
        verbose_name='Couleur de l\'overlay'
    )
    slide_content_background_color = models.CharField(
        max_length=50,
        default='rgba(0, 0, 0, 0.4)',
        help_text='Couleur de fond du conteneur de texte (ex: rgba(0, 0, 0, 0.4))',
        verbose_name='Couleur fond contenu'
    )
    slide_content_border_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text='Couleur de bordure du conteneur de texte (format hex: #3B82F6)',
        verbose_name='Couleur de bordure'
    )
    slide_content_border_radius = models.PositiveIntegerField(
        default=16,
        help_text='Rayon de.border arrondi en pixels',
        verbose_name='Border radius (px)'
    )
    slide_content_padding = models.PositiveIntegerField(
        default=24,
        help_text='Padding du conteneur de texte en pixels',
        verbose_name='Padding (px)'
    )
    slide_show_border = models.BooleanField(
        default=False,
        verbose_name='Afficher la bordure'
    )
    # Champs de dispositif de texte additionnels
    slide_content_text = models.TextField(
        blank=True,
        max_length=1000,
        help_text='Texte de contenu principal du slide',
        verbose_name='Texte de contenu'
    )
    slide_badge_text = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text='Texte du badge/étiquette du slide',
        verbose_name='Texte du badge'
    )
    slide_badge_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text='Couleur de fond du badge (format hex: #3B82F6)',
        verbose_name='Couleur du badge'
    )
    slide_button_text = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text='Texte du bouton d\'action',
        verbose_name='Texte du bouton'
    )
    slide_button_link = models.CharField(
        max_length=200,
        blank=True,
        default='',
        help_text='Lien du bouton d\'action',
        verbose_name='Lien du bouton'
    )
    slide_button_color = models.CharField(
        max_length=7,
        default='#1E40AF',
        help_text='Couleur de fond du bouton (format hex: #1E40AF)',
        verbose_name='Couleur du bouton'
    )
    slide_button_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du texte du bouton (format hex: #FFFFFF)',
        verbose_name='Couleur texte bouton'
    )
    # Configuration du diaporama
    slideshow_autoplay_delay = models.PositiveIntegerField(
        default=3500,
        help_text='Délai entre les slides en millisecondes',
        verbose_name='Délai autoplay (ms)'
    )
    slideshow_title_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du titre du slide (format hex: #FFFFFF)',
        verbose_name='Couleur titre'
    )
    slideshow_subtitle_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du sous-titre du slide (format hex: #FFFFFF)',
        verbose_name='Couleur sous-titre'
    )
    slideshow_overlay_color = models.CharField(
        max_length=50,
        default='rgba(0, 0, 0, 0.7)',
        help_text='Couleur de l\'overlay (ex: rgba(0, 0, 0, 0.7))',
        verbose_name='Couleur overlay'
    )
    slideshow_background_color = models.CharField(
        max_length=50,
        default='rgba(0, 0, 0, 0.4)',
        help_text='Couleur de fond du contenu (ex: rgba(0, 0, 0, 0.4))',
        verbose_name='Couleur fond contenu'
    )
    slideshow_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs du diaporama en JSON (optionnel)',
        verbose_name='Couleurs avancées (JSON - optionnel)'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')

    class Meta:
        verbose_name = 'Slide'
        verbose_name_plural = 'Slides'
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.title} (Ordre: {self.order})"


class SiteCustomization(models.Model):
    """Modèle pour la personnalisation visuelle du site"""
    
    # Section Couleurs
    primary_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text='Couleur principale (format hex: #3B82F6)',
        verbose_name='Couleur principale'
    )
    secondary_color = models.CharField(
        max_length=7,
        default='#8B5CF6',
        help_text='Couleur secondaire (format hex: #8B5CF6)',
        verbose_name='Couleur secondaire'
    )
    accent_color = models.CharField(
        max_length=7,
        default='#F59E0B',
        help_text='Couleur d\'accentuation (format hex: #F59E0B)',
        verbose_name='Couleur d\'accentuation'
    )
    background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond (format hex: #FFFFFF)',
        verbose_name='Couleur de fond'
    )
    text_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du texte (format hex: #1F2937)',
        verbose_name='Couleur du texte'
    )
    
    # Section Hero/Accueil
    hero_title = models.CharField(
        max_length=200,
        default='Bienvenue chez Abou Bah Consulting',
        verbose_name='Titre principal (Hero)'
    )
    hero_subtitle = models.TextField(
        max_length=500,
        default='Cabinet de consultation pédagogique spécialisé dans la formation et le coaching',
        verbose_name='Sous-titre (Hero)'
    )
    hero_background_image = models.ImageField(
        upload_to='customization/hero/',
        blank=True,
        null=True,
        verbose_name='Image de fond Hero',
        storage=R2PublicMediaStorage()
    )
    hero_button_text = models.CharField(
        max_length=100,
        default='Prendre rendez-vous',
        verbose_name='Texte du bouton Hero'
    )
    hero_button_link = models.CharField(
        max_length=200,
        default='/contact',
        verbose_name='Lien du bouton Hero'
    )
    hero_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section Hero en JSON (optionnel)',
        verbose_name='Couleurs avancées (JSON - optionnel)'
    )
    
    # Couleurs individuelles Hero (pour non-techniciens)
    hero_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre principal (format hex: #1F2937)',
        verbose_name='Couleur titre principal'
    )
    hero_subtitle_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur du sous-titre (format hex: #6B7280)',
        verbose_name='Couleur sous-titre'
    )
    hero_button_primary_color = models.CharField(
        max_length=7,
        default='#1e3a5f',
        help_text='Couleur de fond du bouton principal (format hex: #1e3a5f)',
        verbose_name='Couleur fond bouton principal'
    )
    hero_button_primary_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du texte du bouton principal (format hex: #FFFFFF)',
        verbose_name='Couleur texte bouton principal'
    )
    hero_button_secondary_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond du bouton secondaire (format hex: #FFFFFF)',
        verbose_name='Couleur fond bouton secondaire'
    )
    hero_button_secondary_text_color = models.CharField(
        max_length=7,
        default='#1e3a5f',
        help_text='Couleur du texte du bouton secondaire (format hex: #1e3a5f)',
        verbose_name='Couleur texte bouton secondaire'
    )
    hero_button_border_color = models.CharField(
        max_length=7,
        default='#1e3a5f',
        help_text='Couleur de bordure du bouton secondaire (format hex: #1e3a5f)',
        verbose_name='Couleur bordure bouton secondaire'
    )
    hero_badge_background_color = models.CharField(
        max_length=7,
        default='#F59E0B',
        help_text='Couleur de fond des badges (format hex: #F59E0B)',
        verbose_name='Couleur fond badges'
    )
    hero_badge_text_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du texte des badges (format hex: #1F2937)',
        verbose_name='Couleur texte badges'
    )
    hero_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond des cartes (format hex: #FFFFFF)',
        verbose_name='Couleur fond cartes'
    )
    hero_card_border_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text='Couleur de bordure des cartes (format hex: #3B82F6)',
        verbose_name='Couleur bordure cartes'
    )
    hero_card_title_color = models.CharField(
        max_length=7,
        default='#9CA3AF',
        help_text='Couleur des titres des cartes (format hex: #9CA3AF)',
        verbose_name='Couleur titre cartes'
    )
    hero_card_value_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur des valeurs des cartes (format hex: #1F2937)',
        verbose_name='Couleur valeur cartes'
    )
    
    # Section Image Hero (côté droit)
    hero_image = models.ImageField(
        upload_to='customization/hero/',
        blank=True,
        null=True,
        verbose_name='Image Hero (côté droit)',
        storage=R2PublicMediaStorage()
    )
    hero_image_badge_text = models.CharField(
        max_length=200,
        default='Conseil & accompagnement',
        verbose_name='Texte badge sur l\'image'
    )
    hero_image_badge_description = models.CharField(
        max_length=300,
        default='Langue française • Présentations • Coaching',
        verbose_name='Description sous le badge'
    )
    hero_image_badge_color = models.CharField(
        max_length=7,
        default='#1E3A8A',
        help_text='Couleur de fond du badge (format hex: #1E3A8A)',
        verbose_name='Couleur fond badge'
    )
    hero_image_badge_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du texte du badge (format hex: #FFFFFF)',
        verbose_name='Couleur texte badge'
    )
    hero_image_badge_icon = models.ImageField(
        upload_to='customization/hero/',
        blank=True,
        null=True,
        verbose_name='Icône du badge (optionnel)',
        storage=R2PublicMediaStorage()
    )
    hero_badge_1_text = models.CharField(
        max_length=100,
        default='Conseil • Formation • Coaching',
        verbose_name='Texte Badge 1'
    )
    hero_badge_2_text = models.CharField(
        max_length=100,
        default='Méthode • Rigueur • Impact',
        verbose_name='Texte Badge 2'
    )
    
    # Cartes informatives sous le hero (3 cartes)
    hero_card_1_title = models.CharField(
        max_length=100,
        default='Positionnement',
        verbose_name='Titre Carte 1'
    )
    hero_card_1_value = models.CharField(
        max_length=100,
        default='Pragmatique & exigeant',
        verbose_name='Valeur Carte 1'
    )
    hero_card_2_title = models.CharField(
        max_length=100,
        default='Public',
        verbose_name='Titre Carte 2'
    )
    hero_card_2_value = models.CharField(
        max_length=100,
        default='Particuliers & organisations',
        verbose_name='Valeur Carte 2'
    )
    hero_card_3_title = models.CharField(
        max_length=100,
        default='Format',
        verbose_name='Titre Carte 3'
    )
    hero_card_3_value = models.CharField(
        max_length=100,
        default='Sur mesure',
        verbose_name='Valeur Carte 3'
    )
    
    # Section Services
    services_title = models.CharField(
        max_length=200,
        default='Des services conçus pour produire un vrai changement',
        verbose_name='Titre section Services'
    )
    services_description = models.TextField(
        max_length=500,
        default='Chaque prestation combine méthode, clarté et mise en pratique. L\'objectif est simple: renforcer vos compétences et rendre vos livrables irréprochables.',
        verbose_name='Description section Services'
    )
    services_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section Services en JSON (optionnel)',
        verbose_name='Couleurs avancées (JSON - optionnel)'
    )
    
    # Couleurs individuelles Services (pour non-techniciens)
    services_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre de la section (format hex: #1F2937)',
        verbose_name='Couleur titre'
    )
    services_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de la description (format hex: #6B7280)',
        verbose_name='Couleur description'
    )
    services_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la section (format hex: #FFFFFF)',
        verbose_name='Couleur fond'
    )
    services_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond des cartes de services (format hex: #FFFFFF)',
        verbose_name='Couleur fond cartes'
    )
    services_card_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur des titres des cartes (format hex: #1F2937)',
        verbose_name='Couleur titre cartes'
    )
    services_card_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur des descriptions des cartes (format hex: #6B7280)',
        verbose_name='Couleur description cartes'
    )
    
    # Section À propos
    show_about_section = models.BooleanField(
        default=True,
        verbose_name='Afficher la section À propos'
    )
    about_title = models.CharField(
        max_length=200,
        default='À propos de nous',
        verbose_name='Titre section À propos'
    )
    about_description = models.TextField(
        default='Abou Bah Consulting est un cabinet de consultation pédagogique dédié à l\'excellence éducative.',
        verbose_name='Description section À propos'
    )
    about_image = models.ImageField(
        upload_to='customization/about/',
        blank=True,
        null=True,
        verbose_name='Image section À propos',
        storage=R2PublicMediaStorage()
    )
    about_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section À propos en JSON (optionnel)',
        verbose_name='Couleurs avancées (JSON - optionnel)'
    )
    
    # Couleurs individuelles À propos (pour non-techniciens)
    about_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre (format hex: #1F2937)',
        verbose_name='Couleur titre'
    )
    about_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de la description (format hex: #6B7280)',
        verbose_name='Couleur description'
    )
    about_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la section (format hex: #FFFFFF)',
        verbose_name='Couleur fond'
    )
    about_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la carte (format hex: #FFFFFF)',
        verbose_name='Couleur fond carte'
    )
    
    # Affichage et disposition
    # Section Partenaires
    show_partners_section = models.BooleanField(
        default=True,
        verbose_name='Afficher la section Partenaires'
    )
    partners_title = models.CharField(
        max_length=200,
        default='Nos partenaires',
        verbose_name='Titre section Partenaires'
    )
    partners_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la section Partenaires (ex: #FFFFFF)',
        verbose_name='Couleur fond Partenaires'
    )
    partners_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre Partenaires (ex: #1F2937)',
        verbose_name='Couleur titre Partenaires'
    )
    partners_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond des cartes partenaires (ex: #FFFFFF)',
        verbose_name='Couleur fond carte partenaire'
    )
    partners_border_color = models.CharField(
        max_length=7,
        default='#E5E7EB',
        help_text='Couleur de bordure des cartes partenaires (ex: #E5E7EB)',
        verbose_name='Couleur bordure carte partenaire'
    )
    partners_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section Partenaires en JSON',
        verbose_name='Couleurs Partenaires avancées (JSON)'
    )
    # Section Témoignages
    show_testimonials_section = models.BooleanField(
        default=True,
        verbose_name='Afficher la section Témoignages'
    )
    testimonials_title = models.CharField(
        max_length=200,
        default='Ce que disent nos clients',
        verbose_name='Titre section Témoignages'
    )
    testimonials_description = models.TextField(
        max_length=500,
        default='Découvrez les retours de nos clients satisfaits',
        verbose_name='Description section Témoignages'
    )
    testimonials_image = models.ImageField(
        upload_to='customization/testimonials/',
        blank=True,
        null=True,
        verbose_name='Image section Témoignages',
        storage=R2PublicMediaStorage()
    )
    testimonials_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la section Témoignages (ex: #FFFFFF)',
        verbose_name='Couleur fond Témoignages'
    )
    testimonials_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre Témoignages (ex: #1F2937)',
        verbose_name='Couleur titre Témoignages'
    )
    testimonials_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de la description Témoignages (ex: #6B7280)',
        verbose_name='Couleur description Témoignages'
    )
    testimonials_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond des cartes témoignages (ex: #FFFFFF)',
        verbose_name='Couleur fond carte témoignage'
    )
    testimonials_border_color = models.CharField(
        max_length=7,
        default='#E5E7EB',
        help_text='Couleur de bordure des cartes témoignages (ex: #E5E7EB)',
        verbose_name='Couleur bordure carte témoignage'
    )
    testimonials_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section Témoignages en JSON',
        verbose_name='Couleurs Témoignages avancées (JSON)'
    )
    # Section Blog
    show_blog_section = models.BooleanField(
        default=True,
        verbose_name='Afficher la section Blog sur la page d\'accueil'
    )
    blog_title = models.CharField(
        max_length=200,
        default='Derniers articles',
        verbose_name='Titre section Blog'
    )
    blog_description = models.TextField(
        max_length=500,
        default='Consultez nos derniers articles et actualités',
        verbose_name='Description section Blog'
    )
    blog_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la section Blog (ex: #FFFFFF)',
        verbose_name='Couleur fond Blog'
    )
    blog_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre Blog (ex: #1F2937)',
        verbose_name='Couleur titre Blog'
    )
    blog_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de la description Blog (ex: #6B7280)',
        verbose_name='Couleur description Blog'
    )
    blog_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond des cartes articles (ex: #FFFFFF)',
        verbose_name='Couleur fond carte article'
    )
    blog_border_color = models.CharField(
        max_length=7,
        default='#E5E7EB',
        help_text='Couleur de bordure des cartes articles (ex: #E5E7EB)',
        verbose_name='Couleur bordure carte article'
    )
    blog_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section Blog en JSON',
        verbose_name='Couleurs Blog avancées (JSON)'
    )
    items_per_page = models.PositiveIntegerField(
        default=6,
        help_text='Nombre d\'éléments à afficher par page (services, articles, etc.)',
        verbose_name='Éléments par page'
    )
    
    # Section Call-to-Action
    show_cta_section = models.BooleanField(
        default=True,
        verbose_name='Afficher la section CTA sur la page d\'accueil'
    )
    cta_title = models.CharField(
        max_length=200,
        default='Prêt à démarrer ?',
        verbose_name='Titre section CTA'
    )
    cta_description = models.TextField(
        max_length=500,
        default='Contactez-nous dès aujourd\'hui pour discuter de vos besoins',
        verbose_name='Description section CTA'
    )
    cta_button_text = models.CharField(
        max_length=100,
        default='Contactez-nous',
        verbose_name='Texte bouton CTA'
    )
    cta_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la carte CTA (ex: #FFFFFF)',
        verbose_name='Couleur fond CTA'
    )
    cta_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre CTA (ex: #1F2937)',
        verbose_name='Couleur titre CTA'
    )
    cta_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de la description CTA (ex: #6B7280)',
        verbose_name='Couleur description CTA'
    )
    cta_button_primary_color = models.CharField(
        max_length=7,
        default='#1E40AF',
        help_text='Couleur du bouton principal CTA (ex: #1E40AF)',
        verbose_name='Couleur bouton principal CTA'
    )
    cta_button_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du texte du bouton CTA (ex: #FFFFFF)',
        verbose_name='Couleur texte bouton CTA'
    )
    cta_colors = models.TextField(
        default='{}',
        blank=True,
        help_text='Configuration avancée des couleurs de la section CTA en JSON',
        verbose_name='Couleurs CTA avancées (JSON)'
    )
    
    # Réseaux sociaux
    facebook_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL Facebook'
    )
    twitter_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL Twitter/X'
    )
    linkedin_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL LinkedIn'
    )
    instagram_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL Instagram'
    )
    youtube_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL YouTube'
    )
    
    # Contact
    contact_email = models.EmailField(
        default='contact@aboubah-consulting.com',
        verbose_name='Email de contact'
    )
    contact_phone = models.CharField(
        max_length=20,
        default='+223 XX XX XX XX',
        verbose_name='Téléphone de contact'
    )
    contact_address = models.TextField(
        default='Bamako, Mali',
        verbose_name='Adresse physique'
    )
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')
    is_active = models.BooleanField(
        default=True,
        verbose_name='Configuration active'
    )

    class Meta:
        verbose_name = 'Personnalisation du site'
        verbose_name_plural = 'Personnalisation du site'
        ordering = ['-created_at']

    def __str__(self):
        return f"Personnalisation - {self.created_at.strftime('%d/%m/%Y')}"
    
    def save(self, *args, **kwargs):
        # S'assurer qu'il n'y a qu'une seule configuration active
        if self.is_active:
            SiteCustomization.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)
