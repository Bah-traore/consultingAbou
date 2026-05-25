from __future__ import annotations

import os
from typing import Any, BinaryIO, List, Tuple

from django.conf import settings
from django.core.files.storage import Storage as DjangoStorage, FileSystemStorage
from django.core.files.base import ContentFile

from storages.backends.s3boto3 import S3Boto3Storage


def is_r2_enabled() -> bool:
    """Vérifie si R2 est configuré et activé dans les settings."""
    try:
        return getattr(settings, 'USE_R2_MEDIA', False)
    except Exception:
        return False


class _R2Impl(S3Boto3Storage):
    """Implémentation réelle R2 utilisée uniquement quand R2 est activé."""
    
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        # Initialiser les attributs requis par S3Boto3Storage
        self.bucket_name = getattr(settings, 'R2_BUCKET_NAME', '')
        self.access_key_id = getattr(settings, 'R2_ACCESS_KEY_ID', None)
        self.secret_access_key = getattr(settings, 'R2_SECRET_ACCESS_KEY', None)
        self.region_name = getattr(settings, 'R2_REGION_NAME', 'auto')
        self.endpoint_url = getattr(settings, 'R2_ENDPOINT_URL', None)
        self.custom_domain = getattr(settings, 'R2_CUSTOM_DOMAIN', None)
        
        # Ne pas appeler super().__init__() - le bucket sera créé au premier usage
        # Éviter l'initialisation de base_class qui cause des problèmes
        from storages.utils import setting
        self.location = getattr(settings, 'R2_LOCATION', '')
        self._bucket = None
    
    def get_bucket_name(self) -> str:
        """Retourne le nom du bucket avec gestion d'erreur."""
        try:
            return getattr(settings, 'R2_BUCKET_NAME', '')
        except Exception:
            return ''
    
    bucket_name = property(get_bucket_name)
    
    def get_access_key(self) -> str | None:
        """Retourne la clé d'accès."""
        try:
            return getattr(settings, 'R2_ACCESS_KEY_ID', None)
        except Exception:
            return None
    
    access_key = property(lambda self: self.get_access_key())
    
    def get_secret_key(self) -> str | None:
        """Retourne la clé secrète."""
        try:
            return getattr(settings, 'R2_SECRET_ACCESS_KEY', None)
        except Exception:
            return None
    
    secret_key = property(lambda self: self.get_secret_key())
    
    def get_region_name(self) -> str:
        """Retourne le nom de la région."""
        try:
            return getattr(settings, 'R2_REGION_NAME', 'auto')
        except Exception:
            return 'auto'
    
    region_name = property(get_region_name)
    
    def get_endpoint_url(self) -> str | None:
        """Retourne l'URL du point de terminaison."""
        try:
            return getattr(settings, 'R2_ENDPOINT_URL', None)
        except Exception:
            return None
    
    endpoint_url = property(get_endpoint_url)
    
    def get_custom_domain(self) -> str | None:
        """Retourne le domaine personnalisé."""
        try:
            return getattr(settings, 'R2_CUSTOM_DOMAIN', None)
        except Exception:
            return None
    
    custom_domain = property(get_custom_domain)
    
    def _get_bucket(self):
        """Obtient ou crée le bucket R2."""
        if self._bucket is None:
            try:
                from botocore.client import Config
                import boto3
                
                s3_client_kwargs = {
                    'aws_access_key_id': self.access_key_id,
                    'aws_secret_access_key': self.secret_access_key,
                    'endpoint_url': self.endpoint_url,
                }
                
                s3_resource = boto3.resource(
                    's3',
                    **s3_client_kwargs,
                    config=Config(signature_version='s3v4'),
                )
                
                self._bucket = s3_resource.Bucket(self.bucket_name)
            except Exception as e:
                print(f"Erreur lors de la connexion à R2: {e}")
                self._bucket = None
        return self._bucket
    
    def save(self, name: str, content: Any, max_length: int | None = None) -> str:
        """Sauvegarde un fichier dans R2 ou en local selon la configuration."""
        try:
            if not is_r2_enabled():
                # Si R2 n'est pas activé, utiliser le stockage local
                return FileSystemStorage().save(name, content)
            
            # Essayer de sauvegarder sur R2
            r2_storage = _R2Impl()
            
            # Créer un objet ContentFile propre
            if isinstance(content, ContentFile):
                content.file.seek(0)
                actual_content = content.file.read()
                new_content = ContentFile(actual_content, name=name)
            else:
                new_content = ContentFile(content.read(), name=name)
            
            # Sauvegarder sur R2
            saved_name = r2_storage._save_object(name, new_content)
            return saved_name
            
        except Exception as e:
            print(f"Erreur R2 ({type(e).__name__}), fallback vers stockage local: {e}")
            # Fallback vers stockage local
            local_storage = FileSystemStorage()
            try:
                return local_storage.save(name, content)
            except Exception as e2:
                print(f"Erreur aussi sur stockage local: {e2}")
                # Retourner un nom générique si tout échoue
                import uuid
                ext = name.split('.')[-1] if '.' in name else ''
                return f"fallback_{uuid.uuid4().hex}.{ext}"
    
    def _save_object(self, name: str, content: ContentFile) -> str:
        """Sauvegarde un objet directement sur R2 (moteur)."""
        try:
            content.seek(0)
            self._bucket.upload_fileobj(
                content,
                name,
                ExtraArgs={'ACL': 'public-read'}
            )
            return name
        except Exception as e:
            print(f"Erreur upload R2: {e}")
            raise
    
    def url(self, name: str, **kwargs) -> str:
        """Retourne l'URL publique du fichier."""
        try:
            if not is_r2_enabled():
                return FileSystemStorage().url(name)
            
            # Tenter de construire l'URL R2
            custom_domain = getattr(settings, 'R2_CUSTOM_DOMAIN', '')
            if custom_domain:
                clean_name = name.lstrip('/')
                return f"https://{custom_domain}/{clean_name}"
            
            # Sinon, essayer avec endpoint_url
            endpoint_url = getattr(settings, 'R2_ENDPOINT_URL', '')
            if endpoint_url and endpoint_url != 'https://':
                clean_name = name.lstrip('/')
                return f"{endpoint_url.rstrip('/')}/{clean_name}"
            
            # Fallback
            return super().url(name, **kwargs)
        except Exception:
            return ''
    
    def open(self, name: str, mode: str = 'rb') -> BinaryIO | None:
        """Ouvre un fichier depuis R2."""
        try:
            if not is_r2_enabled():
                return FileSystemStorage().open(name, mode)
            
            bucket = self._get_bucket()
            if bucket:
                return bucket.Object(name).get()['Body']
            return None
        except Exception:
            return None
    
    def delete(self, name: str) -> None:
        """Supprime un fichier de R2."""
        try:
            if not is_r2_enabled():
                FileSystemStorage().delete(name)
                return
            
            bucket = self._get_bucket()
            if bucket:
                bucket.Object(name).delete()
        except Exception:
            pass
    
    def exists(self, name: str) -> bool:
        """Vérifie si un fichier existe."""
        try:
            if not is_r2_enabled():
                return FileSystemStorage().exists(name)
            
            bucket = self._get_bucket()
            if bucket:
                return bucket.Object(name).exists()
            return False
        except Exception:
            return False
    
    def listdir(self, path: str = '') -> Tuple[List[str], List[str]]:
        """Liste les fichiers d'un dossier R2."""
        try:
            if not is_r2_enabled():
                return FileSystemStorage().listdir(path)
            
            bucket = self._get_bucket()
            if bucket:
                files = []
                dirs = []
                prefix = path.lstrip('/')
                if prefix:
                    prefix += '/'
                
                for obj in bucket.objects.filter(Prefix=prefix):
                    key = obj.key[len(prefix):] if prefix else obj.key
                    if '/' in key:
                        dir_name = key.split('/')[0]
                        if dir_name not in dirs:
                            dirs.append(dir_name)
                    else:
                        files.append(key)
                return dirs, files
            return [], []
        except Exception:
            return [], []
    
    def size(self, name: str) -> int:
        """Retourne la taille d'un fichier."""
        try:
            if not is_r2_enabled():
                return FileSystemStorage().size(name)
            
            bucket = self._get_bucket()
            if bucket:
                obj = bucket.Object(name)
                return obj.content_length or 0
            return 0
        except Exception:
            return 0
    
    def generate_filename(self, filename: str) -> str:
        """Génère un nom de fichier unique."""
        try:
            # Utiliser le comportement par défaut de S3Boto3Storage
            import hashlib
            import time
            
            h = hashlib.md5(filename.encode()).hexdigest()
            timestamp = time.strftime('%Y%m%d_%H%M%S')
            return f"{timestamp}_{h}_{filename}"
        except Exception:
            return filename
    
    def get_accessed_time(self, name: str) -> Any:
        """Retourne la date d'accès."""
        from datetime import datetime
        try:
            if not is_r2_enabled():
                return FileSystemStorage().get_accessed_time(name)
            
            bucket = self._get_bucket()
            if bucket:
                obj = bucket.Object(name)
                return obj.last_modified
            return datetime.now()
        except Exception:
            from datetime import datetime
            return datetime.now()
    
    def get_created_time(self, name: str) -> Any:
        """Retourne la date de création."""
        from datetime import datetime
        try:
            if not is_r2_enabled():
                return FileSystemStorage().get_created_time(name)
            
            bucket = self._get_bucket()
            if bucket:
                obj = bucket.Object(name)
                return obj.last_modified
            return datetime.now()
        except Exception:
            from datetime import datetime
            return datetime.now()
    
    def get_modified_time(self, name: str) -> Any:
        """Retourne la date de modification."""
        from datetime import datetime
        try:
            if not is_r2_enabled():
                return FileSystemStorage().get_modified_time(name)
            
            bucket = self._get_bucket()
            if bucket:
                obj = bucket.Object(name)
                return obj.last_modified
            return datetime.now()
        except Exception:
            from datetime import datetime
            return datetime.now()
    
    def get_available_name(self, name: str, max_length: int | None = None) -> str:
        """Retourne un nom de fichier disponible."""
        return name
    
    def path(self, name: str) -> str:
        """Retourne le chemin local (non applicable pour R2)."""
        return name
    
    def deconstruct(self) -> Tuple[str, List, Dict]:
        """Permet la sérialisation pour les migrations."""
        return (
            f'{__name__}.R2MediaStorage',
            [],
            {},
        )


class R2BaseStorage(DjangoStorage):
    """
    Storage qui utilise R2 (S3Boto3Storage) si configuré,
    sinon fait un fallback transparent vers FileSystemStorage local.
    """

    def __init__(self, **kwargs):
        self._kwargs = kwargs
        self._r2_impl: _R2Impl | None = None
        self._local_storage: FileSystemStorage | None = None

    def _get_r2_impl(self) -> _R2Impl:
        """Retourne (ou crée) l'implémentation R2."""
        if self._r2_impl is None:
            self._r2_impl = _R2Impl(**self._kwargs)
        return self._r2_impl

    def _get_local(self) -> FileSystemStorage:
        """Retourne (ou crée) le storage local."""
        if self._local_storage is None:
            self._local_storage = FileSystemStorage()
        return self._local_storage

    def url(self, name: str, **kwargs) -> str:
        if is_r2_enabled():
            try:
                return self._get_r2_impl().url(name, **kwargs)
            except Exception:
                return ''
        return self._get_local().url(name, **kwargs)

    def open(self, name: str, mode: str = 'rb') -> BinaryIO | None:
        if is_r2_enabled():
            try:
                return self._get_r2_impl().open(name, mode)
            except Exception:
                return self._get_local().open(name, mode)
        return self._get_local().open(name, mode)

    def save(self, name: str, content: Any, max_length: int | None = None) -> str:
        if is_r2_enabled():
            try:
                return self._get_r2_impl().save(name, content, max_length=max_length)
            except Exception:
                return self._get_local().save(name, content, max_length=max_length)
        return self._get_local().save(name, content, max_length=max_length)

    def delete(self, name: str) -> None:
        if is_r2_enabled():
            try:
                self._get_r2_impl().delete(name)
            except Exception:
                pass
        try:
            self._get_local().delete(name)
        except Exception:
            pass

    def exists(self, name: str) -> bool:
        try:
            if is_r2_enabled():
                return self._get_r2_impl().exists(name)
            return self._get_local().exists(name)
        except Exception:
            return False

    def listdir(self, path: str = '') -> Tuple[List[str], List[str]]:
        try:
            if is_r2_enabled():
                return self._get_r2_impl().listdir(path)
            return self._get_local().listdir(path)
        except Exception:
            return [], []

    def size(self, name: str) -> int:
        try:
            if is_r2_enabled():
                return self._get_r2_impl().size(name)
            return self._get_local().size(name)
        except Exception:
            return 0

    def generate_filename(self, filename: str) -> str:
        if is_r2_enabled():
            try:
                return self._get_r2_impl().generate_filename(filename)
            except Exception:
                return filename
        return self._get_local().generate_filename(filename)

    def deconstruct(self) -> Tuple[str, List, Dict]:
        """Rendre ce storage sérialisable dans les migrations."""
        return (
            f"{__name__}.{self.__class__.__name__}",
            [],
            {},
        )

    def path(self, name: str) -> str:
        """Nécessaire pour l'interface Storage de Django."""
        if not is_r2_enabled():
            return self._get_local().path(name)
        return name

    def get_accessed_time(self, name: str) -> Any:
        """Nécessaire pour l'interface Storage de Django."""
        try:
            if is_r2_enabled():
                return self._get_r2_impl().get_accessed_time(name)
            return self._get_local().get_accessed_time(name)
        except Exception:
            from datetime import datetime
            return datetime.now()

    def get_created_time(self, name: str) -> Any:
        """Nécessaire pour l'interface Storage de Django."""
        try:
            if is_r2_enabled():
                return self._get_r2_impl().get_created_time(name)
            return self._get_local().get_created_time(name)
        except Exception:
            from datetime import datetime
            return datetime.now()

    def get_modified_time(self, name: str) -> Any:
        """Nécessaire pour l'interface Storage de Django."""
        try:
            if is_r2_enabled():
                return self._get_r2_impl().get_modified_time(name)
            return self._get_local().get_modified_time(name)
        except Exception:
            from datetime import datetime
            return datetime.now()

    def get_available_name(self, name: str, max_length: int | None = None) -> str:
        """Nécessaire pour l'interface Storage de Django."""
        try:
            if is_r2_enabled():
                return self._get_r2_impl().get_available_name(name, max_length=max_length)
            return self._get_local().get_available_name(name, max_length=max_length)
        except Exception:
            return name


class R2DocumentsStorage(R2BaseStorage):
    """Storage pour les documents comptables."""

    file_overwrite = False
    querystring_auth = True
    default_acl = 'private'

    def exists(self, name: str) -> bool:
        return False

    @property
    def location(self) -> str:
        return getattr(settings, 'R2_LOCATION', '')


class R2MediaStorage(R2BaseStorage):
    """Storage R2 pour les médias généraux."""

    file_overwrite = False
    querystring_auth = True
    default_acl = 'public-read'

    @property
    def location(self) -> str:
        return getattr(settings, 'R2_MEDIA_LOCATION', getattr(settings, 'R2_LOCATION', ''))


class R2PublicMediaStorage(R2MediaStorage):
    """Médias publics (ex: photos de signalements)."""

    default_acl = 'public-read'
    querystring_auth = False

    @property
    def location(self) -> str:
        return getattr(
            settings,
            'R2_PUBLIC_MEDIA_LOCATION',
            getattr(settings, 'R2_MEDIA_LOCATION', getattr(settings, 'R2_LOCATION', ''))
        )


class R2SensitiveMediaStorage(R2MediaStorage):
    """Médias sensibles (ex: avatars, pièces d'identité)."""

    default_acl = 'private'
    querystring_auth = True

    @property
    def location(self) -> str:
        return getattr(
            settings,
            'R2_SENSITIVE_MEDIA_LOCATION',
            getattr(settings, 'R2_MEDIA_LOCATION', getattr(settings, 'R2_LOCATION', '')),
        )