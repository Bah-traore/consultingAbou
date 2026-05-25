/**
 * Utilitaire API centralisé pour les appels au backend Django
 * Gère automatiquement l'URL de l'API et l'authentification JWT
 */

const getApiUrl = (endpoint: string): string => {
   const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('0.0.0.0', 'localhost');
  // Assurer que l'endpoint commence par '/' pour une concaténation correcte
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
};

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

/**
 * Fonction fetch wrapper qui ajoute automatiquement le token d'authentification
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    ...(fetchOptions.headers as HeadersInit),
  };

  // Ajouter le token d'authentification si requis
  if (requireAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Ajouter Content-Type si c'est une requête POST/PUT avec body JSON
  if (fetchOptions.method && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method)) {
    if (!headers['Content-Type'] && !(fetchOptions.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Gérer le rafraîchissement du token si 401
    if (response.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Tenter de rafraîchir le token
          const refreshResponse = await fetch(getApiUrl('/api/auth/token/refresh/'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access);
            
            // Réessayer la requête originale avec le nouveau token
            headers['Authorization'] = `Bearer ${data.access}`;
            return await fetch(url, {
              ...fetchOptions,
              headers,
            });
          }
        } catch (error) {
          console.error('Échec du rafraîchissement du token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Helper pour faire une requête GET
 */
export async function apiGet<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, { ...options, method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Helper pour faire une requête POST
 */
export async function apiPost<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  const response = await apiFetch(endpoint, { 
    ...options, 
    method: 'POST', 
    body 
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }
  
  // Pour les réponses sans contenu (204), retourner null
  if (response.status === 204) {
    return null as unknown as T;
  }
  
  return response.json();
}

/**
 * Helper pour faire une requête PUT
 */
export async function apiPut<T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  const response = await apiFetch(endpoint, { 
    ...options, 
    method: 'PUT', 
    body 
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Helper pour faire une requête PATCH
 */
export async function apiPatch<T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  const response = await apiFetch(endpoint, { 
    ...options, 
    method: 'PATCH', 
    body 
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Helper pour faire une requête DELETE
 */
export async function apiDelete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(endpoint, { ...options, method: 'DELETE' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }
  
  // Pour les réponses sans contenu (204), retourner null
  if (response.status === 204) {
    return null as unknown as T;
  }
  
  return response.json();
}

// Exporter l'URL de base pour utilisation directe si nécessaire
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
};

// Types pour les données
export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteCustomization {
  id: number;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  category?: string;
  slug?: string;
  image?: string;
  is_active: boolean;
  order: number;
  service_background_color: string;
  service_title_color: string;
  service_description_color: string;
  service_category_color: string;
  service_category_text_color: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  author_name?: string;
  featured_image?: string;
  status: string;
  published_at: string;
  created_at: string;
  tags_list?: string[];
  article_card_background_color: string;
  article_title_color: string;
  article_excerpt_color: string;
  article_tag_background_color: string;
  article_tag_text_color: string;
}

export interface Temoignage {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  content?: string;
  comment?: string;
  rating: number;
  status: string;
  created_at: string;
  photo?: string;
}

  // Exporter les endpoints connus (doit être avant les API helpers qui les référencent)
  export const API_ENDPOINTS = {
    // Authentification
    AUTH: {
      TOKEN: '/api/auth/token/',
      TOKEN_REFRESH: '/api/auth/token/refresh/',
    },
    
    // Dashboard
    DASHBOARD: {
      STATS: '/api/admin/stats/',
    },
    
    // Services
    SERVICES: {
      LIST: '/api/services/',
      DETAIL: (id: number) => `/api/services/${id}/`,
      ADMIN_LIST: '/api/admin/services/',
      ADMIN_DETAIL: (id: number) => `/api/admin/services/${id}/`,
      STATS: '/api/admin/services/stats/',
    },
    
    // Partenaires
    PARTENAIRES: {
      LIST: '/api/partenaires/',
      DETAIL: (id: number) => `/api/partenaires/${id}/`,
      ADMIN_LIST: '/api/admin/partenaires/',
      ADMIN_DETAIL: (id: number) => `/api/admin/partenaires/${id}/`,
      STATS: '/api/admin/partenaires/stats/',
    },
    
    // Témoignages
    TEMOIGNAGES: {
      LIST: '/api/temoignages/',
      DETAIL: (id: number) => `/api/temoignages/${id}/`,
      CREATE: '/api/temoignages/create/',
      ADMIN_LIST: '/api/temoignages/admin/',
      ADMIN_DETAIL: (id: number) => `/api/temoignages/admin/${id}/`,
      APPROVE: (id: number) => `/api/temoignages/admin/${id}/approve/`,
      REJECT: (id: number) => `/api/temoignages/admin/${id}/reject/`,
      PENDING: '/api/temoignages/admin/pending/',
      STATS: '/api/admin/temoignages/stats/',
    },
  
  // Articles
  ARTICLES: {
    LIST: '/api/articles/',
    DETAIL: (id: number) => `/api/articles/${id}/`,
    GET_BY_SLUG: (slug: string) => `/api/articles/${slug}/`,
    ADMIN_LIST: '/api/admin/articles/',
    ADMIN_DETAIL: (id: number) => `/api/admin/articles/${id}/`,
    PUBLISH: (id: number) => `/api/admin/articles/${id}/publish/`,
    DRAFTS: '/api/admin/articles/drafts/',
    PUBLISHED: '/api/admin/articles/published/',
    STATS: '/api/admin/articles/stats/',
  },
  
  // Contacts
  CONTACTS: {
    LIST: '/api/admin/contacts/',
    DETAIL: (id: number) => `/api/admin/contacts/${id}/`,
    MARK_READ: (id: number) => `/api/admin/contacts/${id}/mark_read/`,
    UNREAD: '/api/admin/contacts/unread/',
    STATS: '/api/admin/contacts/stats/',
  },
  
  // Rendez-vous
  RENDEZVOUS: {
    LIST: '/api/admin/rendezvous/',
    DETAIL: (id: number) => `/api/admin/rendezvous/${id}/`,
    CONFIRM: (id: number) => `/api/admin/rendezvous/${id}/confirm/`,
    CANCEL: (id: number) => `/api/admin/rendezvous/${id}/cancel/`,
    UPCOMING: '/api/admin/rendezvous/upcoming/',
    STATS: '/api/admin/rendezvous/stats/',
  },
  
  // Slides
  SLIDES: {
    LIST: '/api/customization/slides/',
    DETAIL: (id: number) => `/api/customization/slides/${id}/`,
    ADMIN_LIST: '/api/admin/slides/',
    ADMIN_DETAIL: (id: number) => `/api/admin/slides/${id}/`,
    STATS: '/api/admin/slides/stats/',
  },
  
  // Customization
  CUSTOMIZATION: {
    GET: '/api/admin/customization/',
    UPDATE: (id: number) => `/api/admin/customization/${id}/`,
  },
} as const;

// API helpers pour les endpoints spécifiques
export const slidesAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.SLIDES.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.SLIDES.DETAIL(id)),
  create: (data: any) => apiPost(API_ENDPOINTS.SLIDES.LIST, data),
  update: (id: number, data: any) => apiPut(API_ENDPOINTS.SLIDES.DETAIL(id), data),
  delete: (id: number) => apiDelete(API_ENDPOINTS.SLIDES.DETAIL(id)),
};

export const customizationAPI = {
  get: () => apiGet<any>(API_ENDPOINTS.CUSTOMIZATION.GET),
  update: (id: number, data: any) => apiPatch(API_ENDPOINTS.CUSTOMIZATION.UPDATE(id), data),
};

export const servicesAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.SERVICES.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.SERVICES.DETAIL(id)),
  create: (data: any) => apiPost(API_ENDPOINTS.SERVICES.LIST, data),
  update: (id: number, data: any) => apiPut(API_ENDPOINTS.SERVICES.DETAIL(id), data),
  delete: (id: number) => apiDelete(API_ENDPOINTS.SERVICES.DETAIL(id)),
};

export const articlesAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.ARTICLES.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.ARTICLES.DETAIL(id)),
  getBySlug: (slug: string) => apiGet<any>(`/api/blog/articles/${slug}/`),
  create: (data: any) => apiPost(API_ENDPOINTS.ARTICLES.LIST, data),
  update: (id: number, data: any) => apiPut(API_ENDPOINTS.ARTICLES.DETAIL(id), data),
  delete: (id: number) => apiDelete(API_ENDPOINTS.ARTICLES.DETAIL(id)),
  publish: (id: number) => apiPost(API_ENDPOINTS.ARTICLES.PUBLISH(id)),
};

export const temoignagesAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.TEMOIGNAGES.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.TEMOIGNAGES.DETAIL(id)),
  approve: (id: number) => apiPost(API_ENDPOINTS.TEMOIGNAGES.APPROVE(id)),
  reject: (id: number) => apiPost(API_ENDPOINTS.TEMOIGNAGES.REJECT(id)),
};

export const partenairesAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.PARTENAIRES.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.PARTENAIRES.DETAIL(id)),
  create: (data: any) => apiPost(API_ENDPOINTS.PARTENAIRES.LIST, data),
  update: (id: number, data: any) => apiPut(API_ENDPOINTS.PARTENAIRES.DETAIL(id), data),
  delete: (id: number) => apiDelete(API_ENDPOINTS.PARTENAIRES.DETAIL(id)),
};

export const contactsAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.CONTACTS.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.CONTACTS.DETAIL(id)),
  markRead: (id: number) => apiPost(API_ENDPOINTS.CONTACTS.MARK_READ(id)),
  create: (data: any) => apiPost(API_ENDPOINTS.CONTACTS.LIST, data),
};

export const rendezvousAPI = {
  getAll: () => apiGet<any>(API_ENDPOINTS.RENDEZVOUS.LIST),
  getById: (id: number) => apiGet<any>(API_ENDPOINTS.RENDEZVOUS.DETAIL(id)),
  confirm: (id: number) => apiPost(API_ENDPOINTS.RENDEZVOUS.CONFIRM(id)),
  cancel: (id: number) => apiPost(API_ENDPOINTS.RENDEZVOUS.CANCEL(id)),
  create: (data: any) => apiPost(API_ENDPOINTS.RENDEZVOUS.LIST, data),
};
