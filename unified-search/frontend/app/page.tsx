"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-background text-foreground overflow-hidden">
      {/* decorative orbs */}
      <div className="orb orb--tl" />
      <div className="orb orb--br" />

      {/* logo top-left */}
      <div className="absolute top-8 left-8 z-20 text-left">
        <h1 className="text-6xl font-instrument leading-none">komo</h1>
        <p className="text-sm font-hanken tracking-tight opacity-80">get into it.</p>
      </div>

      {/* centered hero content */}
      <div className="relative z-20 w-full max-w-2xl flex-col space-y-1 px-6 text-center">


        {/* search bar */}
        <Input
          placeholder="what are you looking for?"
          className="mt-1 w-full border-0 border-b-2 border-blue-800 bg-transparent text-2xl font-instrument text-foreground placeholder:opacity-50 focus-visible:ring-0 focus-visible:border-blue-900"
        />

        {/* add button */}
        <Button
          variant="outline"
          size="sm"
          className="mt-4 flex items-center gap-2 border border-muted-foreground/40 font-instrument text-lg italic shadow-sm"
        >
          <span className="text-xl leading-none">＋</span> add
        </Button>
      </div>

      {/* mascot bottom-right */}
      <div className="absolute bottom-8 right-14 z-10">
        <img
          src="/cloud-mascot.png"
          alt="komo mascot"
          className="w-28 h-28 object-contain"
        />
      </div>
    </section>
  );
}