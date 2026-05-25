"use client";

import React from "react";
import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#070e1e] via-[#0b1528] to-[#040811] text-white">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none animate-pulse [animation-delay:2s]" />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated outer ring */}
        <div className="relative flex h-24 w-24 items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin [animation-duration:1.5s]" />
          <div className="absolute -inset-2 rounded-full border border-blue-500/10 animate-ping [animation-duration:3s]" />
          
          {/* Logo container */}
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center p-2 shadow-2xl shadow-primary/20 animate-pulse">
            <Image
              src="/img/Abou%20consulting%20transparent.webp"
              alt="Logo"
              width={64}
              height={64}
              priority
              className="object-contain p-1"
            />
          </div>
        </div>

        {/* Brand Text */}
        <h1 className="text-2xl font-bold tracking-wider mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Abou BAH
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80 font-semibold mb-6">
          Consulting
        </p>

        {/* Slogan with shimmer effect */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-sm text-slate-400 font-medium animate-pulse [animation-duration:2s]">
            Méthode • Clarté • Action
          </p>
        </div>
      </div>
    </div>
  );
}
