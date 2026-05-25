#!/usr/bin/env python
"""
Script pour créer des services de démonstration dans la base de données.
Ce script crée des services variés avec images, icônes et catégories différentes.
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consulting_api.settings')
django.setup()

from services.models import Service

def create_sample_services():
    """Créer des services de démonstration"""
    
    print("=" * 80)
    print("CRÉATION DES SERVICES DE DÉMONSTRATION")
    print("=" * 80)
    
    # Vérifier s'il existe déjà des services
    if Service.objects.count() > 0:
        print(f"\n⚠️  {Service.objects.count()} service(s) existent déjà.")
        response = input("Voulez-vous les supprimer et recréer ? (o/n): ").lower()
        if response != 'o':
            print("✅ Création annulée.")
            return
        else:
            Service.objects.all().delete()
            print("✅ Services existants supprimés.")
    
    # Liste des services à créer
    services_data = [
        {
            'title': 'Formation pédagogique',
            'description': 'Programmes de formation complets pour enseignants et formateurs. Développement de compétences pédagogiques, gestion de classe et innovation éducative.',
            'category': 'formation',
            'icon': 'BookOpen',
            'is_active': True,
            'order': 1,
        },
        {
            'title': 'Coaching individuel',
            'description': 'Accompagnement personnalisé pour professionnels de l\'éducation. Développement du leadership, gestion du stress et optimisation des pratiques enseignantes.',
            'category': 'coaching',
            'icon': 'Target',
            'is_active': True,
            'order': 2,
        },
        {
            'title': 'Préparation aux concours',
            'description': 'Préparation intensive aux concours de l\'éducation nationale. Méthodologie, simulations d\'oraux et suivi personnalisé jusqu\'à la réussite.',
            'category': 'preparation',
            'icon': 'Award',
            'is_active': True,
            'order': 3,
        },
        {
            'title': 'Ateliers collectifs',
            'description': 'Sessions interactives en groupe sur des thématiques spécifiques : évaluation, différenciation pédagogique, outils numériques et gestion de projet éducatif.',
            'category': 'formation',
            'icon': 'Presentation',
            'is_active': True,
            'order': 4,
        },
        {
            'title': 'Accompagnement institutionnel',
            'description': 'Conseil stratégique pour établissements scolaires et institutions éducatives. Diagnostic, plan d\'action et mise en œuvre de projets pédagogiques innovants.',
            'category': 'accompagnement',
            'icon': 'Target',
            'is_active': True,
            'order': 5,
        },
        {
            'title': 'Mentorat professionnel',
            'description': 'Relation d\'accompagnement durable entre pairs expérimentés. Transmission de savoir-faire, développement de carrière et construction de projet professionnel.',
            'category': 'coaching',
            'icon': 'BookOpen',
            'is_active': True,
            'order': 6,
        },
    ]
    
    created_count = 0
    for service_data in services_data:
        try:
            service = Service.objects.create(**service_data)
            print(f"✅ Service créé: {service.title} ({service.category})")
            created_count += 1
        except Exception as e:
            print(f"❌ Erreur lors de la création de '{service_data['title']}': {e}")
    
    print("\n" + "=" * 80)
    print(f"RÉSUMÉ: {created_count}/{len(services_data)} services créés avec succès")
    print("=" * 80)
    
    # Afficher les services créés
    print("\n LISTE DES SERVICES CRÉÉS:")
    print("-" * 80)
    for service in Service.objects.all().order_by('order'):
        print(f"   [{service.order}] {service.title:40} | {service.category:15} | {service.icon or 'N/A'}")
    
    print("\n✅ Script terminé avec succès!")
    print("\n💡 Conseil: Vous pouvez maintenant voir ces services sur votre site homepage.")
    print("   Pour modifier les couleurs et le contenu de la section Services,")
    print("   allez dans Django Admin → Personnalisation du site → Section Services")

if __name__ == '__main__':
    create_sample_services()
