from rest_framework import generics, permissions
from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    """Lister tous les services actifs (public)"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class ServiceDetailView(generics.RetrieveAPIView):
    """Voir un service spécifique (public)"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class ServiceAdminListView(generics.ListCreateAPIView):
    """Lister et créer des services (admin seulement)"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]


class ServiceAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir, modifier ou supprimer un service (admin seulement)"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def perform_update(self, serializer):
        # Gérer le téléchargement d'image
        if 'image' in self.request.FILES:
            serializer.save(image=self.request.FILES['image'])
        else:
            serializer.save()
