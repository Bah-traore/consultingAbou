from django.contrib import admin
from .models import Temoignage


@admin.register(Temoignage)
class TemoignageAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'rating', 'status', 'is_featured', 'created_at']
    list_filter = ['status', 'is_featured', 'rating']
    search_fields = ['first_name', 'last_name', 'email', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    list_editable = ['status', 'is_featured']
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'email', 'photo')
        }),
        ('Témoignage', {
            'fields': ('rating', 'comment')
        }),
        ('Administration', {
            'fields': ('status', 'is_featured')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
