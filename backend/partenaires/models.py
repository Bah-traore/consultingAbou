from django.db import models
from utilitaire.r2_storage import R2PublicMediaStorage


class Partenaire(models.Model):
    """Modèle pour les partenaires"""
    name = models.CharField(max_length=200, verbose_name='Nom')
    logo = models.ImageField(
        upload_to='partenaires/',
        verbose_name='Logo',
        storage=R2PublicMediaStorage()
    )
    website = models.URLField(blank=True, null=True, verbose_name='Site web')
    description = models.TextField(blank=True, null=True, verbose_name='Description')
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre d\'affichage')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')

    class Meta:
        verbose_name = 'Partenaire'
        verbose_name_plural = 'Partenaires'
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.name
