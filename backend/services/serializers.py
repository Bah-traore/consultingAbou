from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'description', 'image', 'category', 'icon', 
            'is_active', 'order', 'service_background_color', 'service_title_color',
            'service_description_color', 'service_category_color', 'service_category_text_color',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
