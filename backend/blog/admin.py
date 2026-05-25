from django.contrib import admin
from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'is_featured', 'published_at', 'created_at']
    list_filter = ['status', 'is_featured', 'created_at']
    search_fields = ['title', 'content', 'tags']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-published_at', '-created_at']
    list_editable = ['status', 'is_featured']
    
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'excerpt', 'content')
        }),
        ('Média', {
            'fields': ('featured_image',)
        }),
        ('Auteur et statut', {
            'fields': ('author', 'status', 'is_featured', 'published_at')
        }),
        ('Tags', {
            'fields': ('tags',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
