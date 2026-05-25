from django.db import models


class RendezVous(models.Model):
    """Modèle pour les rendez-vous"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]

    TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('coaching', 'Coaching'),
        ('formation', 'Formation'),
        ('soutien', 'Soutien concours'),
        ('autre', 'Autre'),
    ]

    first_name = models.CharField(max_length=100, verbose_name='Prénom')
    last_name = models.CharField(max_length=100, verbose_name='Nom')
    email = models.EmailField(verbose_name='Email')
    phone = models.CharField(max_length=20, verbose_name='Téléphone')
    type_rdv = models.CharField(max_length=20, choices=TYPE_CHOICES, default='consultation', verbose_name='Type de RDV')
    date_souhaitee = models.DateTimeField(verbose_name='Date souhaitée')
    message = models.TextField(blank=True, null=True, verbose_name='Message/Détails')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Statut')
    notes_admin = models.TextField(blank=True, null=True, verbose_name='Notes administrateur')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')

    class Meta:
        verbose_name = 'Rendez-vous'
        verbose_name_plural = 'Rendez-vous'
        ordering = ['-date_souhaitee']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.get_type_rdv_display()} - {self.date_souhaitee.strftime('%d/%m/%Y %H:%M')}"
