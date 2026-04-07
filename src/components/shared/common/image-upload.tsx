"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, X, Loader2, CloudUpload } from "lucide-react";
import { uploadFileService } from "@/services/dashboard/file/file.service";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Upload Image",
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadFileService(file, folder);
      onChange(response.url);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      <div 
        className={cn(
          "relative group flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 min-h-[160px] overflow-hidden bg-muted/30 hover:bg-muted/50",
          value ? "border-primary/50" : "border-muted-foreground/25",
          isUploading && "opacity-60 pointer-events-none"
        )}
      >
        {value ? (
          <div className="relative w-full h-full min-h-[160px]">
            <Image
              src={value.startsWith("http") ? value : `${process.env.NEXT_PUBLIC_API_BASE_URL}${value}`}
              alt="Preview"
              fill
              className="object-contain p-2"
              sizes="(max-width: 500px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center py-6 cursor-pointer w-full h-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-3 rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
              <CloudUpload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
            <p className="text-xs font-medium">Uploading...</p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
      />
    </div>
  );
}
