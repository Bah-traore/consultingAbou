from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'subject', 'message', 'status', 'responded', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'responded', 'created_at', 'updated_at']


class ContactAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
