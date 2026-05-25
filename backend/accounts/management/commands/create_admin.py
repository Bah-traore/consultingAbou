from django.core.management.base import BaseCommand
from accounts.models import CustomUser


class Command(BaseCommand):
    help = 'Créer un superutilisateur par défaut'

    def handle(self, *args, **options):
        if not CustomUser.objects.filter(username='admin').exists():
            CustomUser.objects.create_superuser(
                username='admin',
                email='admin@consulting.com',
                password='admin123',
                first_name='Administrateur',
                last_name='Consulting'
            )
            self.stdout.write(
                self.style.SUCCESS('Superutilisateur créé avec succès!')
            )
            self.stdout.write('Username: admin')
            self.stdout.write('Password: admin123')
        else:
            self.stdout.write(
                self.style.WARNING('Le superutilisateur existe déjà')
            )
