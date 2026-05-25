#!/usr/bin/env python3
"""
Script de test pour vérifier l'API de personnalisation
Exécuter depuis le dossier backend: python test_customization_api.py
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consulting_api.settings')
django.setup()

from customization.models import SiteCustomization
from customization.serializers import SiteCustomizationSerializer

def test_customization():
    print("=" * 80)
    print("TEST: Vérification de la configuration de personnalisation")
    print("=" * 80)
    
    # Vérifier s'il existe une configuration active
    customization = SiteCustomization.objects.filter(is_active=True).first()
    
    if not customization:
        print("\n❌ AUCUNE configuration active trouvée!")
        print("\nCréation d'une configuration par défaut...")
        
        customization = SiteCustomization.objects.create(
            is_active=True,
            hero_title='Bienvenue chez Abou Bah Consulting',
            hero_subtitle='Cabinet de consultation pédagogique spécialisé dans la formation et le coaching',
            show_testimonials_section=True,
            show_blog_section=True,
            show_partners_section=True,
        )
        print("✅ Configuration par défaut créée avec succès!")
    
    print(f"\n✅ Configuration trouvée (ID: {customization.id})")
    print(f"   Date de création: {customization.created_at}")
    print(f"   Active: {customization.is_active}")
    
    # Sérialiser pour voir les données envoyées à l'API
    serializer = SiteCustomizationSerializer(customization)
    data = serializer.data
    
    print("\n" + "=" * 80)
    print("CHAMPS DE VISIBILITÉ DES SECTIONS:")
    print("=" * 80)
    
    sections = [
        ('show_testimonials_section', 'Section Témoignages'),
        ('show_blog_section', 'Section Blog'),
        ('show_partners_section', 'Section Partenaires'),
        ('show_about_section', 'Section À propos'),
    ]
    
    for field, label in sections:
        value = data.get(field, 'N/A')
        status = "✅ ACTIVÉE" if value else "❌ DÉSACTIVÉE"
        print(f"   {status:20} - {label:30} ({field})")
    
    print("\n" + "=" * 80)
    print("COULEURS PRINCIPALES:")
    print("=" * 80)
    
    colors = [
        ('primary_color', 'Couleur principale'),
        ('secondary_color', 'Couleur secondaire'),
        ('accent_color', "Couleur d'accentuation"),
        ('background_color', 'Couleur de fond'),
        ('text_color', 'Couleur du texte'),
    ]
    
    for field, label in colors:
        value = data.get(field, 'N/A')
        print(f"   {value:10} - {label}")
    
    print("\n" + "=" * 80)
    print("RÉSUMÉ:")
    print("=" * 80)
    
    enabled_sections = sum([
        data.get('show_testimonials_section', False),
        data.get('show_blog_section', False),
        data.get('show_partners_section', False),
    ])
    
    print(f"   Sections activées: {enabled_sections}/3")
    print(f"   Total champs dans serializer: {len(data)}")
    
    if enabled_sections == 3:
        print("\n✅ TOUTES LES SECTIONS SONT ACTIVÉES - Prêt pour le frontend!")
    elif enabled_sections == 0:
        print("\n⚠️  ATTENTION: Toutes les sections sont désactivées!")
        print("   Allez dans l'admin Django pour les activer.")
    else:
        print(f"\n⚠️  PARTIEL: {enabled_sections} section(s) activée(s)")
    
    print("\n" + "=" * 80)
    return True

if __name__ == '__main__':
    try:
        test_customization()
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
