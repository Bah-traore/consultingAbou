"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type NavItem = {
  label: string;
  href: string;
};

type FloatingNavMenuProps = {
  items?: NavItem[];
  whatsappPhone?: string;
  whatsappMessage?: string;
};

export default function FloatingNavMenu({
  items = [
    { label: "Services", href: "#services" },
    { label: "Méthode", href: "#methode" },
    { label: "Contact", href: "#contact" },
  ],
  whatsappPhone,
  whatsappMessage,
}: FloatingNavMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const whatsappHref = useMemo(() => {
    if (!whatsappPhone) return null;
    const base = `https://wa.me/${encodeURIComponent(whatsappPhone)}`;
    if (!whatsappMessage) return base;
    return `${base}?text=${encodeURIComponent(whatsappMessage)}`;
  }, [whatsappPhone, whatsappMessage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (!open) return;
      if (wrapper.contains(event.target as Node)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const scrollToHash = (hash: string) => {
    if (!hash.startsWith("#")) return;
    const id = hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={wrapperRef} className="fixed bottom-5 left-5 z-50">
      <div className="relative grid justify-items-start gap-2">
        {open ? (
          <Card className="absolute bottom-14 left-0 w-52 overflow-hidden border-primary/30 bg-gradient-to-br from-blue-600/80 via-background/95 to-amber-400/90 shadow-lg backdrop-blur">
            <div className="grid gap-1 p-2">
              {items.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start hover:bg-blue-600/10 hover:text-foreground"
                  onClick={() => {
                    scrollToHash(item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Card>
        ) : null}

        <Button
          size="sm"
          variant={open ? "secondary" : "default"}
          className="rounded-full shadow-lg"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span aria-hidden="true" className="mr-2 text-base leading-none">
            ☰
          </span>
          <span className="text-sm">
            {open ? "Fermer" : "Menu"}
          </span>
        </Button>

        {whatsappHref ? (
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="rounded-full shadow-lg"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
