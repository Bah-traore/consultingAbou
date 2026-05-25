"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { API_ENDPOINTS, Article, apiGet } from "@/lib/api";
import { useCustomization } from "@/hooks/use-customization";

export default function DynamicBlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { customization, isLoading: isCustomizationLoading } = useCustomization();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await apiGet<any>(API_ENDPOINTS.ARTICLES.LIST);
        // Limiter le nombre d'articles selon la configuration
        const limit = customization?.items_per_page || 6;
        setArticles(Array.isArray(data) ? data.slice(0, limit) : (data.results || []).slice(0, limit));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Ne rien afficher si la section est explicitement désactivée ou en chargement
  // Permettre l'affichage pendant le chargement initial (customization === null)
  if (customization && !customization.show_blog_section) {
    return null;
  }
  
  if (loading || articles.length === 0) {
    return null;
  }

  // Fallback si customization n'est pas encore chargé (SSR/hydratation)
  if (!customization) {
    return (
      <section className="mt-12">
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Derniers articles
          </h2>
          <p className="max-w-3xl text-pretty text-sm sm:text-base text-muted-foreground">
            Conseils, astuces et réflexions sur la formation et le coaching.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="block break-inside-avoid mb-6">
              <Card 
                className="h-full transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: article.article_card_background_color || '#FFFFFF' }}
              >
                {article.featured_image && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover"
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

        <div className="mt-8 text-center">
          <Link href="/blog">
            <button className="px-6 py-3 rounded-lg border-2 border-primary text-primary transition-all hover:shadow-md">
              Voir tous les articles
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl" 
            style={{ color: customization.text_color }}>
          {customization.blog_title || "Derniers articles"}
        </h2>
        <p className="max-w-3xl text-pretty text-sm sm:text-base"
           style={{ color: customization.text_color + 'CC' }}>
          {customization.blog_description || "Conseils, astuces et réflexions sur la formation et le coaching."}
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/blog/${article.slug}`} className="block break-inside-avoid mb-6">
            <Card 
              className="h-full transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ 
                backgroundColor: article.article_card_background_color || customization.blog_card_background_color || '#FFFFFF',
                borderColor: customization.primary_color + '40'
              }}
            >
              {article.featured_image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle 
                  className="line-clamp-2 text-xl"
                  style={{ color: article.article_title_color || customization.blog_card_title_color || customization.text_color }}
                >
                  {article.title}
                </CardTitle>
                <CardDescription 
                  className="line-clamp-3 mt-2"
                  style={{ color: article.article_excerpt_color || customization.blog_card_description_color || customization.text_color + '99' }}
                >
                  {article.excerpt || article.content?.substring(0, 150) + "..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm" 
                     style={{ color: article.article_excerpt_color || customization.blog_card_description_color || customization.text_color + '99' }}>
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
                          backgroundColor: article.article_tag_background_color || customization.blog_card_tag_background_color || customization.accent_color + '20',
                          color: article.article_tag_text_color || customization.blog_card_tag_text_color || customization.text_color,
                          borderColor: article.article_tag_background_color || customization.blog_card_tag_background_color || customization.accent_color
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

      {/* Bouton Voir plus */}
      <div className="mt-8 text-center">
        <Link href="/blog">
          <button
            className="px-6 py-3 rounded-lg border-2 transition-all hover:shadow-md"
            style={{ 
              borderColor: customization.primary_color,
              color: customization.primary_color
            }}
          >
            Voir tous les articles
          </button>
        </Link>
      </div>
    </section>
  );
}
