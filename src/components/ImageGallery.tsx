import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ImageOff, Maximize2 } from 'lucide-react';
import { ExtractedImage } from '../types';
import { ImageModal } from './ImageModal';

interface ImageGalleryProps {
  images: ExtractedImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<ExtractedImage | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const handleCopy = (src: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(src);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleImageError = (index: number) => {
    setBrokenImages((prev) => ({ ...prev, [index]: true }));
  };

  if (images.length === 0) {
    return (
      <div className="p-8 text-center bg-[#141420] border border-[#232336] rounded-2xl text-gray-400">
        <p className="text-sm font-medium">No images were detected on this webpage.</p>
        <p className="text-xs text-gray-500 mt-1">
          The page may be purely textual or uses CSS backgrounds/canvas graphics.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => {
          const isBroken = brokenImages[idx];
          return (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className="bg-[#141420] border border-[#232336] hover:border-purple-500/50 rounded-xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-200 hover:shadow-lg"
            >
              {/* Image Thumbnail Container */}
              <div className="relative aspect-video bg-[#0C0C14] flex items-center justify-center overflow-hidden">
                {isBroken ? (
                  <div className="flex flex-col items-center justify-center p-4 text-gray-600 gap-1.5">
                    <ImageOff className="w-8 h-8" />
                    <span className="text-[10px] uppercase font-semibold">Image unavailable</span>
                  </div>
                ) : (
                  <img
                    src={img.src}
                    alt={img.alt || 'Webpage visual'}
                    loading="lazy"
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Overlay Hover Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Dimensions Badge */}
                {img.width > 0 && img.height > 0 && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-gray-300 border border-white/10">
                    {img.width}×{img.height}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-gray-200 line-clamp-1" title={img.alt || 'Untitled Image'}>
                    {img.alt || <span className="text-gray-500 italic">No alt text</span>}
                  </p>
                  <p className="text-[11px] font-mono text-gray-400 truncate mt-0.5" title={img.src}>
                    {img.src}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1F1F30]">
                  <button
                    onClick={(e) => handleCopy(img.src, idx, e)}
                    className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-purple-300 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={img.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-[11px] font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
