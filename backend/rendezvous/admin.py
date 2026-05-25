from django.contrib import admin
from .models import RendezVous


@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'type_rdv', 'date_souhaitee', 'status', 'created_at']
    list_filter = ['status', 'type_rdv', 'date_souhaitee']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-date_souhaitee']
    list_editable = ['status']
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Rendez-vous', {
            'fields': ('type_rdv', 'date_souhaitee', 'message')
        }),
        ('Administration', {
            'fields': ('status', 'notes_admin')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
