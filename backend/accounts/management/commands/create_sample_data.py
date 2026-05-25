from django.core.management.base import BaseCommand
from services.models import Service
from partenaires.models import Partenaire
from blog.models import Article
from accounts.models import CustomUser
from django.utils import timezone


class Command(BaseCommand):
    help = 'Créer des données de démonstration'

    def handle(self, *args, **options):
        self.stdout.write('Création des données de démonstration...')

        # Créer des services
        services_data = [
            {
                'title': 'Renforcement de capacités en langue française',
                'description': 'Des modules sur mesure, orientés performance et contexte professionnel. Grammaire, orthographe, conjugaison, rédaction administrative et expression écrite/orale.',
                'category': 'formation',
                'icon': 'BookOpen',
                'order': 1,
            },
            {
                'title': 'Coaching en présentation de documents',
                'description': 'Structure, rythme, persuasion: votre message devient évident. Structuration du diaporama, préparation à la prise de parole, rhétorique et langage non verbal.',
                'category': 'coaching',
                'icon': 'Presentation',
                'order': 2,
            },
            {
                'title': 'Coaching en développement personnel',
                'description': 'Un accompagnement concret pour mieux décider, mieux agir, mieux communiquer. Confiance, posture, compétences interpersonnelles, gestion du stress.',
                'category': 'coaching',
                'icon': 'Target',
                'order': 3,
            },
            {
                'title': 'Préparation aux concours de recrutement',
                'description': 'Une préparation rigoureuse, progressive et orientée résultats. Culture générale, méthodologie, expression, contraction de texte. ENA, ENS, Fonction publique, Concours armée.',
                'category': 'preparation',
                'icon': 'Award',
                'order': 4,
            },
        ]

        for service_data in services_data:
            slug = service_data['title'].lower().replace(' ', '-').replace('à', 'a').replace('é', 'e').replace('è', 'e')
            service, created = Service.objects.get_or_create(
                slug=slug,
                defaults={**service_data, 'is_active': True}
            )
            if created:
                self.stdout.write(f'✅ Service créé: {service.title}')

        # Créer un article exemple
        user = CustomUser.objects.first()
        if user:
            article, created = Article.objects.get_or_create(
                slug='bienvenue-sur-notre-blog',
                defaults={
                    'title': 'Bienvenue sur notre blog pédagogique',
                    'excerpt': 'Découvrez nos conseils et astuces pour améliorer vos compétences.',
                    'content': 'Notre cabinet s\'engage à vous accompagner dans votre développement personnel et professionnel. Nous proposons des formations sur mesure, du coaching individualisé et une préparation efficace aux concours.',
                    'author': user,
                    'status': 'published',
                    'is_featured': True,
                    'tags': 'formation, coaching, pédagogie',
                    'published_at': timezone.now(),
                }
            )
            if created:
                self.stdout.write(f'✅ Article créé: {article.title}')

        self.stdout.write(self.style.SUCCESS('\nDonnées de démonstration créées avec succès!'))
