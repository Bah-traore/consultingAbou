from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import SiteCustomization, Slide
from .serializers import SiteCustomizationSerializer, SlideSerializer


class SiteCustomizationView(generics.RetrieveAPIView):
    """Récupérer la personnalisation active du site (public)"""
    serializer_class = SiteCustomizationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def get_object(self):
        # Retourner la configuration active
        customization = SiteCustomization.objects.filter(is_active=True).first()
        if not customization:
            # Si aucune configuration n'existe, créer une configuration par défaut
            customization = SiteCustomization.objects.create(
                is_active=True,
                hero_title='Bienvenue chez Abou Bah Consulting',
                hero_subtitle='Cabinet de consultation pédagogique spécialisé dans la formation et le coaching',
            )
        return customization


class SiteCustomizationAdminView(generics.RetrieveUpdateAPIView):
    """Voir et modifier la personnalisation du site (admin seulement)"""
    serializer_class = SiteCustomizationSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_object(self):
        return SiteCustomization.objects.filter(is_active=True).first()


class SlideListView(generics.ListAPIView):
    """API endpoint pour récupérer les slides actifs du diaporama"""
    serializer_class = SlideSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def get_queryset(self):
        return Slide.objects.filter(is_active=True).order_by('order')
