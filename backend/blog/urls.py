from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.ArticleListView.as_view(), name='article-list'),
    path('featured/', views.ArticleFeaturedListView.as_view(), name='article-featured'),
    path('<slug:slug>/', views.ArticleDetailView.as_view(), name='article-detail'),
    
    # Admin endpoints
    path('admin/', views.ArticleAdminListView.as_view(), name='article-admin-list'),
    path('admin/<int:pk>/', views.ArticleAdminDetailView.as_view(), name='article-admin-detail'),
]
