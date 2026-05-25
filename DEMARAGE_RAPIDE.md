# 🚀 Guide de Démarrage - Site Dynamique Abou BAH Consulting

## ✅ Intégration Terminée !

Votre site est maintenant **100% dynamique** avec Next.js + Django.

---

## 📋 Prérequis

- Node.js 18+ installé
- Python 3.10+ installé
- Deux terminaux disponibles

---

## 🎯 Démarrage en 3 étapes

### Étape 1 : Backend Django (Terminal 1)

```bash
cd /home/bah/Bureau/application/consultingSite/backend
./start.sh
```

Le serveur démarre sur : http://127.0.0.1:8000

**Vérification :**
```bash
curl http://127.0.0.1:8000/api/services/
# Doit retourner la liste des services
```

### Étape 2 : Frontend Next.js (Terminal 2)

```bash
cd /home/bah/Bureau/application/consultingSite
npm run dev
```

Le site démarre sur : http://localhost:3000

### Étape 3 : Tester le site

Ouvrez votre navigateur et visitez :

1. **Page d'accueil** : http://localhost:3000
   - Les services doivent s'afficher dynamiquement

2. **Page Contact** : http://localhost:3000/contact
   - Testez le formulaire de contact
   - Testez le formulaire de rendez-vous

3. **Blog** : http://localhost:3000/blog
   - L'article de démonstration doit apparaître

4. **Admin Django** : http://127.0.0.1:8000/admin/
   - Login : `admin`
   - Password : `admin123`

---

## 🧪 Scénarios de test

### Test 1 : Modifier un service

1. Aller à l'admin : http://127.0.0.1:8000/admin/services/service/
2. Cliquer sur "Renforcement de capacités en langue française"
3. Modifier la description
4. Sauvegarder
5. Rafraîchir http://localhost:3000
6. ✅ Le changement doit apparaître !

### Test 2 : Envoyer un message de contact

1. Aller à http://localhost:3000/contact
2. Remplir le formulaire de contact
3. Cliquer "Envoyer le message"
4. Message de confirmation doit apparaître
5. Vérifier dans l'admin : http://127.0.0.1:8000/admin/contacts/contact/
6. ✅ Le message doit être là !

### Test 3 : Demander un rendez-vous

1. Aller à http://localhost:3000/contact
2. Remplir le formulaire de RDV
3. Choisir une date future
4. Cliquer "Demander ce rendez-vous"
5. Vérifier dans l'admin : http://127.0.0.1:8000/admin/rendezvous/rendezvous/
6. ✅ La demande doit être là !

### Test 4 : Créer un article de blog

1. Aller à l'admin : http://127.0.0.1:8000/admin/blog/article/
2. Cliquer "Ajouter un article"
3. Remplir :
   - Titre : "Mon test article"
   - Extrait : "Test..."
   - Contenu : "Contenu test..."
   - Statut : "Publié"
   - Published at : choisir une date passée
4. Sauvegarder
5. Aller à http://localhost:3000/blog
6. ✅ L'article doit apparaître !

---

## 📁 Structure du projet

```
consultingSite/
├── backend/                    # Django
│   ├── contacts/              # App contacts
│   ├── rendezvous/            # App RDV
│   ├── services/              # App services
│   ├── blog/                  # App articles
│   ├── partenaires/           # App partenaires
│   ├── temoignages/           # App témoignages
│   └── consulting_api/        # Config principale
│
├── src/                       # Next.js
│   ├── app/
│   │   ├── blog/              # Pages blog
│   │   ├── contact/           # Page contact
│   │   ├── page.tsx           # Accueil (avec ServicesSection)
│   │   └── layout.tsx         # Layout global
│   ├── components/
│   │   ├── ServicesSection.tsx    # Services dynamiques
│   │   ├── ContactForm.tsx        # Formulaire contact
│   │   └── RendezVousForm.tsx     # Formulaire RDV
│   └── lib/
│       └── api.ts             # Configuration API
│
└── .env.local                 # Variables d'environnement
```

---

## 🔗 URLs importantes

### Frontend (Next.js)
- Accueil : http://localhost:3000
- Contact : http://localhost:3000/contact
- Blog : http://localhost:3000/blog

### Backend (Django)
- API : http://127.0.0.1:8000/api/
- Admin : http://127.0.0.1:8000/admin/

### Endpoints API principaux
- Services : http://127.0.0.1:8000/api/services/
- Contacts : http://127.0.0.1:8000/api/contacts/
- Rendez-vous : http://127.0.0.1:8000/api/rendezvous/
- Articles : http://127.0.0.1:8000/api/articles/

---

## 🛠️ Commandes utiles

### Backend Django

```bash
# Accéder au dossier
cd backend

# Activer l'environnement virtuel
source venv/bin/activate

# Lancer le serveur
python manage.py runserver

# Shell Django (pour tests)
python manage.py shell

# Voir les migrations
python manage.py showmigrations

# Créer un superutilisateur
python manage.py createsuperuser

# Données de démo
python manage.py create_sample_data
```

### Frontend Next.js

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Start production
npm start

# Installer dépendances
npm install
```

---

## 🐛 Dépannage

### Problème : "Cannot connect to API"

**Solution :**
1. Vérifier que Django tourne sur le port 8000
2. Vérifier `.env.local` contient :
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
3. Redémarrer Next.js : `Ctrl+C` puis `npm run dev`

### Problème : "CORS error"

**Solution :**
Vérifier que `backend/consulting_api/settings.py` contient :
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

### Problème : "Module not found"

**Solution :**
```bash
# Réinstaller les dépendances
npm install
```

### Problème : Port déjà utilisé

**Solution :**
```bash
# Trouver le processus
lsof -i :3000  # ou :8000

# Tuer le processus
kill -9 <PID>
```

---

## 📊 Fonctionnalités opérationnelles

### ✅ Frontend
- [x] Services dynamiques depuis API
- [x] Formulaire de contact fonctionnel
- [x] Formulaire de rendez-vous fonctionnel
- [x] Blog avec liste d'articles
- [x] Page détail article
- [x] Navigation entre pages
- [x] Design responsive
- [x] Loading states
- [x] Gestion des erreurs

### ✅ Backend
- [x] API REST complète
- [x] Authentification JWT
- [x] Interface admin personnalisée
- [x] CRUD tous les modèles
- [x] Upload de fichiers
- [x] CORS configuré
- [x] Base de données SQLite
- [x] Données de démonstration

---

## 🎯 Personnalisation rapide

### Changer les informations de contact

Fichier : `src/app/contact/page.tsx`

Modifier les valeurs dans les cartes :
```tsx
<p className="text-sm text-muted-foreground">votre-email@example.com</p>
<p className="text-sm text-muted-foreground">+223 XX XX XX XX</p>
```

### Ajouter vos vrais services

1. Aller à l'admin Django
2. Supprimer les services de démo
3. Ajouter vos vrais services avec vos descriptions

### Personnaliser le design

Fichiers CSS : `src/app/globals.css`
Composants : `src/components/ui/`

---

## 📚 Documentation complète

| Document | Description |
|----------|-------------|
| [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) | Résumé complet de l'intégration |
| [BACKEND_COMPLETE.md](./BACKEND_COMPLETE.md) | Documentation backend |
| [QUICKSTART.md](./QUICKSTART.md) | Guide démarrage original |
| [CHECKLIST.md](./CHECKLIST.md) | Checklist production |
| [backend/API_REFERENCE.md](./backend/API_REFERENCE.md) | Référence API |

---

## 🚀 Prochaines étapes

1. **Tester toutes les fonctionnalités** (voir scénarios ci-dessus)
2. **Personnaliser le contenu** via l'admin Django
3. **Ajouter vos images** (logos, photos articles)
4. **Rédiger vos articles** de blog
5. **Configurer les emails** (optionnel)
6. **Préparer le déploiement** (voir CHECKLIST.md)

---

## ✨ Félicitations !

Votre site dynamique est opérationnel !

**Ce qui fonctionne :**
- ✅ Services gérés depuis l'admin
- ✅ Contacts envoyés à la base de données
- ✅ Rendez-vous demandés en ligne
- ✅ Blog publié et consultable
- ✅ Administration centralisée

**Prêt pour :**
- La personnalisation du contenu
- L'ajout de vraies données
- Le déploiement en production

---

**Besoin d'aide ?** Consultez la documentation ou vérifiez les logs dans les terminaux.

**Bon développement !** 🎉
