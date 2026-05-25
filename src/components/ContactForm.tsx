"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contactsAPI } from "@/lib/api";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCustomization } from "@/hooks/use-customization";

export default function ContactForm() {
  const { customization } = useCustomization();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await contactsAPI.create(formData);
      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name: string) => {
    const isFocused = focusedInput === name;
    if (isFocused && customization?.primary_color) {
      return {
        borderColor: customization.primary_color,
        boxShadow: `0 0 0 2px ${customization.primary_color}33`,
        outline: 'none',
      };
    }
    return {};
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50 shadow-md transform transition-all duration-300 scale-100">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-600 animate-bounce" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Message envoyé !</h3>
              <p className="text-sm text-green-700 mt-1">
                Merci pour votre message. Nous vous contacterons dans les plus brefs délais.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSuccess(false)}
              className="mt-2 border-green-300 hover:bg-green-100 text-green-800"
            >
              Envoyer un autre message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4" style={{ borderTopColor: customization?.primary_color || '#3b82f6' }}>
      <CardHeader>
        <CardTitle style={{ color: customization?.text_color }}>Contactez-nous</CardTitle>
        <CardDescription>
          Remplissez ce formulaire et nous vous répondrons rapidement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium mb-2" style={{ color: customization?.text_color }}>
                Prénom *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                onFocus={() => setFocusedInput("first_name")}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle("first_name")}
                className="w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium mb-2" style={{ color: customization?.text_color }}>
                Nom *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                onFocus={() => setFocusedInput("last_name")}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle("last_name")}
                className="w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: customization?.text_color }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle("email")}
                className="w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: customization?.text_color }}>
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedInput("phone")}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle("phone")}
                className="w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none"
                placeholder="+223 XX XX XX XX"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: customization?.text_color }}>
              Sujet *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              onFocus={() => setFocusedInput("subject")}
              onBlur={() => setFocusedInput(null)}
              style={getInputStyle("subject")}
              className="w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none"
              placeholder="Sujet de votre message"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: customization?.text_color }}>
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedInput("message")}
              onBlur={() => setFocusedInput(null)}
              style={getInputStyle("message")}
              rows={5}
              className="w-full px-3 py-2 border rounded-md resize-vertical transition-all duration-200 focus:outline-none"
              placeholder="Décrivez votre demande..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full text-white font-medium transition-all duration-200 hover:opacity-90" 
            style={{ 
              backgroundColor: customization?.primary_color || '#3b82f6',
              boxShadow: customization?.primary_color ? `0 4px 12px ${customization.primary_color}33` : undefined
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
