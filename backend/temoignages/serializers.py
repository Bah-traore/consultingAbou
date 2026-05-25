from rest_framework import serializers
from .models import Temoignage


class TemoignageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temoignage
        fields = ['id', 'first_name', 'last_name', 'photo', 'rating', 'comment', 'is_featured', 'created_at']
        read_only_fields = ['id', 'is_featured', 'created_at']

    def validate(self, data):
        # Filtrer uniquement les témoignages approuvés pour l'affichage public
        if not self.context.get('request') or not self.context['request'].user.is_staff:
            data['status'] = 'approved'
        return data


class TemoignageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temoignage
        fields = '__all__'
