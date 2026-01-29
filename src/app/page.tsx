"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Award, BookOpen, ClipboardCheck, FileText, Presentation, Target } from "lucide-react";
import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";

export default function Home() {
  const serviceCard1Ref = useRef<HTMLDivElement | null>(null);
  const serviceCard2Ref = useRef<HTMLDivElement | null>(null);
  const serviceCard3Ref = useRef<HTMLDivElement | null>(null);
  const serviceCard4Ref = useRef<HTMLDivElement | null>(null);

  const valueCard1Ref = useRef<HTMLDivElement | null>(null);
  const valueCard2Ref = useRef<HTMLDivElement | null>(null);
  const valueCard3Ref = useRef<HTMLDivElement | null>(null);

  const methodeRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const serviceCard1InView = useInView(serviceCard1Ref, { rootMargin: "0px 0px -15% 0px" });
  const serviceCard2InView = useInView(serviceCard2Ref, { rootMargin: "0px 0px -15% 0px" });
  const serviceCard3InView = useInView(serviceCard3Ref, { rootMargin: "0px 0px -15% 0px" });
  const serviceCard4InView = useInView(serviceCard4Ref, { rootMargin: "0px 0px -15% 0px" });

  const valueCard1InView = useInView(valueCard1Ref, { rootMargin: "0px 0px -15% 0px" });
  const valueCard2InView = useInView(valueCard2Ref, { rootMargin: "0px 0px -15% 0px" });
  const valueCard3InView = useInView(valueCard3Ref, { rootMargin: "0px 0px -15% 0px" });

  const methodeInView = useInView(methodeRef, { rootMargin: "0px 0px -15% 0px" });
  const contactInView = useInView(contactRef, { rootMargin: "0px 0px -15% 0px" });

  return (
    <main className="flex-1">
      <header className="relative isolate overflow-hidden py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-foreground/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Conseil • Formation • Coaching</Badge>
              <Badge variant="outline">Méthode • Rigueur • Impact</Badge>
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Abou BAH Consulting
            </h1>

            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Une interface claire, une pensée structurée, un discours convaincant. Nous
              accompagnons vos écrits, vos présentations et votre progression avec une
              exigence pédagogique et un sens du résultat.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="sm:min-w-[190px]">Prendre rendez-vous</Button>
              <Button variant="outline" className="sm:min-w-[190px]">
                Découvrir nos services
              </Button>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-lg border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Positionnement</p>
                <p className="text-sm font-medium">Pragmatique & exigeant</p>
              </div>
              <div className="rounded-lg border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Public</p>
                <p className="text-sm font-medium">Particuliers & organisations</p>
              </div>
              <div className="rounded-lg border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Format</p>
                <p className="text-sm font-medium">Sur mesure</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-br from-foreground/10 via-transparent to-foreground/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-[24px] border bg-card">
              <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-background/30" />
              <Image
                src="/img/Abou-bah-Consulting.webp"
                alt="Abou BAH Consulting"
                width={1400}
                height={900}
                priority
                className="h-[360px] w-full object-cover sm:h-[440px]"
              />
              <div className="absolute inset-x-0 bottom-0 grid gap-2 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-background/60">
                    <Image
                      src="/img/Abou%20consulting%20transparent.webp"
                      alt="Logo Abou BAH Consulting"
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">Conseil & accompagnement</p>
                    <p className="text-xs text-muted-foreground">
                      Langue française • Présentations • Coaching
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="services" className="mt-10 scroll-mt-24">
        <div className="flex flex-col gap-3">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Des services conçus pour produire un vrai changement
          </h2>
          <p className="max-w-3xl text-pretty text-sm text-muted-foreground sm:text-base">
            Chaque prestation combine méthode, clarté et mise en pratique. L’objectif est
            simple: renforcer vos compétences et rendre vos livrables irréprochables.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card
            ref={serviceCard1Ref}
            className={`group relative overflow-hidden border-border/70 transition duration-500 will-change-transform will-change-opacity ${
              serviceCard1InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.55)]`}
          >
            <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_25%_20%,hsl(var(--secondary)/0.22),transparent_60%),radial-gradient(520px_circle_at_75%_60%,hsl(var(--primary)/0.18),transparent_62%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-primary">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>Renforcement de capacités en langue française</span>
              </CardTitle>
              <CardDescription>
                Des modules sur mesure, orientés performance et contexte professionnel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                <li className="text-foreground">Grammaire, orthographe et conjugaison</li>
                <li className="text-foreground">
                  Rédaction administrative, universitaire ou professionnelle
                </li>
                <li className="text-foreground">Expression écrite et orale</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            ref={serviceCard2Ref}
            className={`group relative overflow-hidden border-border/70 transition duration-500 delay-75 will-change-transform will-change-opacity ${
              serviceCard2InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.55)]`}
          >
            <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_25%_20%,hsl(var(--secondary)/0.22),transparent_60%),radial-gradient(520px_circle_at_75%_60%,hsl(var(--primary)/0.18),transparent_62%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-primary">
                  <Presentation className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>Coaching en présentation de documents</span>
              </CardTitle>
              <CardDescription>
                Structure, rythme, persuasion: votre message devient évident.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                <li className="text-foreground">Structuration du diaporama ou support visuel</li>
                <li className="text-foreground">Préparation à la prise de parole en public</li>
                <li className="text-foreground">Travail sur la rhétorique et l’argumentation</li>
                <li className="text-foreground">Langage non verbal, posture, respiration</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            ref={serviceCard3Ref}
            className={`group relative overflow-hidden border-border/70 transition duration-500 delay-150 will-change-transform will-change-opacity ${
              serviceCard3InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.55)]`}
          >
            <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_25%_20%,hsl(var(--secondary)/0.22),transparent_60%),radial-gradient(520px_circle_at_75%_60%,hsl(var(--primary)/0.18),transparent_62%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-primary">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>Coaching en développement personnel</span>
              </CardTitle>
              <CardDescription>
                Un accompagnement concret pour mieux décider, mieux agir, mieux communiquer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                <li className="text-foreground">Confiance, posture, autonomie</li>
                <li className="text-foreground">Compétences interpersonnelles</li>
                <li className="text-foreground">Stress, temps, priorités</li>
                <li className="text-foreground">Projet personnel ou professionnel solide</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            ref={serviceCard4Ref}
            className={`group relative overflow-hidden border-border/70 transition duration-500 delay-[225ms] will-change-transform will-change-opacity ${
              serviceCard4InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.55)]`}
          >
            <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_25%_20%,hsl(var(--secondary)/0.22),transparent_60%),radial-gradient(520px_circle_at_75%_60%,hsl(var(--primary)/0.18),transparent_62%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-primary">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>Préparation aux concours de recrutement</span>
              </CardTitle>
              <CardDescription>
                Une préparation rigoureuse, progressive et orientée résultats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <p className="text-sm text-muted-foreground">
                  Culture générale, méthodologie, expression, et (au besoin) contraction de
                  texte. Nous accompagnons associations et particuliers.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">ENA</Badge>
                  <Badge variant="outline">ENS</Badge>
                  <Badge variant="outline">Fonction publique</Badge>
                  <Badge variant="outline">Concours armée & autres</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="methode" className="mt-12 scroll-mt-24">
        <div
          ref={methodeRef}
          className={`grid gap-6 rounded-2xl border bg-card p-6 transition duration-500 will-change-transform will-change-opacity sm:p-8 lg:grid-cols-2 lg:items-center ${
            methodeInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="grid gap-3">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Une méthode claire, du diagnostic au résultat
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Nous travaillons avec une approche structurée: comprendre votre besoin,
              construire une solution, pratiquer, puis consolider.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border bg-background text-primary">
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Cadrage & diagnostic</p>
                <p className="text-sm text-muted-foreground">
                  Objectifs, contraintes, niveau, échéances.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border bg-background text-secondary">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Plan d’action sur mesure</p>
                <p className="text-sm text-muted-foreground">
                  Exercices ciblés, feedback précis, montée en compétence.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border bg-background text-primary">
                <Award className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Production & consolidation</p>
                <p className="text-sm text-muted-foreground">
                  Livrables, répétitions, optimisation finale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card
            ref={valueCard1Ref}
            className={`transition duration-500 will-change-transform will-change-opacity ${
              valueCard1InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <CardHeader>
              <CardTitle>Une exigence intellectuelle</CardTitle>
              <CardDescription>
                Clarté, logique, rigueur de fond: le style suit la pensée.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            ref={valueCard2Ref}
            className={`transition duration-500 delay-75 will-change-transform will-change-opacity ${
              valueCard2InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <CardHeader>
              <CardTitle>Une pédagogie utile</CardTitle>
              <CardDescription>
                Des outils réutilisables, des exercices ciblés, des résultats mesurables.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            ref={valueCard3Ref}
            className={`transition duration-500 delay-150 will-change-transform will-change-opacity ${
              valueCard3InView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <CardHeader>
              <CardTitle>Une finition professionnelle</CardTitle>
              <CardDescription>
                Mise en page, présentation, cohérence: chaque détail compte.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="contact" className="mt-12 scroll-mt-24 pb-2">
        <Card
          ref={contactRef}
          className={`relative overflow-hidden transition duration-500 will-change-transform will-change-opacity ${
            contactInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/5 via-transparent to-foreground/5" />
          <CardHeader>
            <CardTitle>Prêt à passer à l’action ?</CardTitle>
            <CardDescription>
              Dites-nous votre besoin, nous vous proposons un accompagnement clair et adapté.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Formation • Coaching • Mise en page • Soutenance • Concours
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                <Button className="sm:min-w-[180px]">Nous contacter</Button>
                <Button variant="outline" className="sm:min-w-[180px]">
                  Voir les prestations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
