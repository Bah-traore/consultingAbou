from rest_framework import serializers
from .models import SiteCustomization, Slide
import json

class SlideSerializer(serializers.ModelSerializer):
    """Serializer pour les slides du diaporama"""
    
    slideshow_colors = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)
    
    def get_slideshow_colors(self, obj):
        try:
            return json.loads(obj.slideshow_colors) if obj.slideshow_colors else {}
        except:
            return {}
    
    def update(self, instance, validated_data):
        # Si aucune nouvelle image n'est fournie, garder l'image existante
        if 'image' not in validated_data:
            validated_data['image'] = instance.image
        return super().update(instance, validated_data)
    
    class Meta:
        model = Slide
        fields = [
            'id', 'title', 'subtitle', 'image', 'order', 'overlay_opacity', 
            'title_position', 'image_fit', 'is_active', 
            # Configuration globale du diaporama
            'slideshow_autoplay_delay', 'slideshow_title_color', 
            'slideshow_subtitle_color', 'slideshow_overlay_color', 
            'slideshow_background_color', 'slideshow_colors',
            # Personnalisation visuelle par slide
            'slide_background_color', 'slide_title_color', 'slide_subtitle_color',
            'slide_overlay_color', 'slide_content_background_color',
            'slide_content_border_color', 'slide_content_border_radius',
            'slide_content_padding', 'slide_show_border',
            # Champs de dispositif de texte additionnels
            'slide_content_text', 'slide_badge_text', 'slide_badge_color',
            'slide_button_text', 'slide_button_link', 'slide_button_color',
            'slide_button_text_color',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class SiteCustomizationSerializer(serializers.ModelSerializer):
    """Serializer pour la personnalisation du site"""
    
    # Champs JSON personnalisés
    hero_colors = serializers.SerializerMethodField()
    services_colors = serializers.SerializerMethodField()
    about_colors = serializers.SerializerMethodField()
    partners_colors = serializers.SerializerMethodField()
    testimonials_colors = serializers.SerializerMethodField()
    blog_colors = serializers.SerializerMethodField()
    cta_colors = serializers.SerializerMethodField()
    
    # Champs d'images
    services_image = serializers.ImageField(required=False, allow_null=True)
    about_image = serializers.ImageField(required=False, allow_null=True)
    testimonials_image = serializers.ImageField(required=False, allow_null=True)
    
    def _parse_json(self, value):
        try:
            return json.loads(value) if value else {}
        except:
            return {}
    
    def get_hero_colors(self, obj):
        return self._parse_json(obj.hero_colors)
    
    def get_services_colors(self, obj):
        return self._parse_json(obj.services_colors)
    
    def get_about_colors(self, obj):
        return self._parse_json(obj.about_colors)
    
    def get_partners_colors(self, obj):
        return self._parse_json(obj.partners_colors)
    
    def get_testimonials_colors(self, obj):
        return self._parse_json(obj.testimonials_colors)
    
    def get_blog_colors(self, obj):
        return self._parse_json(obj.blog_colors)
    
    def get_cta_colors(self, obj):
        return self._parse_json(obj.cta_colors)
    
    def get_services_image(self, obj):
        return obj.services_image.url if obj.services_image else None
    
    def get_about_image(self, obj):
        return obj.about_image.url if obj.about_image else None
    
    def get_testimonials_image(self, obj):
        return obj.testimonials_image.url if obj.testimonials_image else None
    
    class Meta:
        model = SiteCustomization
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']