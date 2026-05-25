from django.db import models
from django.conf import settings
from utilitaire.r2_storage import R2PublicMediaStorage


class Article(models.Model):
    """Modèle pour les articles de blog"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]

    title = models.CharField(max_length=300, verbose_name='Titre')
    slug = models.SlugField(max_length=300, unique=True, verbose_name='Slug')
    excerpt = models.TextField(max_length=500, blank=True, null=True, verbose_name='Extrait')
    content = models.TextField(verbose_name='Contenu')
    featured_image = models.ImageField(
        upload_to='articles/',
        blank=True,
        null=True,
        verbose_name='Image principale',
        storage=R2PublicMediaStorage()
    )
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles', verbose_name='Auteur')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='Statut')
    is_featured = models.BooleanField(default=False, verbose_name='En vedette')
    tags = models.CharField(max_length=300, blank=True, null=True, help_text='Tags séparés par des virgules', verbose_name='Tags')
    
    # Personnalisation des couleurs de l'article
    article_card_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la carte article (format hex: #FFFFFF)',
        verbose_name='Couleur fond carte'
    )
    article_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre (format hex: #1F2937)',
        verbose_name='Couleur titre'
    )
    article_excerpt_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de l\'extrait (format hex: #6B7280)',
        verbose_name='Couleur extrait'
    )
    article_tag_background_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text='Couleur de fond des tags (format hex: #3B82F6)',
        verbose_name='Couleur fond tag'
    )
    article_tag_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du texte des tags (format hex: #FFFFFF)',
        verbose_name='Couleur texte tag'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')
    published_at = models.DateTimeField(blank=True, null=True, verbose_name='Date de publication')

    class Meta:
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title
