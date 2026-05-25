from django.contrib import admin
from .models import Partenaire


@admin.register(Partenaire)
class PartenaireAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['order', 'created_at']
    list_editable = ['is_active', 'order']
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'logo', 'website')
        }),
        ('Description et affichage', {
            'fields': ('description', 'is_active', 'order')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
