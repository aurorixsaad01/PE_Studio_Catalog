import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ProductImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export default function ProductImage({ src, alt = "Product Image", className = "" }: ProductImageProps) {
  if (!src) {
    return (
      <div className={`bg-pe-surface flex flex-col items-center justify-center text-pe-text-muted border border-pe-divider ${className}`}>
        <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
        <span className="text-[10px] uppercase tracking-widest opacity-50">No Image</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      referrerPolicy="no-referrer" 
    />
  );
}
