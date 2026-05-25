# Instructions de configuration de R2 Storage

Pour utiliser Cloudflare R2 comme stockage pour les images et médias, suivez ces étapes :

## 1. Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` dans le répertoire `backend/` :

```bash
# Activation du stockage R2
USE_R2_MEDIA=true

# Informations d'identification R2
R2_ACCESS_KEY_ID=votre_access_key_id
R2_SECRET_ACCESS_KEY=votre_secret_access_key
R2_BUCKET_NAME=votre_bucket_name
R2_ENDPOINT_URL=https://votre_compte_id.r2.cloudflarestorage.com
R2_CUSTOM_DOMAIN=votre_domaine_optionnel.r2.cfarg.co # Optionnel
R2_REGION_NAME=auto # Généralement 'auto' pour R2
```

## 2. Paramètres de localisation (optionnels)

```bash
# Localisations personnalisées dans le bucket R2
R2_LOCATION=
R2_MEDIA_LOCATION=media
R2_PUBLIC_MEDIA_LOCATION=public
R2_SENSITIVE_MEDIA_LOCATION=private
```

## 3. Obtenir les informations depuis Cloudflare

1. Connectez-vous à votre tableau de bord Cloudflare
2. Allez dans R2 > Buckets
3. Créez un nouveau bucket ou sélectionnez un existant
4. Cliquez sur "Manage R2 API Access"
5. Copiez les valeurs pour remplir les variables d'environnement

## 4. Types de stockage disponibles

Notre système utilise différents types de stockage R2 :

- `R2PublicMediaStorage` : Pour les images publiques (logos, photos, etc.)
- `R2SensitiveMediaStorage` : Pour les médias sensibles (requiert authentification)
- `R2DocumentsStorage` : Pour les documents privés

## 5. Modèles concernés

Les modèles suivants utilisent maintenant R2 Storage pour leurs champs d'images :

- `Service.image` : Stocke les images des services
- `Temoignage.photo` : Stocke les photos des témoignages
- `Slide.image` : Stocke les images des slides
- `SiteCustomization` : Stocke toutes les images de personnalisation
- `Article.featured_image` : Stocke les images principales des articles
- `Partenaire.logo` : Stocke les logos des partenaires

## 6. Remarques importantes

- Une fois `USE_R2_MEDIA=true` activé, tous les nouveaux fichiers seront stockés sur R2
- Les fichiers existants resteront sur le stockage local jusqu'à ce qu'ils soient remplacés
- Assurez-vous que votre bucket R2 est correctement configuré pour accepter les uploads
- Les permissions doivent être correctement configurées pour que l'application puisse lire/écrire sur R2

## 7. Dépannage

Si vous rencontrez des problèmes :
- Vérifiez que toutes les variables d'environnement sont correctement définies
- Assurez-vous que les clés d'accès ont les permissions nécessaires
- Vérifiez que le bucket existe et est accessible
- Consultez les logs de votre application pour plus de détails sur les erreurs