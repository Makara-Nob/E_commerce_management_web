"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X, UploadCloud, Star } from "lucide-react";
import { uploadFileService } from "@/services/dashboard/file/file.service";
import { AppToast } from "@/components/shared/common/app-toast";
import { getAssetUrl } from "@/utils/common/common";

interface ImageUploaderProps {
  /** Currently stored URLs (from backend / form state) */
  value: string[];
  onChange: (urls: string[]) => void;
  /** Upload subfolder, defaults to 'products' */
  folder?: string;
  /** max files. 0 = unlimited */
  maxFiles?: number;
  /** show the star-badge on index 0 as "main image" */
  showMainBadge?: boolean;
  /** compact single-file mode */
  single?: boolean;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "products",
  maxFiles = 0,
  showMainBadge = false,
  single = false,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const canAdd = maxFiles === 0 || value.length < maxFiles;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const toUpload = Array.from(files).slice(0, maxFiles === 0 ? files.length : maxFiles - value.length);
    if (toUpload.length === 0) return;

    setUploading(true);
    try {
      const results = await Promise.all(
        toUpload.map((file) => uploadFileService(file, folder))
      );
      const newUrls = results.map((r) => r.url);
      onChange([...value, ...newUrls]);
    } catch (err: any) {
      AppToast({ type: "error", message: err?.message || "Upload failed" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const moveToMain = (idx: number) => {
    if (idx === 0) return;
    const next = [...value];
    const [moved] = next.splice(idx, 1);
    next.unshift(moved);
    onChange(next);
  };

  // ── Drop zone ──────────────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (single) {
    // ── Compact single-image uploader ─────────────────────────────────────
    const url = value[0] ?? "";
    return (
      <div className={cn("flex gap-3 items-start", className)}>
        {/* Preview box */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 overflow-hidden flex items-center justify-center hover:border-primary/50 transition-colors"
        >
          {url ? (
            <>
              <img src={getAssetUrl(url)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground/50">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
            </div>
          )}
        </button>

        <div className="flex-1 space-y-2">
          <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {url ? "Replace Image" : "Upload Image"}
          </Button>
          {url && (
            <Button type="button" variant="ghost" size="sm" className="w-full gap-2 text-destructive" onClick={() => onChange([])}>
              <X className="w-4 h-4" /> Remove
            </Button>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
    );
  }

  // ── Multi-image uploader ──────────────────────────────────────────────────
  return (
    <div className={cn("space-y-3", className)}>
      {/* Existing images grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {value.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border bg-muted/20">
              <img src={getAssetUrl(url)} alt="" className="w-full h-full object-cover" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 gap-1.5">
                {showMainBadge && idx !== 0 && (
                  <button
                    type="button"
                    title="Set as main image"
                    onClick={() => moveToMain(idx)}
                    className="bg-amber-400 text-black rounded-full p-1 hover:scale-110 transition-transform"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeAt(idx)}
                  className="bg-destructive text-white rounded-full p-1 hover:scale-110 transition-transform"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main badge */}
              {showMainBadge && idx === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5" /> Main
                </div>
              )}
            </div>
          ))}

          {/* Upload more tile */}
          {canAdd && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/10 flex flex-col items-center justify-center text-muted-foreground/60 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5 mb-1" />}
              <span className="text-[10px] font-medium">{uploading ? "Uploading…" : "Add more"}</span>
            </button>
          )}
        </div>
      )}

      {/* Drop zone (shown when no images or alongside grid) */}
      {value.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 flex flex-col items-center justify-center gap-3 transition-all",
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-muted-foreground/25 bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
          )}
        >
          {uploading ? (
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UploadCloud className="w-7 h-7 text-primary" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{dragging ? "Drop to upload" : "Click or drag & drop images"}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP · Multiple files supported</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles !== 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
