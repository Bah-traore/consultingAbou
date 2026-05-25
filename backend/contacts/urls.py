from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.ContactCreateView.as_view(), name='contact-create'),
    
    # Admin endpoints
    path('list/', views.ContactListView.as_view(), name='contact-list'),
    path('<int:pk>/', views.ContactDetailView.as_view(), name='contact-detail'),
]
