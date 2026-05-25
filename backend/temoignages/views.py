from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Temoignage
from .serializers import TemoignageSerializer, TemoignageAdminSerializer


class TemoignageCreateView(generics.CreateAPIView):
    """Créer un nouveau témoignage (public)"""
    queryset = Temoignage.objects.all()
    serializer_class = TemoignageSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {'message': 'Merci pour votre témoignage ! Il sera publié après validation.'},
            status=status.HTTP_201_CREATED
        )


class TemoignageListView(generics.ListAPIView):
    """Lister les témoignages approuvés (public)"""
    serializer_class = TemoignageSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return Temoignage.objects.filter(status='approved', is_featured=True)[:10]


class TemoignageAdminListView(generics.ListAPIView):
    """Lister tous les témoignages (admin seulement)"""
    queryset = Temoignage.objects.all()
    serializer_class = TemoignageAdminSerializer
    permission_classes = [permissions.IsAdminUser]


class TemoignageAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir, modifier ou supprimer un témoignage (admin seulement)"""
    queryset = Temoignage.objects.all()
    serializer_class = TemoignageAdminSerializer
    permission_classes = [permissions.IsAdminUser]
