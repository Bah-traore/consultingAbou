from django.db import models
from utilitaire.r2_storage import R2PublicMediaStorage


class Temoignage(models.Model):
    """Modèle pour les témoignages clients"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]

    first_name = models.CharField(max_length=100, verbose_name='Prénom')
    last_name = models.CharField(max_length=100, verbose_name='Nom')
    email = models.EmailField(verbose_name='Email')
    photo = models.ImageField(
        upload_to='temoignages/',
        blank=True,
        null=True,
        verbose_name='Photo',
        storage=R2PublicMediaStorage()
    )
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], verbose_name='Note')
    comment = models.TextField(verbose_name='Commentaire')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Statut')
    is_featured = models.BooleanField(default=False, verbose_name='En vedette')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')

    class Meta:
        verbose_name = 'Témoignage'
        verbose_name_plural = 'Témoignages'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.rating}/5"
