#!/bin/bash

# Script de démarrage rapide pour le backend Django
# Abou BAH Consulting

echo "🚀 Démarrage du backend Django - Abou BAH Consulting"
echo "======================================================"

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "❌ Environnement virtuel non trouvé. Création..."
    python3 -m venv venv
    echo "✅ Environnement virtuel créé"
fi

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
echo "📦 Installation des dépendances..."
pip install -r requirements.txt > /dev/null 2>&1
echo "✅ Dépendances installées"

# Appliquer les migrations
echo "🗄️  Application des migrations..."
python manage.py migrate --noinput

# Créer le superutilisateur s'il n'existe pas
echo "👤 Vérification du superutilisateur..."
python manage.py create_admin

# Créer les dossiers nécessaires
mkdir -p media/partenaires media/temoignages media/articles staticfiles

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Informations de connexion :"
echo "   - URL Admin: http://127.0.0.1:8000/admin/"
echo "   - Username: admin"
echo "   - Password: admin123"
echo ""
echo "🌐 API Endpoints :"
echo "   - Services: http://127.0.0.1:8000/api/services/"
echo "   - Partenaires: http://127.0.0.1:8000/api/partenaires/"
echo "   - Contacts: http://127.0.0.1:8000/api/contacts/"
echo "   - Rendez-vous: http://127.0.0.1:8000/api/rendezvous/"
echo "   - Témoignages: http://127.0.0.1:8000/api/temoignages/"
echo "   - Articles: http://127.0.0.1:8000/api/articles/"
echo ""
echo "🔑 Authentification :"
echo "   - Token: POST http://127.0.0.1:8000/api/auth/token/"
echo ""
echo "🚀 Démarrage du serveur..."
echo "   Serveur disponible à: http://127.0.0.1:8000/"
echo ""

# Démarrer le serveur
python manage.py runserver
