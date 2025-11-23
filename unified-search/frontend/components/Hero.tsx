"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectDialog } from "@/components/ConnectDialog";
import React from "react";

export default function Hero() {
  const [open, setOpen] = React.useState(false);
  const [connectedApps, setConnectedApps] = React.useState<string[]>([]);

  function handleApps(selected: string[]) {
    setConnectedApps(selected);
    console.log("✅ Connected apps:", selected);
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Orb backgrounds */}
      <div className="orb orb--tl" />
      <div className="orb orb--br" />

      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-6xl font-instrument leading-none">komo</h1>
        <p className="text-sm font-hanken opacity-80">get into it.</p>
      </div>

      <div className="relative z-20 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-instrument opacity-80">
          what are you looking for?
        </h2>

        <Input placeholder="what are you looking for?" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="mt-4 flex items-center gap-2 border border-muted-foreground/40 font-instrument text-lg italic shadow-sm"
        >
          <span className="text-xl leading-none">＋</span> add
        </Button>

        {/* Show which apps are connected */}
        {connectedApps.length > 0 && (
          <p className="text-sm font-hanken text-muted-foreground">
            Connected: {connectedApps.join(", ")}
          </p>
        )}
      </div>

      {/* Dialog */}
      <ConnectDialog
        open={open}
        onOpenChange={setOpen}
        onSelectionChange={handleApps}
      />
    </section>
  );
}