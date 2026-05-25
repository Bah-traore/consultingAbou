# API Endpoints pour l'interface Admin React

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Services
router.register(r'services', views.ServiceAdminViewSet, basename='service-admin')

# Partenaires
router.register(r'partenaires', views.PartenaireAdminViewSet, basename='partenaire-admin')

# Témoignages
router.register(r'temoignages', views.TemoignageAdminViewSet, basename='temoignage-admin')

# Articles/Blog
router.register(r'articles', views.ArticleAdminViewSet, basename='article-admin')

# Contacts
router.register(r'contacts', views.ContactAdminViewSet, basename='contact-admin')

# Rendez-vous
router.register(r'rendezvous', views.RendezVousAdminViewSet, basename='rendezvous-admin')

# Personnalisation du site
router.register(r'customization', views.SiteCustomizationAdminViewSet, basename='customization-admin')

# Slides
router.register(r'slides', views.SlideAdminViewSet, basename='slide-admin')

urlpatterns = [
    path('', include(router.urls)),
    
    # Statistiques dashboard
    path('stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
]
