from rest_framework import generics, permissions
from django.utils import timezone
from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer


class ArticleListView(generics.ListAPIView):
    """Lister les articles publiés (public)"""
    serializer_class = ArticleListSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return Article.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).order_by('-published_at')


class ArticleDetailView(generics.RetrieveAPIView):
    """Voir un article spécifique (public)"""
    queryset = Article.objects.filter(status='published')
    serializer_class = ArticleSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class ArticleFeaturedListView(generics.ListAPIView):
    """Lister les articles en vedette (public)"""
    serializer_class = ArticleListSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return Article.objects.filter(
            status='published',
            is_featured=True,
            published_at__lte=timezone.now()
        )[:5]


class ArticleAdminListView(generics.ListCreateAPIView):
    """Lister et créer des articles (admin seulement)"""
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir, modifier ou supprimer un article (admin seulement)"""
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
