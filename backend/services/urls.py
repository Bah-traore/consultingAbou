from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.ServiceListView.as_view(), name='service-list'),
    path('<slug:slug>/', views.ServiceDetailView.as_view(), name='service-detail'),
    
    # Admin endpoints
    path('admin/', views.ServiceAdminListView.as_view(), name='service-admin-list'),
    path('admin/<int:pk>/', views.ServiceAdminDetailView.as_view(), name='service-admin-detail'),
]
