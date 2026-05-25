from rest_framework import generics, permissions
from .models import Partenaire
from .serializers import PartenaireSerializer


class PartenaireListView(generics.ListAPIView):
    """Lister tous les partenaires actifs (public)"""
    queryset = Partenaire.objects.filter(is_active=True)
    serializer_class = PartenaireSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class PartenaireAdminListView(generics.ListCreateAPIView):
    """Lister et créer des partenaires (admin seulement)"""
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer
    permission_classes = [permissions.IsAdminUser]


class PartenaireAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir, modifier ou supprimer un partenaire (admin seulement)"""
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer
    permission_classes = [permissions.IsAdminUser]
