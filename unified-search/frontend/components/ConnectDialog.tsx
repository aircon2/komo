"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";

const services = [
  {
    name: "Slack",
    icon: "/icons/slack.svg",
  },
  {
    name: "Notion",
    icon: "/icons/notion.svg",
  },
];

interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectionChange: (selected: string[]) => void;
}

export function ConnectDialog({
  open,
  onOpenChange,
  onSelectionChange,
}: ConnectDialogProps) {
  const [selected, setSelected] = React.useState<string[]>([]);

  function toggleService(name: string) {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name]
    );
  }

  function handleClose() {
    onSelectionChange(selected);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-lg border bg-background p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-instrument text-center mb-4">
            choose your app:
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center gap-6 my-4">
          {services.map((service) => {
            const isSelected = selected.includes(service.name);
            return (
              <button
                key={service.name}
                onClick={() => toggleService(service.name)}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 shadow-md transition-colors ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : "border-muted-foreground/40 hover:border-foreground/60"
                }`}
              >
                <Image
                  src={service.icon}
                  alt={service.name}
                  width={20}
                  height={20}
                  className={`${
                    isSelected ? "grayscale-0" : "grayscale"
                  } transition-all`}
                />
                <span
                  className={`font-hanken text-lg ${
                    isSelected ? "text-green-700 font-medium" : ""
                  }`}
                >
                  {service.name}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            className="font-hanken text-md"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}