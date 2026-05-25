# Intégration Next.js + Django - Abou BAH Consulting

## 🎯 Vue d'ensemble

Le projet combine maintenant :
- **Frontend** : Next.js 14 (React) - Interface utilisateur moderne
- **Backend** : Django 6.0 avec Django REST Framework - API RESTful

## 📁 Structure du projet

```
consultingSite/
├── backend/                 # Backend Django
│   ├── consulting_api/     # Configuration principale
│   ├── accounts/           # Authentification
│   ├── contacts/           # Gestion des contacts
│   ├── rendezvous/         # Gestion des RDV
│   ├── services/           # Gestion des services
│   ├── partenaires/        # Gestion des partenaires
│   ├── temoignages/        # Gestion des témoignages
│   ├── blog/               # Gestion des articles
│   ├── media/              # Fichiers uploadés
│   ├── manage.py
│   ├── requirements.txt
│   └── start.sh            # Script de démarrage
│
├── src/                    # Frontend Next.js
│   ├── app/               # Pages et layouts
│   ├── components/        # Composants React
│   ├── lib/
│   │   └── api.ts         # Configuration API Django
│   └── ...
│
├── .env.local             # Variables d'environnement
└── package.json
```

## 🚀 Démarrage rapide

### 1. Backend Django

```bash
# Terminal 1 - Backend
cd backend

# Option A: Utiliser le script automatique
chmod +x start.sh
./start.sh

# Option B: Manuellement
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_admin
python manage.py create_sample_data
python manage.py runserver 8000
```

**Accès Backend :**
- API : http://127.0.0.1:8000/api/
- Admin : http://127.0.0.1:8000/admin/
  - Username: `admin`
  - Password: `admin123`

### 2. Frontend Next.js

```bash
# Terminal 2 - Frontend
cd /home/bah/Bureau/application/consultingSite

# Installer les dépendances (si pas déjà fait)
npm install

# Lancer le serveur de développement
npm run dev
```

**Accès Frontend :**
- Site : http://localhost:3000

## 🔗 Intégration API

### Configuration

Le fichier `src/lib/api.ts` contient toute la configuration pour communiquer avec Django :

```typescript
import { servicesAPI, contactsAPI, rendezvousAPI } from '@/lib/api';

// Exemple: Récupérer les services
const services = await servicesAPI.getAll();

// Exemple: Créer un contact
await contactsAPI.create({
  first_name: 'Jean',
  last_name: 'Dupont',
  email: 'jean@example.com',
  subject: 'Demande d\'information',
  message: 'Je souhaite en savoir plus...',
});
```

### Endpoints disponibles

Voir `backend/README.md` pour la liste complète des endpoints.

## 📊 Fonctionnalités implémentées

### Backend (Django)

✅ **Authentification JWT**
- Token d'accès et refresh
- Sécurisation des endpoints admin

✅ **Gestion des Contacts**
- Formulaire de contact public
- Dashboard admin avec statuts
- Filtrage et recherche

✅ **Gestion des Rendez-vous**
- Prise de RDV en ligne
- Validation par l'admin
- Types de RDV personnalisables

✅ **Gestion des Services**
- CRUD complet via admin
- Affichage dynamique sur le site
- Catégorisation

✅ **Gestion des Partenaires**
- Upload de logos
- Carrousel dynamique
- Activation/désactivation

✅ **Gestion des Témoignages**
- Soumission publique
- Modération admin
- Système de notation

✅ **Blog/Articles**
- Création d'articles
- Images à la une
- Tags et catégories
- Statut brouillon/publié

✅ **Interface Admin Complète**
- Dashboard personnalisé
- Filtres avancés
- Recherche
- Export de données
- Upload de fichiers

### Frontend (Next.js) - À intégrer

Les composants doivent être mis à jour pour utiliser l'API :

1. **Services dynamiques** : Récupérer depuis `/api/services/`
2. **Partenaires dynamiques** : Récupérer depuis `/api/partenaires/`
3. **Formulaire de contact** : Connecter à `/api/contacts/`
4. **Prise de RDV** : Connecter à `/api/rendezvous/`
5. **Témoignages** : Afficher depuis `/api/temoignages/`
6. **Blog** : Afficher depuis `/api/articles/`

## 🔧 Prochaines étapes recommandées

### 1. Mettre à jour les composants Next.js

Exemple pour les services dans `src/app/page.tsx` :

```typescript
"use client";
import { useEffect, useState } from 'react';
import { servicesAPI, Service } from '@/lib/api';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    servicesAPI.getAll().then(data => {
      setServices(data.results);
    });
  }, []);

  return (
    // Utiliser services.map() au lieu des données en dur
  );
}
```

### 2. Créer des formulaires fonctionnels

- Formulaire de contact avec React Hook Form
- Formulaire de prise de RDV
- Validation avec Zod

### 3. Ajouter des pages supplémentaires

- Page Blog (`/blog`)
- Page Détail Article (`/blog/[slug]`)
- Page Services détaillée
- Page Contact avec formulaire

### 4. Améliorer l'UX

- Loading states
- Error handling
- Toast notifications
- Confirmation emails

## 📝 Notes importantes

### CORS
Django est configuré pour accepter les requêtes de `localhost:3000`. Si vous changez le port, mettez à jour `backend/consulting_api/settings.py`.

### Fichiers média
En développement, les fichiers sont servis par Django. En production, utilisez un service comme AWS S3 ou Cloudinary.

### Base de données
Par défaut SQLite. Pour la production, migrez vers PostgreSQL.

### Sécurité
- Changez le `SECRET_KEY` en production
- Définissez `DEBUG = False`
- Configurez `ALLOWED_HOSTS`
- Utilisez HTTPS

## 🐛 Dépannage

### Problème de CORS
```
Access to fetch has been blocked by CORS policy
```
→ Vérifiez que `CORS_ALLOWED_ORIGINS` inclut `http://localhost:3000`

### Problème d'authentification
```
Authentication credentials were not provided
```
→ Vous essayez d'accéder à un endpoint admin sans token JWT

### Port déjà utilisé
```
Error: That port is already in use
```
→ Tuez le processus ou utilisez un autre port :
```bash
python manage.py runserver 8001
```

## 📚 Ressources

- [Documentation Django](https://docs.djangoproject.com/)
- [Documentation DRF](https://www.django-rest-framework.org/)
- [Documentation Next.js](https://nextjs.org/docs)
- [JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)

## 🤝 Support

Pour toute question ou problème, consultez :
- `backend/README.md` pour le backend
- `src/lib/api.ts` pour l'intégration API
- Les commentaires dans le code

---

**Développé avec ❤️ pour Abou BAH Consulting**
