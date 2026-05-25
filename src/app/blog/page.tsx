"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { articlesAPI, Article, fixImageUrl } from "@/lib/api";
import { Calendar, User } from "lucide-react";

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    articlesAPI.getAll()
      .then(data => {
        const rawArticles = data.results || [];
        const fixedArticles = rawArticles.map((article: Article) => ({
          ...article,
          featured_image: article.featured_image ? fixImageUrl(article.featured_image) : null
        }));
        setArticles(fixedArticles);
        setLoading(false);
      })
      .catch(err => {
        setError("Impossible de charger les articles");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement des articles...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos conseils, astuces et réflexions sur la formation, le coaching 
            et le développement personnel et professionnel.
          </p>
        </div>

        {/* Liste des articles */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="block break-inside-avoid mb-6">
                <Card 
                  className="h-full transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{ 
                    backgroundColor: article.article_card_background_color || '#FFFFFF'
                  }}
                >
                  {article.featured_image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle 
                      className="line-clamp-2 text-xl"
                      style={{ color: article.article_title_color || '#1F2937' }}
                    >
                      {article.title}
                    </CardTitle>
                    <CardDescription 
                      className="line-clamp-3 mt-2"
                      style={{ color: article.article_excerpt_color || '#6B7280' }}
                    >
                      {article.excerpt || article.content?.substring(0, 150) + "..."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm" 
                         style={{ color: article.article_excerpt_color || '#6B7280' }}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{article.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(article.published_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    {article.tags_list && article.tags_list.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags_list.slice(0, 3).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: article.article_tag_background_color || '#3B82F6',
                              color: article.article_tag_text_color || '#FFFFFF',
                              borderColor: article.article_tag_background_color || '#3B82F6'
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
