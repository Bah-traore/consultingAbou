from django.urls import path
from . import views

urlpatterns = [
    # Public endpoint - récupérer la personnalisation active
    path('', views.SiteCustomizationView.as_view(), name='site-customization'),
    
    # Public endpoint - récupérer les slides du diaporama
    path('slides/', views.SlideListView.as_view(), name='slides-list'),
    
    # Admin endpoint - modifier la personnalisation
    path('admin/', views.SiteCustomizationAdminView.as_view(), name='site-customization-admin'),
]
