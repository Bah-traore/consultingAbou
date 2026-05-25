# 🔧 Corrections et Dépannage

## Problème résolu : Erreur 401 (Unauthorized) sur l'API

### Symptôme
```
GET http://127.0.0.1:8000/api/articles/ 401 (Unauthorized)
API Error: Error: HTTP error! status: 401
```

### Cause
La configuration par défaut de Django REST Framework utilisait `IsAuthenticatedOrReadOnly` comme permission par défaut, ce qui nécessitait une authentification même pour les requêtes GET (lecture).

### Solution
Modification du fichier `backend/consulting_api/settings.py` :

**Avant :**
```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}
```

**Après :**
```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}
```

### Protection des endpoints admin
Les endpoints d'administration sont toujours protégés car ils spécifient explicitement :
```python
permission_classes = [permissions.IsAdminUser]
```

Cela inclut :
- `/api/contacts/list/` - Liste contacts (admin)
- `/api/rendezvous/list/` - Liste RDV (admin)
- `/api/services/admin/` - CRUD services (admin)
- `/api/partenaires/admin/` - CRUD partenaires (admin)
- `/api/temoignages/admin/` - Modération témoignages (admin)
- `/api/articles/admin/` - CRUD articles (admin)

### Endpoints publics (sans authentification)
- `GET /api/services/` - Liste services
- `GET /api/partenaires/` - Liste partenaires
- `GET /api/temoignages/` - Témoignages approuvés
- `GET /api/articles/` - Articles publiés
- `POST /api/contacts/` - Créer contact
- `POST /api/rendezvous/` - Créer RDV
- `POST /api/temoignages/create/` - Soumettre témoignage

### Redémarrage nécessaire
Après modification des settings Django, il faut redémarrer le serveur :
```bash
# Arrêter le serveur
pkill -f "python manage.py runserver"

# Redémarrer
cd backend
python manage.py runserver 8000
```

---

## Autres problèmes courants

### Problème : CORS Error

**Symptôme :**
```
Access to fetch at 'http://127.0.0.1:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution :**
Vérifier que `backend/consulting_api/settings.py` contient :
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

### Problème : Module not found

**Symptôme :**
```
ModuleNotFoundError: No module named 'xxx'
```

**Solution :**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Problème : Port déjà utilisé

**Symptôme :**
```
Error: That port is already in use
```

**Solution :**
```bash
# Trouver le processus
lsof -i :8000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
python manage.py runserver 8001
```

### Problème : Migration non appliquée

**Symptôme :**
```
django.db.utils.OperationalError: no such table: xxx
```

**Solution :**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Problème : Fichiers média non trouvés

**Symptôme :**
Images ou logos ne s'affichent pas

**Solution :**
Vérifier que `next.config.js` contient :
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '8000',
      pathname: '/media/**',
    },
  ],
},
```

---

## Vérifications rapides

### Tester l'API
```bash
# Services
curl http://127.0.0.1:8000/api/services/

# Articles
curl http://127.0.0.1:8000/api/articles/

# Créer un contact
curl -X POST http://127.0.0.1:8000/api/contacts/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@test.com","subject":"Test","message":"Message"}'
```

### Vérifier l'admin
- URL : http://127.0.0.1:8000/admin/
- Login : admin
- Password : admin123

### Vérifier le frontend
- Accueil : http://localhost:3000
- Contact : http://localhost:3000/contact
- Blog : http://localhost:3000/blog

---

## Logs utiles

### Backend Django
Les logs apparaissent dans le terminal où Django tourne :
```
[18/May/2026 13:41:58] "GET /api/articles/ HTTP/1.1" 200 1234
```

### Frontend Next.js
- Console du navigateur (F12)
- Terminal où Next.js tourne

### Base de données
```bash
cd backend
python manage.py dbshell
# Pour SQLite :
sqlite3 db.sqlite3
.tables
.quit
```

---

## Support

Si un problème persiste :
1. Vérifier les logs Django et Next.js
2. Redémarrer les deux serveurs
3. Consulter la documentation dans le dossier `backend/`
4. Vérifier que toutes les migrations sont appliquées

---

**Dernière mise à jour :** 18 Mai 2026  
**Problème corrigé :** Erreur 401 sur endpoints API publics
