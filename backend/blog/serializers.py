from rest_framework import serializers
from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'author', 'author_name', 
            'status', 'is_featured', 'tags', 'tags_list', 'published_at', 'created_at', 'updated_at',
            'article_card_background_color', 'article_title_color', 'article_excerpt_color',
            'article_tag_background_color', 'article_tag_text_color'
        ]
        read_only_fields = ['id', 'slug', 'author', 'published_at', 'created_at', 'updated_at']

    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',')]
        return []


class ArticleListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image', 'author_name', 'is_featured', 
            'tags', 'tags_list', 'published_at', 'created_at',
            'article_card_background_color', 'article_title_color', 'article_excerpt_color',
            'article_tag_background_color', 'article_tag_text_color'
        ]

    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',')]
        return []
