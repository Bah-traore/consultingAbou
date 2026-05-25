from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.TemoignageListView.as_view(), name='temoignage-list'),
    path('create/', views.TemoignageCreateView.as_view(), name='temoignage-create'),
    
    # Admin endpoints
    path('admin/', views.TemoignageAdminListView.as_view(), name='temoignage-admin-list'),
    path('admin/<int:pk>/', views.TemoignageAdminDetailView.as_view(), name='temoignage-admin-detail'),
]
