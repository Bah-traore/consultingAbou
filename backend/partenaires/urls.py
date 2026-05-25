from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.PartenaireListView.as_view(), name='partenaire-list'),
    
    # Admin endpoints
    path('admin/', views.PartenaireAdminListView.as_view(), name='partenaire-admin-list'),
    path('admin/<int:pk>/', views.PartenaireAdminDetailView.as_view(), name='partenaire-admin-detail'),
]
