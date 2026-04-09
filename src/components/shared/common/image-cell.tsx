"use client";

import React, { useState } from "react";
import { LucideIcon, Image as ImageIcon } from "lucide-react";
import { getAssetUrl } from "@/utils/common/common";

interface ImageCellProps {
  src?: string;
  alt: string;
  fallbackIcon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
  objectFit?: "cover" | "contain";
}

export function ImageCell({
  src,
  alt,
  fallbackIcon: FallbackIcon = ImageIcon,
  size = "md",
  className = "",
  objectFit = "cover",
}: ImageCellProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const selectedSize = sizeClasses[size];

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg border bg-muted/20 ${selectedSize} ${className}`}>
      {src && !error ? (
        <>
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={getAssetUrl(src)}
            alt={alt}
            className={`h-full w-full ${
              objectFit === "cover" ? "object-cover" : "object-contain p-1"
            } ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
          <FallbackIcon className="h-1/2 w-1/2" />
        </div>
      )}
    </div>
  );
}
