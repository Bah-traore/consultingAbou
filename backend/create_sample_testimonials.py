#!/usr/bin/env python3
"""
Script pour créer des témoignages de test
Exécuter depuis le dossier backend: python create_sample_testimonials.py
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consulting_api.settings')
django.setup()

from temoignages.models import Temoignage

def create_sample_testimonials():
    print("=" * 80)
    print("CRÉATION DE TÉMOIGNAGES DE TEST")
    print("=" * 80)
    
    # Vérifier s'il existe déjà des témoignages
    count = Temoignage.objects.count()
    if count > 0:
        print(f"\n⚠️  {count} témoignage(s) existent déjà.")
        response = input("Voulez-vous les supprimer et recréer ? (oui/non): ").lower()
        if response != 'oui':
            print("Annulation.")
            return
        Temoignage.objects.all().delete()
        print("✅ Témoignages existants supprimés.")
    
    # Créer des témoignages de test
    testimonials_data = [
        {
            'first_name': 'Fatoumata',
            'last_name': 'Diallo',
            'email': 'fatoumata.diallo@example.com',
            'photo': None,
            'rating': 5,
            'comment': 'Excellent accompagnement pour ma préparation au concours. La méthode est claire et les résultats sont au rendez-vous. Je recommande vivement !',
            'status': 'approved',
            'is_featured': True,
        },
        {
            'first_name': 'Moussa',
            'last_name': 'Traoré',
            'email': 'moussa.traore@example.com',
            'photo': None,
            'rating': 5,
            'comment': 'Grâce au coaching personnalisé, j\'ai pu améliorer considérablement mes présentations. Un vrai changement dans ma carrière professionnelle.',
            'status': 'approved',
            'is_featured': True,
        },
        {
            'first_name': 'Aminata',
            'last_name': 'Keita',
            'email': 'aminata.keita@example.com',
            'photo': None,
            'rating': 4,
            'comment': 'Formation très complète sur la mise en page de documents professionnels. L\'approche pédagogique est excellente.',
            'status': 'approved',
            'is_featured': False,
        },
        {
            'first_name': 'Ibrahim',
            'last_name': 'Coulibaly',
            'email': 'ibrahim.coulibaly@example.com',
            'photo': None,
            'rating': 5,
            'comment': 'Soutenance de mémoire réussie grâce à l\'accompagnement d\'Abou Bah Consulting. Méthodologie rigoureuse et conseils précieux.',
            'status': 'approved',
            'is_featured': True,
        },
        {
            'first_name': 'Mariam',
            'last_name': 'Bamba',
            'email': 'mariam.bamba@example.com',
            'photo': None,
            'rating': 5,
            'comment': 'Un cabinet qui comprend vraiment les besoins des étudiants et professionnels. Résultats concrets et durables.',
            'status': 'approved',
            'is_featured': False,
        },
        {
            'first_name': 'Ousmane',
            'last_name': 'Diabaté',
            'email': 'ousmane.diabate@example.com',
            'photo': None,
            'rating': 4,
            'comment': 'Coaching efficace pour la prise de parole en public. J\'ai gagné en confiance et en aisance lors de mes interventions.',
            'status': 'approved',
            'is_featured': False,
        },
    ]
    
    print(f"\nCréation de {len(testimonials_data)} témoignages...")
    
    for i, data in enumerate(testimonials_data, 1):
        testimonial = Temoignage.objects.create(**data)
        print(f"  ✅ {i}. {data['first_name']} {data['last_name']} - ⭐{data['rating']}/5")
    
    print("\n" + "=" * 80)
    print(f"✅ {len(testimonials_data)} TÉMOIGNAGES CRÉÉS AVEC SUCCÈS!")
    print("=" * 80)
    
    # Afficher un résumé
    featured_count = Temoignage.objects.filter(is_featured=True).count()
    avg_rating = Temoignage.objects.aggregate(avg_rating=('rating'))['avg_rating']
    
    print(f"\nRÉSUMÉ:")
    print(f"   Total témoignages: {Temoignage.objects.count()}")
    print(f"   Témoignages en vedette: {featured_count}")
    print(f"   Note moyenne: {avg_rating:.1f}/5")
    print(f"\n🎉 Prêt pour affichage sur le site!")
    print("=" * 80)

if __name__ == '__main__':
    try:
        create_sample_testimonials()
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
