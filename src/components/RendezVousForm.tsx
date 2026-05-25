"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rendezvousAPI } from "@/lib/api";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function RendezVousForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    type_rdv: "consultation",
    date_souhaitee: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await rendezvousAPI.create(formData);
      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        type_rdv: "consultation",
        date_souhaitee: "",
        message: "",
      });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Demande envoyée !</h3>
              <p className="text-sm text-green-700 mt-1">
                Votre demande de rendez-vous a été reçue. Nous vous confirmerons la date rapidement.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSuccess(false)}
              className="mt-2"
            >
              Nouvelle demande
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Obtenir la date minimale (demain)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demande de rendez-vous</CardTitle>
        <CardDescription>
          Choisissez le type de rendez-vous et la date souhaitée.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium mb-2">
                Prénom *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium mb-2">
                Nom *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+223 XX XX XX XX"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type_rdv" className="block text-sm font-medium mb-2">
              Type de rendez-vous *
            </label>
            <select
              id="type_rdv"
              name="type_rdv"
              value={formData.type_rdv}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="consultation">Consultation</option>
              <option value="coaching">Coaching</option>
              <option value="formation">Formation</option>
              <option value="soutien">Soutien concours</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="date_souhaitee" className="block text-sm font-medium mb-2">
              Date et heure souhaitées *
            </label>
            <input
              type="datetime-local"
              id="date_souhaitee"
              name="date_souhaitee"
              required
              min={minDate}
              value={formData.date_souhaitee}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Choisissez une date à partir de demain
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message / Détails
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
              placeholder="Précisez votre besoin ou vos disponibilités..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Demander ce rendez-vous"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
