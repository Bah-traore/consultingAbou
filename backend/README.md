# Backend Django - Abou BAH Consulting

Backend API REST pour le site de cabinet de consultation pédagogique Abou BAH Consulting.

## 🚀 Installation

### 1. Prérequis
- Python 3.10+
- pip (gestionnaire de paquets Python)

### 2. Configuration de l'environnement virtuel

```bash
# Se placer dans le dossier backend
cd backend

# Créer un environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 3. Installation des dépendances

```bash
pip install -r requirements.txt
```

### 4. Configuration de la base de données

Par défaut, le projet utilise SQLite (db.sqlite3). Pour utiliser PostgreSQL en production :

1. Installez PostgreSQL
2. Créez une base de données
3. Modifiez `consulting_api/settings.py` :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'consulting_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 5. Migrations et création du superutilisateur

```bash
# Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur (admin)
python manage.py createsuperuser
```

### 6. Lancer le serveur de développement

```bash
python manage.py runserver
```

Le serveur sera accessible à : http://127.0.0.1:8000

## 📋 API Endpoints

### Authentification
- `POST /api/auth/token/` - Obtenir un token JWT
- `POST /api/auth/token/refresh/` - Rafraîchir un token

### Contacts
- `POST /api/contacts/` - Créer une demande de contact (public)
- `GET /api/contacts/list/` - Lister tous les contacts (admin)
- `GET /api/contacts/{id}/` - Voir un contact (admin)
- `PUT/PATCH /api/contacts/{id}/` - Modifier un contact (admin)
- `DELETE /api/contacts/{id}/` - Supprimer un contact (admin)

### Rendez-vous
- `POST /api/rendezvous/` - Créer une demande de RDV (public)
- `GET /api/rendezvous/list/` - Lister tous les RDV (admin)
- `GET /api/rendezvous/{id}/` - Voir un RDV (admin)
- `PUT/PATCH /api/rendezvous/{id}/` - Modifier un RDV (admin)
- `DELETE /api/rendezvous/{id}/` - Supprimer un RDV (admin)

### Services
- `GET /api/services/` - Lister les services actifs (public)
- `GET /api/services/{slug}/` - Voir un service (public)
- `GET /api/services/admin/` - Lister tous les services (admin)
- `POST /api/services/admin/` - Créer un service (admin)
- `PUT/PATCH /api/services/admin/{id}/` - Modifier un service (admin)
- `DELETE /api/services/admin/{id}/` - Supprimer un service (admin)

### Partenaires
- `GET /api/partenaires/` - Lister les partenaires actifs (public)
- `GET /api/partenaires/admin/` - Lister tous les partenaires (admin)
- `POST /api/partenaires/admin/` - Créer un partenaire (admin)
- `PUT/PATCH /api/partenaires/admin/{id}/` - Modifier un partenaire (admin)
- `DELETE /api/partenaires/admin/{id}/` - Supprimer un partenaire (admin)

### Témoignages
- `GET /api/temoignages/` - Lister les témoignages approuvés (public)
- `POST /api/temoignages/create/` - Créer un témoignage (public)
- `GET /api/temoignages/admin/` - Lister tous les témoignages (admin)
- `PUT/PATCH /api/temoignages/admin/{id}/` - Modifier un témoignage (admin)
- `DELETE /api/temoignages/admin/{id}/` - Supprimer un témoignage (admin)

### Articles/Blog
- `GET /api/articles/` - Lister les articles publiés (public)
- `GET /api/articles/featured/` - Articles en vedette (public)
- `GET /api/articles/{slug}/` - Voir un article (public)
- `GET /api/articles/admin/` - Lister tous les articles (admin)
- `POST /api/articles/admin/` - Créer un article (admin)
- `PUT/PATCH /api/articles/admin/{id}/` - Modifier un article (admin)
- `DELETE /api/articles/admin/{id}/` - Supprimer un article (admin)

## 🔐 Interface d'administration Django

Accédez à l'interface admin : http://127.0.0.1:8000/admin/

Fonctionnalités disponibles :
- ✅ Gestion des utilisateurs
- ✅ Gestion des contacts avec statuts
- ✅ Gestion des rendez-vous avec validation
- ✅ CRUD complet des services
- ✅ CRUD complet des partenaires (avec upload de logos)
- ✅ Modération des témoignages
- ✅ Gestion des articles de blog
- ✅ Upload de fichiers (images, logos)
- ✅ Filtres et recherche avancée
- ✅ Export des données

## 📁 Structure du projet

```
backend/
├── consulting_api/          # Configuration principale
│   ├── settings.py          # Paramètres du projet
│   ├── urls.py              # URLs principales
│   └── wsgi.py
├── accounts/                # App authentification
├── contacts/                # App gestion contacts
├── rendezvous/              # App gestion RDV
├── services/                # App gestion services
├── partenaires/             # App gestion partenaires
├── temoignages/             # App gestion témoignages
├── blog/                    # App gestion articles
├── media/                   # Fichiers uploadés
├── staticfiles/             # Fichiers statiques
├── manage.py
└── requirements.txt
```

## 🔧 Configuration Email

Pour envoyer des emails (notifications, confirmations), configurez dans `settings.py` :

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'votre-email@gmail.com'
EMAIL_HOST_PASSWORD = 'votre-mot-de-passe'
```

## 🌍 Déploiement en production

1. Définir `DEBUG = False`
2. Configurer `ALLOWED_HOSTS`
3. Utiliser PostgreSQL au lieu de SQLite
4. Configurer un vrai backend email
5. Collecter les fichiers statiques : `python manage.py collectstatic`
6. Utiliser Gunicorn comme serveur WSGI
7. Configurer Nginx en reverse proxy

## 📝 Notes

- Les endpoints publics ne nécessitent pas d'authentification
- Les endpoints admin nécessitent un token JWT valide
- CORS est configuré pour accepter les requêtes depuis localhost:3000 (Next.js)
- Les fichiers média sont servis automatiquement en développement

## 👥 Support

Pour toute question ou problème, contactez l'équipe de développement.
