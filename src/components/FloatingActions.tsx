"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type FloatingActionsProps = {
  whatsappPhone?: string;
  whatsappMessage?: string;
  email?: string;
};

export default function FloatingActions({
  whatsappPhone,
  whatsappMessage,
  email,
}: FloatingActionsProps) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = useMemo(() => {
    if (!whatsappPhone) return null;
    const base = `https://wa.me/${encodeURIComponent(whatsappPhone)}`;
    if (!whatsappMessage) return base;
    return `${base}?text=${encodeURIComponent(whatsappMessage)}`;
  }, [whatsappPhone, whatsappMessage]);

  const mailHref = useMemo(() => {
    if (!email) return null;
    return `mailto:${email}`;
  }, [email]);

  return (
    <div className="fixed bottom-5 right-5 z-50 grid gap-2">
      {whatsappHref ? (
        <Button asChild size="icon" variant="secondary" className="rounded-full shadow-lg">
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            WA
          </Link>
        </Button>
      ) : null}

      {mailHref ? (
        <Button asChild size="icon" variant="outline" className="rounded-full shadow-lg">
          <a href={mailHref} aria-label="Email">
            @
          </a>
        </Button>
      ) : null}

      {showTop ? (
        <Button
          size="icon"
          variant="default"
          className="rounded-full shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Remonter en haut"
        >
          ↑
        </Button>
      ) : null}
    </div>
  );
}
