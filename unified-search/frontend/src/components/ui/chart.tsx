"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";



export interface TooltipItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: any;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipItem[];
  className?: string;
}



function ChartContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex aspect-video w-full items-center justify-center text-xs",
        className
      )}
      {...props}
    >
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}


const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: ChartTooltipContentProps) {
  const items = payload ?? [];

  if (!active || items.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-md border bg-background p-2 shadow-md",
        className
      )}
    >
      {label !== undefined && (
        <div className="mb-1 font-medium">{label}</div>
      )}

      <div className="grid gap-1.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-mono font-medium">
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}



export interface LegendItem {
  value?: string;
  color?: string;
}

export interface ChartLegendContentProps {
  payload?: LegendItem[];
  verticalAlign?: "top" | "bottom";
  className?: string;
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  payload,
  className,
  verticalAlign = "bottom",
}: ChartLegendContentProps) {
  const items = payload ?? [];

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  );
}


export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};