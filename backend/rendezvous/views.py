from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import RendezVous
from .serializers import RendezVousSerializer, RendezVousAdminSerializer


class RendezVousCreateView(generics.CreateAPIView):
    """Créer une nouvelle demande de rendez-vous (public)"""
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # TODO: Envoyer email de confirmation
        # send_rdv_confirmation_email(serializer.instance)
        
        return Response(
            {'message': 'Votre demande de rendez-vous a été envoyée. Nous vous confirmerons la date rapidement.'},
            status=status.HTTP_201_CREATED
        )


class RendezVousListView(generics.ListAPIView):
    """Lister tous les rendez-vous (admin seulement)"""
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousAdminSerializer
    permission_classes = [permissions.IsAdminUser]


class RendezVousDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir, modifier ou supprimer un rendez-vous (admin seulement)"""
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousAdminSerializer
    permission_classes = [permissions.IsAdminUser]
