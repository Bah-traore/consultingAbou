from __future__ import annotations

import os
import uuid

from django.conf import settings
from django.core.files.base import ContentFile

try:
    from storages.backends.s3boto3 import S3Boto3Storage
except Exception:  # pragma: no cover
    S3Boto3Storage = object  # type: ignore


class R2DocumentsStorage(S3Boto3Storage):
    bucket_name = getattr(settings, 'R2_BUCKET_NAME', None)
    access_key = getattr(settings, 'R2_ACCESS_KEY_ID', None)
    secret_key = getattr(settings, 'R2_SECRET_ACCESS_KEY', None)

    def deconstruct(self):
        """Rendre ce storage sérialisable dans les migrations."""
        path = f"{self.__class__.__module__}.{self.__class__.__name__}"
        return path, (), {}
    region_name = getattr(settings, 'R2_REGION_NAME', 'auto')
    endpoint_url = getattr(settings, 'R2_ENDPOINT_URL', None)

    default_acl = 'private'
    file_overwrite = False
    querystring_auth = True

    custom_domain = getattr(settings, 'R2_CUSTOM_DOMAIN', None)

    # R2 can return 401/403 on HeadObject if credentials or policies are misconfigured.
    # We catch ClientError (403/404) to avoid crashing the application.
    def exists(self, name):  # type: ignore[override]
        try:
            return super().exists(name)
        except Exception as e:
            from botocore.exceptions import ClientError
            if isinstance(e, ClientError):
                error_code = str(e.response.get('Error', {}).get('Code', ''))
                if error_code in ('403', '404', 'Forbidden', 'NoSuchKey', 'AccessDenied'):
                    return False
            raise

    # Compat: certains environnements peuvent fournir un backend partiel.
    # Django attend generate_filename() sur le storage.
    def generate_filename(self, filename):  # type: ignore[override]
        try:
            return super().generate_filename(filename)
        except Exception:
            return filename

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @property
    def location(self):  # type: ignore[override]
        return getattr(settings, 'R2_LOCATION', '')


class R2MediaStorage(S3Boto3Storage):
    """Storage R2 pour les médias généraux (logos, images, pièces, etc.)."""

    bucket_name = getattr(settings, 'R2_BUCKET_NAME', None)
    access_key = getattr(settings, 'R2_ACCESS_KEY_ID', None)
    secret_key = getattr(settings, 'R2_SECRET_ACCESS_KEY', None)
    region_name = getattr(settings, 'R2_REGION_NAME', 'auto')
    endpoint_url = getattr(settings, 'R2_ENDPOINT_URL', None)

    # Par défaut: privé + URLs signées (plus sûr). On peut dériver une classe publique si besoin.
    default_acl = 'private'
    file_overwrite = False
    querystring_auth = True

    custom_domain = getattr(settings, 'R2_CUSTOM_DOMAIN', None)

    # R2 can return 401/403 on HeadObject if credentials or policies are misconfigured.
    # We catch ClientError (403/404) to avoid crashing the application.
    def exists(self, name):  # type: ignore[override]
        try:
            return super().exists(name)
        except Exception as e:
            from botocore.exceptions import ClientError
            if isinstance(e, ClientError):
                error_code = str(e.response.get('Error', {}).get('Code', ''))
                if error_code in ('403', '404', 'Forbidden', 'NoSuchKey', 'AccessDenied'):
                    return False
            raise

    @property
    def location(self):  # type: ignore[override]
        return getattr(settings, 'R2_MEDIA_LOCATION', getattr(settings, 'R2_LOCATION', ''))

    # Compat: certains environnements peuvent fournir un backend partiel.
    # Django attend generate_filename() sur le storage.
    def generate_filename(self, filename):  # type: ignore[override]
        try:
            return super().generate_filename(filename)
        except Exception:
            return filename


class R2PublicMediaStorage(R2MediaStorage):
    """Médias publics (optionnel)."""

    default_acl = 'public-read'
    querystring_auth = False

    @property
    def location(self):  # type: ignore[override]
        return getattr(settings, 'R2_PUBLIC_MEDIA_LOCATION', getattr(settings, 'R2_MEDIA_LOCATION', getattr(settings, 'R2_LOCATION', '')))


class R2SensitiveMediaStorage(R2MediaStorage):
    """Médias sensibles (privés) : photo profil eleve, signatures, etc."""

    default_acl = 'private'
    querystring_auth = True

    @property
    def location(self):  # type: ignore[override]
        return getattr(
            settings,
            'R2_SENSITIVE_MEDIA_LOCATION',
            getattr(settings, 'R2_MEDIA_LOCATION', getattr(settings, 'R2_LOCATION', '')),
        )


def get_r2_storage(*, is_public: bool = False, is_sensitive: bool = False):
    if is_public:
        return R2PublicMediaStorage()
    if is_sensitive:
        return R2SensitiveMediaStorage()
    return R2MediaStorage()


def r2_build_key(prefix: str, filename: str, *, tenant_subdomain: str | None = None) -> str:
    """Construit la clé R2 avec compartimentage par tenant.

    Structure : {tenant_subdomain}/{prefix}/{uuid}.{ext}
    Exemple   : gestscolairedrm/photos/enseignant/123/abc123.jpg
    """
    parts = []
    if tenant_subdomain:
        parts.append(tenant_subdomain.strip('/'))
    safe_prefix = (prefix or '').strip('/')
    if safe_prefix:
        parts.append(safe_prefix)
    ext = ''
    base = filename or 'file'
    if '.' in base:
        _, ext = os.path.splitext(base)
    parts.append(f"{uuid.uuid4().hex}{ext.lower()}")
    return '/'.join(parts)


def r2_upload_file(
    file_obj,
    *,
    prefix: str,
    filename: str | None = None,
    is_public: bool = False,
    is_sensitive: bool = True,
    tenant_subdomain: str | None = None,
):
    """Upload un fichier vers R2 avec compartimentage par tenant.

    Structure R2 : {tenant_subdomain}/{prefix}/{uuid}.{ext}
    Exemple      : gestscolairedrm/photos/eleves/456/abc123.jpg

    Args:
        tenant_subdomain: Sous-domaine du tenant (ex: 'gestscolairedrm').
                          Si fourni, préfixe automatiquement la clé.
    """
    storage = get_r2_storage(is_public=is_public, is_sensitive=is_sensitive)
    key = r2_build_key(prefix, filename or getattr(file_obj, 'name', 'file'),
                       tenant_subdomain=tenant_subdomain)

    if isinstance(file_obj, (bytes, bytearray)):
        content = ContentFile(file_obj)
        saved_name = storage.save(key, content)
    else:
        saved_name = storage.save(key, file_obj)

    url = storage.url(saved_name)
    size = getattr(file_obj, 'size', None)
    return {
        'public_id': saved_name,
        'secure_url': url,
        'bytes': size,
    }


class TenantUploadPath:
    """Callable sérialisable pour upload_to compartimenté par tenant.

    Usage dans un modèle :
        justificatif = models.FileField(upload_to=TenantUploadPath('remises/justificatifs'))

    Résultat : {tenant_subdomain}/documents/remises/justificatifs/<filename>

    Utilise une classe (au lieu d'une closure) pour être correctement sérialisable
    par le système de migrations Django (via deconstruct()).
    """

    def __init__(self, subfolder: str):
        self.subfolder = subfolder

    def __call__(self, instance, filename):
        subdomain = ''
        tenant = getattr(instance, 'tenant', None)
        if not tenant:
            try:
                # from utilitaires.utils.get_current_tenant import get_current_tenant
                # tenant = get_current_tenant()
                tenant = None
            except Exception:
                tenant = None
        if tenant:
            subdomain = getattr(tenant, 'subdomain', '') or ''
        parts = []
        if subdomain:
            parts.append(subdomain)
        parts.append('documents')
        if self.subfolder:
            parts.append(self.subfolder.strip('/'))
        parts.append(filename)
        return '/'.join(parts)

    def deconstruct(self):
        """Permet à Django de sérialiser correctement cet objet dans les migrations."""
        return (
            f'{self.__class__.__module__}.{self.__class__.__name__}',
            [self.subfolder],
            {},
        )

    def __eq__(self, other):
        return isinstance(other, TenantUploadPath) and self.subfolder == other.subfolder

    def __repr__(self):
        return f'TenantUploadPath({self.subfolder!r})'


# Garder la factory pour rétrocompatibilité éventuelle
def _tenant_upload_path(subfolder: str) -> 'TenantUploadPath':
    return TenantUploadPath(subfolder)


# Instances upload_to prêtes à l'emploi pour les modèles
tenant_depense_path = TenantUploadPath('depenses/justificatifs')
tenant_remise_path = TenantUploadPath('remises/justificatifs')
tenant_permission_attachment_path = TenantUploadPath('permission_requests/attachments')
tenant_bulletin_template_path = TenantUploadPath('bulletin_templates')


def r2_delete_file(key: str, *, is_public: bool = False, is_sensitive: bool = True) -> bool:
    try:
        storage = get_r2_storage(is_public=is_public, is_sensitive=is_sensitive)
        storage.delete(key)
        return True
    except Exception:
        return False


def r2_get_url(key: str, *, is_public: bool = False, is_sensitive: bool = True) -> str | None:
    try:
        storage = get_r2_storage(is_public=is_public, is_sensitive=is_sensitive)
        return storage.url(key)
    except Exception:
        return None


def get_tenant_logo_data_uri(tenant) -> str:
    """Retourne un data URI base64 du logo du tenant (ex: 'data:image/png;base64,...').

    WeasyPrint ne peut pas toujours fetcher les URLs signées R2 (403).
    On embedde donc le logo en base64 directement dans le HTML.
    Retourne une chaîne vide si le logo est introuvable.
    """
    import base64
    import urllib.request

    if not tenant or not getattr(tenant, 'logo', None):
        return ''

    try:
        src = str(tenant.logo).strip()
    except Exception:
        return ''

    if not src:
        return ''

    data = None

    # 1) Fichier local existant
    if os.path.isfile(src):
        try:
            with open(src, 'rb') as f:
                data = f.read()
        except Exception:
            pass

    # 2) Chemin relatif sous MEDIA_ROOT
    if data is None and (not src.startswith('http://')) and (not src.startswith('https://')) and (not os.path.isabs(src)):
        try:
            media_root = getattr(settings, 'MEDIA_ROOT', '') or ''
            if media_root:
                candidate = os.path.join(media_root, src.lstrip('/'))
                if os.path.isfile(candidate):
                    with open(candidate, 'rb') as f:
                        data = f.read()
        except Exception:
            pass

    # 3) Clé R2 → lecture directe depuis le storage
    if data is None and (not src.startswith('http://')) and (not src.startswith('https://')):
        try:
            storage = get_r2_storage(is_public=False, is_sensitive=True)
            with storage.open(src.lstrip('/'), 'rb') as fp:
                data = fp.read()
        except Exception:
            pass

    # 4) Fallback HTTP
    if data is None and (src.startswith('http://') or src.startswith('https://')):
        try:
            with urllib.request.urlopen(src, timeout=5) as resp:
                data = resp.read()
        except Exception:
            pass

    if not data:
        return ''

    # Déterminer le MIME type
    mime = 'image/png'  # défaut
    if src.lower().endswith('.jpg') or src.lower().endswith('.jpeg'):
        mime = 'image/jpeg'
    elif src.lower().endswith('.gif'):
        mime = 'image/gif'
    elif src.lower().endswith('.svg'):
        mime = 'image/svg+xml'
    elif src.lower().endswith('.webp'):
        mime = 'image/webp'
    elif data[:3] == b'\xff\xd8\xff':
        mime = 'image/jpeg'
    elif data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        mime = 'image/webp'

    b64 = base64.b64encode(data).decode('ascii')
    return f'data:{mime};base64,{b64}'
