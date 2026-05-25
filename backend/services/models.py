from django.db import models
from django.utils.text import slugify
from unidecode import unidecode
from utilitaire.r2_storage import R2PublicMediaStorage


class Service(models.Model):
    """Modèle pour les services proposés"""
    CATEGORY_CHOICES = [
        ('formation', 'Formation'),
        ('coaching', 'Coaching'),
        ('accompagnement', 'Accompagnement'),
        ('preparation', 'Préparation concours'),
    ]

    title = models.CharField(max_length=200, verbose_name='Titre')
    slug = models.SlugField(max_length=200, unique=True, verbose_name='Slug')
    description = models.TextField(verbose_name='Description')
    image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True,
        verbose_name='Image du service',
        storage=R2PublicMediaStorage()
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='Catégorie')
    icon = models.CharField(max_length=50, blank=True, null=True, help_text='Nom de l\'icône Lucide (ex: BookOpen)', verbose_name='Icône')
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre d\'affichage')
    
    # Personnalisation des couleurs du service
    service_background_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur de fond de la carte (format hex: #FFFFFF)',
        verbose_name='Couleur fond carte'
    )
    service_title_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Couleur du titre (format hex: #1F2937)',
        verbose_name='Couleur titre'
    )
    service_description_color = models.CharField(
        max_length=7,
        default='#6B7280',
        help_text='Couleur de la description (format hex: #6B7280)',
        verbose_name='Couleur description'
    )
    service_category_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text='Couleur de la catégorie (format hex: #3B82F6)',
        verbose_name='Couleur catégorie'
    )
    service_category_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Couleur du texte de la catégorie (format hex: #FFFFFF)',
        verbose_name='Couleur texte catégorie'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')

    class Meta:
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Toujours générer le slug à partir du titre avec unidecode
        # unidecode convertit les caractères accentués en caractères ASCII
        # Exemple: "française" → "francaise"
        if self.title:
            self.slug = slugify(unidecode(self.title))
        super().save(*args, **kwargs)
