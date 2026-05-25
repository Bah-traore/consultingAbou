# Abou BAH Consulting - Site Web Complet

Site web moderne pour cabinet de consultation pédagogique, combinant Next.js (frontend) et Django (backend).

## 🎯 Vue d'ensemble

Ce projet comprend :
- **Frontend** : Next.js 14 avec React, TypeScript et Tailwind CSS
- **Backend** : Django 6.0 avec Django REST Framework
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **Authentification** : JWT Tokens

## 🚀 Démarrage Rapide

### Backend Django

```bash
cd backend
./start.sh
```

Accès :
- API : http://127.0.0.1:8000/api/
- Admin : http://127.0.0.1:8000/admin/ (admin / admin123)

### Frontend Next.js

```bash
npm install
npm run dev
```

Accès : http://localhost:3000

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [BACKEND_COMPLETE.md](./BACKEND_COMPLETE.md) | Résumé complet du backend |
| [QUICKSTART.md](./QUICKSTART.md) | Guide de démarrage rapide |
| [INTEGRATION.md](./INTEGRATION.md) | Guide d'intégration Next.js + Django |
| [CHECKLIST.md](./CHECKLIST.md) | Checklist avant production |
| [backend/README.md](./backend/README.md) | Documentation backend détaillée |
| [backend/API_REFERENCE.md](./backend/API_REFERENCE.md) | Référence API complète |
| [backend/COMPLET.md](./backend/COMPLET.md) | Détails implémentation backend |

## 📁 Structure du Projet

```
consultingSite/
├── backend/                 # Backend Django
│   ├── accounts/           # Authentification
│   ├── contacts/           # Gestion contacts
│   ├── rendezvous/         # Gestion RDV
│   ├── services/           # Gestion services
│   ├── partenaires/        # Gestion partenaires
│   ├── temoignages/        # Gestion témoignages
│   ├── blog/               # Gestion articles
│   └── consulting_api/     # Configuration principale
├── src/                    # Frontend Next.js
│   ├── app/               # Pages
│   ├── components/        # Composants React
│   ├── lib/               # Utilitaires (api.ts)
│   └── hooks/             # Hooks personnalisés
└── public/                # Assets statiques
```

## ✨ Fonctionnalités

### Backend (Django)
- ✅ API REST complète
- ✅ Interface admin personnalisée
- ✅ Authentification JWT
- ✅ Gestion contacts & RDV
- ✅ CRUD services, partenaires, témoignages
- ✅ Blog avec articles
- ✅ Upload de fichiers
- ✅ CORS configuré

### Frontend (Next.js) - À intégrer
- ⏳ Design moderne avec Tailwind
- ⏳ Composants shadcn/ui
- ⏳ Responsive design
- ⏳ Animations fluides
- ⏳ SEO optimisé

## 🛠️ Technologies

**Backend :**
- Django 6.0.5
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- Pillow (images)

**Frontend :**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## 📋 API Endpoints

Principaux endpoints :
- `POST /api/contacts/` - Créer contact
- `POST /api/rendezvous/` - Demander RDV
- `GET /api/services/` - Lister services
- `GET /api/partenaires/` - Lister partenaires
- `GET /api/articles/` - Lister articles
- `POST /api/temoignages/create/` - Soumettre témoignage

Voir [backend/API_REFERENCE.md](./backend/API_REFERENCE.md) pour la liste complète.

## 🔧 Développement

### Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Commandes utiles :
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py create_sample_data
```

### Frontend

```bash
npm run dev      # Développement
npm run build    # Build production
npm start        # Start production
```

## 🌍 Déploiement

### Backend (Production)
1. Migrer vers PostgreSQL
2. Configurer Gunicorn + Nginx
3. HTTPS avec Let's Encrypt
4. Variables d'environnement sécurisées
5. Backup automatique

### Frontend (Production)
1. Build: `npm run build`
2. Déployer sur Vercel/Netlify
3. Ou héberger avec Nginx

Voir [CHECKLIST.md](./CHECKLIST.md) pour la checklist complète.

## 👥 Équipe

Développé pour **Abou BAH Consulting** - Cabinet de consultation pédagogique

## 📄 License

Projet privé - Tous droits réservés

---

**Statut :** Backend opérationnel ✅ | Frontend en cours d'intégration ⏳

**Version :** 1.0.0  
**Date :** Mai 2026
# consultingaboubah
# consultingaboubah
