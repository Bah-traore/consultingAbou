from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_active', 'order', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'slug']  # slug en lecture seule
    ordering = ['order', 'created_at']
    list_editable = ['is_active', 'order']
    
    # Supprimer prepopulated_fields pour utiliser la génération via save() avec unidecode
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'description', 'image')
        }),
        ('Catégorie et affichage', {
            'fields': ('category', 'icon', 'is_active', 'order')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
