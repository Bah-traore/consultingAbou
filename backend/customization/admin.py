from django.contrib import admin
from django import forms
from .models import SiteCustomization, Slide
import json


@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'image_fit', 'is_active', 'slideshow_autoplay_delay', 'created_at']
    list_filter = ['is_active', 'image_fit', 'title_position']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'subtitle']
    readonly_fields = ['created_at', 'updated_at']
    
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'slideshow_colors':
            kwargs['widget'] = forms.Textarea(attrs={'rows': 6, 'cols': 80, 'placeholder': '{\n  "title_color": "#FFFFFF",\n  "subtitle_color": "#FFFFFF"\n}'})
        return super().formfield_for_dbfield(db_field, request, **kwargs)
    
    fieldsets = (
        ('Contenu du Slide', {
            'fields': (
                'title',
                'subtitle',
                'image',
            ),
        }),
        ('Configuration du Slide', {
            'fields': (
                'order',
                'overlay_opacity',
                'title_position',
                'image_fit',
            ),
        }),
        ('Configuration du Diaporama', {
            'fields': (
                'slideshow_autoplay_delay',
                ('slideshow_title_color', 'slideshow_subtitle_color'),
                ('slideshow_overlay_color', 'slideshow_background_color'),
                'slideshow_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs du diaporama. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Statut', {
            'fields': (
                'is_active',
            ),
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )


@admin.register(SiteCustomization)
class SiteCustomizationAdmin(admin.ModelAdmin):
    list_display = ['created_at', 'updated_at', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    
    formfield_overrides = {
        # Utiliser un textarea pour les champs JSON
    }
    
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in ['hero_colors', 'services_colors', 'about_colors', 'partners_colors', 'testimonials_colors', 'blog_colors', 'cta_colors']:
            kwargs['widget'] = forms.Textarea(attrs={'rows': 6, 'cols': 80, 'placeholder': '{\n  "title_color": "#1F2937",\n  "subtitle_color": "#6B7280"\n}'})
        return super().formfield_for_dbfield(db_field, request, **kwargs)
    
    fieldsets = (
        ('Couleurs Globales', {
            'fields': (
                'primary_color',
                'secondary_color',
                'accent_color',
                'background_color',
                'text_color',
            ),
            'classes': ('wide',),
            'description': 'Couleurs globales du site (utilisées comme fallback)'
        }),
        ('Section Hero/Accueil', {
            'fields': (
                'hero_title',
                'hero_subtitle',
                'hero_background_image',
                'hero_button_text',
                'hero_button_link',
                'hero_badge_1_text',
                'hero_badge_2_text',
                ('hero_card_1_title', 'hero_card_1_value'),
                ('hero_card_2_title', 'hero_card_2_value'),
                ('hero_card_3_title', 'hero_card_3_value'),
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section Hero'
        }),
        ('Couleurs Section Hero', {
            'fields': (
                ('hero_title_color', 'hero_subtitle_color'),
                ('hero_button_primary_color', 'hero_button_primary_text_color'),
                ('hero_button_secondary_color', 'hero_button_secondary_text_color'),
                'hero_button_border_color',
                ('hero_badge_background_color', 'hero_badge_text_color'),
                ('hero_card_background_color', 'hero_card_border_color'),
                ('hero_card_title_color', 'hero_card_value_color'),
                'hero_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section Hero. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Image Hero (côté droit)', {
            'fields': (
                'hero_image',
                'hero_image_badge_text',
                'hero_image_badge_description',
                ('hero_image_badge_color', 'hero_image_badge_text_color'),
                'hero_image_badge_icon',
            ),
            'classes': ('wide',),
            'description': 'Configurez l\'image et le badge qui s\'affiche à droite de la section Hero'
        }),
        ('Section Services', {
            'fields': (
                'services_title',
                'services_description',
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section Services'
        }),
        ('Couleurs Section Services', {
            'fields': (
                ('services_title_color', 'services_description_color'),
                'services_background_color',
                ('services_card_background_color', 'services_card_title_color'),
                'services_card_description_color',
                'services_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section Services. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Section À propos', {
            'fields': (
                'show_about_section',
                'about_title',
                'about_description',
                'about_image',
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section À propos'
        }),
        ('Couleurs Section À propos', {
            'fields': (
                ('about_title_color', 'about_description_color'),
                'about_background_color',
                'about_card_background_color',
                'about_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section À propos. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Section Partenaires', {
            'fields': (
                'show_partners_section',
                'partners_title',
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section Partenaires'
        }),
        ('Couleurs Section Partenaires', {
            'fields': (
                'partners_background_color',
                'partners_title_color',
                'partners_card_background_color',
                'partners_border_color',
                'partners_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section Partenaires. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Section Témoignages', {
            'fields': (
                'show_testimonials_section',
                'testimonials_title',
                'testimonials_description',
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section Témoignages'
        }),
        ('Couleurs Section Témoignages', {
            'fields': (
                'testimonials_background_color',
                'testimonials_title_color',
                'testimonials_description_color',
                'testimonials_card_background_color',
                'testimonials_border_color',
                'testimonials_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section Témoignages. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Section Blog', {
            'fields': (
                'show_blog_section',
                'blog_title',
                'blog_description',
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section Blog'
        }),
        ('Couleurs Section Blog', {
            'fields': (
                'blog_background_color',
                'blog_title_color',
                'blog_description_color',
                'blog_card_background_color',
                'blog_border_color',
                'blog_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section Blog. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Section Call-to-Action', {
            'fields': (
                'show_cta_section',
                'cta_title',
                'cta_description',
                'cta_button_text',
            ),
            'classes': ('wide',),
            'description': 'Configuration du contenu de la section CTA'
        }),
        ('Couleurs Section Call-to-Action', {
            'fields': (
                'cta_background_color',
                'cta_title_color',
                'cta_description_color',
                'cta_button_primary_color',
                'cta_button_text_color',
                'cta_colors',
            ),
            'classes': ('wide',),
            'description': 'Configurez les couleurs de la section CTA. Les champs ci-dessus sont pour les utilisateurs, le JSON ci-dessous est pour les utilisateurs avancés.'
        }),
        ('Paramètres généraux', {
            'fields': (
                'items_per_page',
            ),
            'classes': ('wide',),
        }),
        ('Réseaux sociaux', {
            'fields': (
                'facebook_url',
                'twitter_url',
                'linkedin_url',
                'instagram_url',
                'youtube_url',
            ),
            'classes': ('collapse',),
            'description': 'Liens vers vos réseaux sociaux'
        }),
        ('Informations de contact', {
            'fields': (
                'contact_email',
                'contact_phone',
                'contact_address',
            ),
            'classes': ('wide',),
        }),
        ('Statut', {
            'fields': ('is_active',),
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    def has_add_permission(self, request):
        # Empêcher l'ajout de plusieurs configurations
        if SiteCustomization.objects.count() >= 1:
            return False
        return super().has_add_permission(request)
