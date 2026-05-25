from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.RendezVousCreateView.as_view(), name='rendezvous-create'),
    
    # Admin endpoints
    path('list/', views.RendezVousListView.as_view(), name='rendezvous-list'),
    path('<int:pk>/', views.RendezVousDetailView.as_view(), name='rendezvous-detail'),
]
