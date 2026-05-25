from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Contact
from .serializers import ContactSerializer, ContactAdminSerializer


class ContactCreateView(generics.CreateAPIView):
    """Créer une nouvelle demande de contact (public)"""
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # TODO: Envoyer email de notification à l'admin
        # send_contact_email(serializer.instance)
        
        return Response(
            {'message': 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.'},
            status=status.HTTP_201_CREATED
        )


class ContactListView(generics.ListAPIView):
    """Lister tous les contacts (admin seulement)"""
    queryset = Contact.objects.all()
    serializer_class = ContactAdminSerializer
    permission_classes = [permissions.IsAdminUser]


class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir, modifier ou supprimer un contact (admin seulement)"""
    queryset = Contact.objects.all()
    serializer_class = ContactAdminSerializer
    permission_classes = [permissions.IsAdminUser]
