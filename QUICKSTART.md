# 🚀 Guide de Démarrage Rapide - Abou BAH Consulting

## ✅ Ce qui a été implémenté

### Backend Django (COMPLET)
- ✅ API REST complète avec Django REST Framework
- ✅ 7 applications fonctionnelles (accounts, contacts, rendezvous, services, partenaires, témoignages, blog)
- ✅ Authentification JWT
- ✅ Interface d'administration complète et personnalisée
- ✅ Upload de fichiers (logos, images)
- ✅ Base de données SQLite avec migrations
- ✅ CORS configuré pour Next.js
- ✅ Données de démonstration incluses
- ✅ Documentation complète

### Frontend Next.js (PRÊT POUR INTÉGRATION)
- ✅ Configuration API (`src/lib/api.ts`)
- ✅ Types TypeScript pour toutes les ressources
- ✅ Hook personnalisé `useFetch`
- ✅ Composant exemple `ServicesSection`
- ✅ Configuration des images distantes
- ✅ Variables d'environnement

## 🎯 Démarrer le projet en 3 étapes

### Étape 1: Lancer le Backend Django

```bash
# Ouvrir un terminal
cd /home/bah/Bureau/application/consultingSite/backend

# Utiliser le script automatique
chmod +x start.sh
./start.sh
```

**OU manuellement :**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_admin
python manage.py create_sample_data
python manage.py runserver 8000
```

✅ Backend disponible à : http://127.0.0.1:8000
✅ Admin disponible à : http://127.0.0.1:8000/admin/
   - Username: `admin`
   - Password: `admin123`

### Étape 2: Lancer le Frontend Next.js

```bash
# Ouvrir un DEUXIÈME terminal
cd /home/bah/Bureau/application/consultingSite

# Installer les dépendances (si pas déjà fait)
npm install

# Lancer le serveur
npm run dev
```

✅ Frontend disponible à : http://localhost:3000

### Étape 3: Tester l'intégration

1. **Vérifier l'API Django :**
   ```bash
   curl http://127.0.0.1:8000/api/services/
   ```

2. **Accéder à l'admin Django :**
   - Aller à http://127.0.0.1:8000/admin/
   - Se connecter avec admin/admin123
   - Explorer les différentes sections

3. **Tester les endpoints :**
   - Services: http://127.0.0.1:8000/api/services/
   - Partenaires: http://127.0.0.1:8000/api/partenaires/
   - Articles: http://127.0.0.1:8000/api/articles/

## 📋 Prochaines étapes recommandées

### 1. Intégrer les services dynamiques dans la page d'accueil

Dans `src/app/page.tsx`, remplacer la section services statique par :

```typescript
import ServicesSection from "@/components/ServicesSection";

// Dans le return, remplacer la section #services par :
<ServicesSection />
```

### 2. Créer un formulaire de contact fonctionnel

Créer `src/components/ContactForm.tsx` :

```typescript
"use client";
import { useState } from "react";
import { contactsAPI } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      await contactsAPI.create(data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (success) {
    return <div className="text-green-600">Message envoyé avec succès !</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Champs du formulaire */}
      <input {...register("first_name")} placeholder="Prénom" />
      {errors.first_name && <span>{errors.first_name.message}</span>}
      
      <input {...register("last_name")} placeholder="Nom" />
      <input {...register("email")} placeholder="Email" />
      <input {...register("subject")} placeholder="Sujet" />
      <textarea {...register("message")} placeholder="Message" />
      
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### 3. Ajouter une page Blog

Créer `src/app/blog/page.tsx` :

```typescript
"use client";
import { useEffect, useState } from "react";
import { articlesAPI, Article } from "@/lib/api";
import Link from "next/link";

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    articlesAPI.getAll().then(data => setArticles(data.results || []));
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <Link key={article.id} href={`/blog/${article.slug}`}>
            <div className="border rounded-lg p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-muted-foreground mt-2">{article.excerpt}</p>
              <p className="text-sm text-gray-500 mt-4">{article.author_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Commandes utiles

### Backend Django

```bash
# Accéder au shell Django
python manage.py shell

# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques (production)
python manage.py collectstatic

# Lancer le serveur
python manage.py runserver
```

### Frontend Next.js

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start
```

## 📊 Fonctionnalités disponibles

### Via l'interface Admin Django

1. **Contacts** : Voir et gérer toutes les demandes de contact
2. **Rendez-vous** : Valider, modifier, annuler les RDV
3. **Services** : Ajouter/modifier les services proposés
4. **Partenaires** : Gérer le carrousel de partenaires (avec logos)
5. **Témoignages** : Modérer et publier les témoignages clients
6. **Articles** : Rédiger et publier des articles de blog
7. **Utilisateurs** : Gérer les administrateurs

### Via l'API REST

Toutes les opérations CRUD sont disponibles via l'API pour intégration avec :
- Application mobile
- Site web Next.js
- Applications tierces

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier que le port 8000 est libre
lsof -i :8000

# Tuer le processus si nécessaire
kill -9 <PID>
```

### Erreur CORS
Vérifier que `CORS_ALLOWED_ORIGINS` dans `backend/consulting_api/settings.py` inclut `http://localhost:3000`

### Module non trouvé
```bash
# Réinstaller les dépendances
pip install -r requirements.txt
```

### Next.js ne se connecte pas à l'API
1. Vérifier que Django tourne sur le port 8000
2. Vérifier `.env.local` contient `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
3. Redémarrer le serveur Next.js

## 📚 Documentation complète

- **Backend** : `backend/README.md`
- **Intégration** : `INTEGRATION.md`
- **API Endpoints** : Voir `backend/README.md` section API Endpoints

## 🎉 Félicitations !

Votre site de cabinet de consultation pédagogique est maintenant opérationnel avec :
- ✅ Un backend Django robuste et complet
- ✅ Une interface d'administration puissante
- ✅ Une API REST prête pour l'intégration
- ✅ Un frontend Next.js moderne

Prochaine étape : Personnaliser le contenu et déployer en production ! 🚀

---

**Besoin d'aide ?** Consultez la documentation ou contactez l'équipe de développement.
