"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { articlesAPI, Article } from "@/lib/api";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      articlesAPI.getBySlug(slug)
        .then(data => {
          setArticle(data);
          setLoading(false);
        })
        .catch(err => {
          setError("Impossible de charger l'article");
          setLoading(false);
          console.error(err);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement de l'article...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Bouton retour */}
        <Link href="/blog" className="inline-block mb-6">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Button>
        </Link>

        {/* Image à la une */}
        {article.featured_image && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* En-tête de l'article */}
        <div 
          className="mb-8 p-6 rounded-lg"
          style={{ backgroundColor: article.article_card_background_color || '#FFFFFF' }}
        >
          <h1 
            className="text-4xl font-bold tracking-tight mb-4"
            style={{ color: article.article_title_color || '#1F2937' }}
          >
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm"
               style={{ color: article.article_excerpt_color || '#6B7280' }}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.published_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {article.tags_list && article.tags_list.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags_list.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ 
                    backgroundColor: article.article_tag_background_color || '#3B82F6',
                    color: article.article_tag_text_color || '#FFFFFF'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contenu de l'article */}
        <article 
          className="prose prose-lg max-w-none"
          style={{ color: article.article_excerpt_color || '#6B7280' }}
        >
          <div className="whitespace-pre-wrap text-pretty">
            {article.content}
          </div>
        </article>

        {/* Section appel à l'action */}
        <div className="mt-12 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-3">Cet article vous a intéressé ?</h2>
          <p className="text-muted-foreground mb-4">
            Contactez-nous pour en savoir plus sur nos services de formation et de coaching.
          </p>
          <Link href="/contact">
            <Button>Nous contacter</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
