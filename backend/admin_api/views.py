"""
Views pour l'interface Admin React
Fournit des endpoints REST complets pour la gestion admin
"""

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Count, Q

# Import models
from services.models import Service
from partenaires.models import Partenaire
from temoignages.models import Temoignage
from blog.models import Article
from contacts.models import Contact
from rendezvous.models import RendezVous
from customization.models import SiteCustomization, Slide

# Import serializers
from services.serializers import ServiceSerializer
from partenaires.serializers import PartenaireSerializer
from temoignages.serializers import TemoignageAdminSerializer
from blog.serializers import ArticleSerializer
from contacts.serializers import ContactAdminSerializer
from rendezvous.serializers import RendezVousAdminSerializer
from customization.serializers import SiteCustomizationSerializer, SlideSerializer


class ServiceAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Services"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des services"""
        total = Service.objects.count()
        actifs = Service.objects.filter(is_active=True).count()
        inactifs = total - actifs
        
        return Response({
            'total': total,
            'actifs': actifs,
            'inactifs': inactifs,
        })


class PartenaireAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Partenaires"""
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des partenaires"""
        total = Partenaire.objects.count()
        actifs = Partenaire.objects.filter(is_active=True).count()
        
        return Response({
            'total': total,
            'actifs': actifs,
        })


class TemoignageAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Témoignages avec modération"""
    queryset = Temoignage.objects.all()
    serializer_class = TemoignageAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Témoignages en attente de validation"""
        pending = Temoignage.objects.filter(status='pending')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approuver un témoignage"""
        temoignage = self.get_object()
        temoignage.status = 'approved'
        temoignage.save()
        return Response({'message': 'Témoignage approuvé'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rejeter un témoignage"""
        temoignage = self.get_object()
        temoignage.status = 'rejected'
        temoignage.save()
        return Response({'message': 'Témoignage rejeté'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des témoignages"""
        total = Temoignage.objects.count()
        approved = Temoignage.objects.filter(status='approved').count()
        pending = Temoignage.objects.filter(status='pending').count()
        rejected = Temoignage.objects.filter(status='rejected').count()
        
        return Response({
            'total': total,
            'approved': approved,
            'pending': pending,
            'rejected': rejected,
        })


class ArticleAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Articles/Blog"""
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def drafts(self, request):
        """Articles en brouillon"""
        drafts = Article.objects.filter(status='draft')
        serializer = self.get_serializer(drafts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        """Articles publiés"""
        published = Article.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).order_by('-published_at')
        serializer = self.get_serializer(published, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publier un article"""
        article = self.get_object()
        article.status = 'published'
        article.published_at = timezone.now()
        article.save()
        return Response({'message': 'Article publié'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des articles"""
        total = Article.objects.count()
        published = Article.objects.filter(status='published').count()
        drafts = Article.objects.filter(status='draft').count()
        
        return Response({
            'total': total,
            'published': published,
            'drafts': drafts,
        })


class ContactAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Contacts"""
    queryset = Contact.objects.all()
    serializer_class = ContactAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Contacts non lus (status='new')"""
        unread = Contact.objects.filter(status='new')
        serializer = self.get_serializer(unread, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marquer comme lu (changer status de 'new' à 'in_progress')"""
        contact = self.get_object()
        if contact.status == 'new':
            contact.status = 'in_progress'
            contact.save()
        return Response({'message': 'Contact marqué comme lu'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des contacts"""
        total = Contact.objects.count()
        read = Contact.objects.exclude(status='new').count()
        unread = Contact.objects.filter(status='new').count()
        
        return Response({
            'total': total,
            'read': read,
            'unread': unread,
        })


class RendezVousAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Rendez-vous"""
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Rendez-vous à venir"""
        today = timezone.now().date()
        upcoming = RendezVous.objects.filter(
            date_souhaitee__gte=today,
            status='confirmed'
        ).order_by('date_souhaitee')
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirmer un RDV"""
        rdv = self.get_object()
        rdv.status = 'confirmed'
        rdv.save()
        return Response({'message': 'RDV confirmé'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Annuler un RDV"""
        rdv = self.get_object()
        rdv.status = 'cancelled'
        rdv.save()
        return Response({'message': 'RDV annulé'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des RDV"""
        total = RendezVous.objects.count()
        confirmed = RendezVous.objects.filter(status='confirmed').count()
        pending = RendezVous.objects.filter(status='pending').count()
        cancelled = RendezVous.objects.filter(status='cancelled').count()
        
        return Response({
            'total': total,
            'confirmed': confirmed,
            'pending': pending,
            'cancelled': cancelled,
        })


class SiteCustomizationAdminViewSet(viewsets.ModelViewSet):
    """Gestion de la personnalisation du site"""
    queryset = SiteCustomization.objects.all()
    serializer_class = SiteCustomizationSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def list(self, request):
        """Retourner uniquement la configuration active"""
        customization = SiteCustomization.objects.filter(is_active=True).first()
        if not customization:
            return Response(None)
        serializer = self.get_serializer(customization)
        return Response(serializer.data)
    
    def create(self, request):
        """Créer ou mettre à jour la configuration active"""
        # Désactiver l'ancienne configuration
        SiteCustomization.objects.filter(is_active=True).update(is_active=False)
        
        # Créer la nouvelle configuration
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_active=True)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        """Mettre à jour la configuration active"""
        customization = self.get_object()
        serializer = self.get_serializer(customization, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class SlideAdminViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les Slides du diaporama"""
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def update(self, request, pk=None):
        """Mettre à jour un slide en gérant correctement l'image"""
        slide = self.get_object()
        
        # Vérifier si keep_image est demandé
        keep_image = request.data.get('keep_image') == 'true'
        
        # Si keep_image est True et qu'aucune nouvelle image n'est fournie,
        # on retire 'image' des données pour ne pas écraser l'image existante
        if keep_image and slide.image and 'image' not in request.FILES:
            # Créer une copie mutable des données
            data = request.data.copy()
            # Supprimer le champ image s'il existe dans les données
            if 'image' in data:
                del data['image']
            # Utiliser les données modifiées
            serializer = self.get_serializer(slide, data=data, partial=True)
        else:
            serializer = self.get_serializer(slide, data=request.data, partial=True)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des slides"""
        total = Slide.objects.count()
        actifs = Slide.objects.filter(is_active=True).count()
        
        return Response({
            'total': total,
            'actifs': actifs,
        })


class DashboardStatsView(generics.GenericAPIView):
    """Vue pour les statistiques globales du dashboard"""
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """Retourner toutes les statistiques du dashboard"""
        
        # Services
        services_total = Service.objects.count()
        services_actifs = Service.objects.filter(is_active=True).count()
        
        # Partenaires
        partenaires_total = Partenaire.objects.count()
        partenaires_actifs = Partenaire.objects.filter(is_active=True).count()
        
        # Témoignages
        temoignages_total = Temoignage.objects.count()
        temoignages_approved = Temoignage.objects.filter(status='approved').count()
        temoignages_pending = Temoignage.objects.filter(status='pending').count()
        
        # Articles
        articles_total = Article.objects.count()
        articles_published = Article.objects.filter(status='published').count()
        articles_drafts = Article.objects.filter(status='draft').count()
        
        # Contacts
        contacts_total = Contact.objects.count()
        contacts_unread = Contact.objects.filter(status='new').count()
        
        # Rendez-vous
        rdv_total = RendezVous.objects.count()
        rdv_confirmed = RendezVous.objects.filter(status='confirmed').count()
        rdv_pending = RendezVous.objects.filter(status='pending').count()
        
        # Slides
        slides_total = Slide.objects.count()
        slides_actifs = Slide.objects.filter(is_active=True).count()
        
        return Response({
            'services': {
                'total': services_total,
                'actifs': services_actifs,
            },
            'partenaires': {
                'total': partenaires_total,
                'actifs': partenaires_actifs,
            },
            'temoignages': {
                'total': temoignages_total,
                'approved': temoignages_approved,
                'pending': temoignages_pending,
            },
            'articles': {
                'total': articles_total,
                'published': articles_published,
                'drafts': articles_drafts,
            },
            'contacts': {
                'total': contacts_total,
                'unread': contacts_unread,
            },
            'rendezvous': {
                'total': rdv_total,
                'confirmed': rdv_confirmed,
                'pending': rdv_pending,
            },
            'slides': {
                'total': slides_total,
                'actifs': slides_actifs,
            },
        })
