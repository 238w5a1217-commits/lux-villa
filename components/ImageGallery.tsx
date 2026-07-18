"use client";

import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Grid Layout (Clickable for Flipkart-style view) */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] mb-6 rounded-2xl overflow-hidden cursor-pointer group relative">
        <div className="col-span-2 row-span-2 relative overflow-hidden" onClick={() => openLightbox(0)}>
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-opacity duration-300 transform scale-95 group-hover:scale-100">
              ⛶ View Gallery
            </span>
          </div>
        </div>
        
        {images.slice(1, 4).map((src, i) => (
          <div 
            key={i} 
            className={`relative overflow-hidden ${i === 2 ? "col-span-2" : ""}`} 
            onClick={() => openLightbox(i + 1)}
          >
            <img
              src={src || images[0]}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-8 text-white/50 hover:text-white text-5xl font-light leading-none z-50 transition-colors"
          >
            ×
          </button>

          {/* Prev Button */}
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-8 text-white/40 hover:text-white hover:scale-110 text-6xl p-4 transition-all z-50"
          >
            ‹
          </button>

          {/* Main Image Container */}
          <div 
            className="w-full max-w-7xl px-16 h-full flex flex-col items-center justify-center relative animate-fade-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} - image ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
            />
            
            {/* Image counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-8 text-white/40 hover:text-white hover:scale-110 text-6xl p-4 transition-all z-50"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
