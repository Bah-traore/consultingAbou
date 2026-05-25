from rest_framework import serializers
from .models import RendezVous


class RendezVousSerializer(serializers.ModelSerializer):
    class Meta:
        model = RendezVous
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'type_rdv', 'date_souhaitee', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class RendezVousAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = RendezVous
        fields = '__all__'
