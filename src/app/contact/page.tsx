"use client";

import ContactForm from "@/components/ContactForm";
import RendezVousForm from "@/components/RendezVousForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useCustomization } from "@/hooks/use-customization";

export default function ContactPage() {
  const { customization } = useCustomization();
  
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: customization?.text_color }}>Contactez-nous</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: customization?.text_color + 'CC' }}>
            Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner 
            dans votre projet de développement personnel et professionnel.
          </p>
        </div>

        {/* Informations de contact dynamiques */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card style={{ borderColor: customization?.primary_color + '40' }}>
            <CardHeader className="pb-3">
              <Mail className="h-8 w-8 mb-2" style={{ color: customization?.primary_color }} />
              <CardTitle className="text-base" style={{ color: customization?.text_color }}>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={`mailto:${customization?.contact_email}`}
                className="text-sm hover:underline"
                style={{ color: customization?.primary_color }}
              >
                {customization?.contact_email || 'contact@aboubah-consulting.com'}
              </a>
            </CardContent>
          </Card>

          <Card style={{ borderColor: customization?.secondary_color + '40' }}>
            <CardHeader className="pb-3">
              <Phone className="h-8 w-8 mb-2" style={{ color: customization?.secondary_color }} />
              <CardTitle className="text-base" style={{ color: customization?.text_color }}>Téléphone</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={`tel:${customization?.contact_phone}`}
                className="text-sm hover:underline"
                style={{ color: customization?.secondary_color }}
              >
                {customization?.contact_phone || '+223 70 00 00 00'}
              </a>
            </CardContent>
          </Card>

          <Card style={{ borderColor: customization?.accent_color + '40' }}>
            <CardHeader className="pb-3">
              <MapPin className="h-8 w-8 mb-2" style={{ color: customization?.accent_color }} />
              <CardTitle className="text-base" style={{ color: customization?.text_color }}>Adresse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" style={{ color: customization?.text_color + 'CC' }}>
                {customization?.contact_address || 'Bamako, Mali'}
              </p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: customization?.primary_color + '40' }}>
            <CardHeader className="pb-3">
              <Clock className="h-8 w-8 mb-2" style={{ color: customization?.primary_color }} />
              <CardTitle className="text-base" style={{ color: customization?.text_color }}>Horaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" style={{ color: customization?.text_color + 'CC' }}>Lun - Ven: 8h - 18h</p>
            </CardContent>
          </Card>
        </div>

        {/* Formulaires */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <ContactForm />
          </div>
          <div>
            <RendezVousForm />
          </div>
        </div>

        {/* Section FAQ rapide */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Questions fréquentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comment se déroule une consultation ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nous commençons par un diagnostic de vos besoins, puis nous élaborons ensemble 
                  un plan d'action personnalisé adapté à vos objectifs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quels sont les délais de réponse ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nous nous engageons à répondre à toutes les demandes dans un délai de 24 à 48 heures 
                  ouvrables.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Proposez-vous des formations en groupe ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Oui, nous proposons des formations individuelles et en groupe selon vos besoins 
                  et ceux de votre organisation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Les séances peuvent-elles se faire en ligne ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Absolument ! Nous offrons la possibilité de réaliser des consultations et coachings 
                  à distance via visioconférence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
