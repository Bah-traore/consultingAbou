"""
Script pour créer des slides par défaut pour le diaporama
Usage: python create_slides.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consulting_api.settings')
django.setup()

from customization.models import Slide

# Créer les slides par défaut
slides_data = [
    {
        'title': 'Conseil & Formation',
        'subtitle': 'Un accompagnement sur-mesure pour vos projets.',
        'image': '/img/slide1.jpg',
        'order': 0,
    },
    {
        'title': 'Coaching personnalisé',
        'subtitle': 'Développez votre potentiel avec nos experts.',
        'image': '/img/slide2.jpg',
        'order': 1,
    },
    {
        'title': 'Méthode & Rigueur',
        'subtitle': 'Des résultats concrets et mesurables.',
        'image': '/img/slide3.jpg',
        'order': 2,
    },
]

for slide_data in slides_data:
    slide, created = Slide.objects.get_or_create(
        title=slide_data['title'],
        defaults=slide_data
    )
    if created:
        print(f"✓ Slide créé: {slide.title}")
    else:
        print(f"• Slide existe déjà: {slide.title}")

print("\n✅ Diaporama configuré avec succès !")
print("Accédez à http://127.0.0.1:8000/admin/customization/slide/ pour gérer les slides")
