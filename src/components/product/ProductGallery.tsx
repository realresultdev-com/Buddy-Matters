import { useState } from "react";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
  className?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";

export default function ProductGallery({
  images = [],
  productName,
  className = "",
}: ProductGalleryProps) {
  const imageList = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [selectedImage, setSelectedImage] = useState<string>(imageList[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className={`w-full max-w-full min-w-0 flex flex-col-reverse sm:flex-row gap-3 lg:gap-4 items-start select-none overflow-hidden ${className}`}>
      {/* Thumbnails strip */}
      {imageList.length > 1 && (
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-w-full w-full sm:w-auto max-h-[480px] shrink-0 p-0.5 no-scrollbar">
          {imageList.map((img, idx) => {
            const isSelected = (selectedImage || imageList[0]) === img;
            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => setSelectedImage(img)}
                onClick={() => setSelectedImage(img)}
                aria-label={`Select product image ${idx + 1}`}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg border p-1 bg-white overflow-hidden transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "border-[#0ea9df] ring-2 ring-[#0ea9df]/30 shadow-xs"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Viewport */}
      <div
        className="relative w-full max-w-full aspect-square sm:max-h-[480px] bg-white border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center p-2 sm:p-4 shadow-xs group"
        onMouseEnter={() => {
          if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
            setIsZoomed(true);
          }
        }}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={selectedImage || imageList[0]}
          alt={productName}
          className={`w-full h-full max-w-full max-h-full object-contain transition-transform duration-150 ${
            isZoomed ? "scale-125" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        {/* Hover zoom pill hint (Only on hover devices) */}
        <div className="hidden sm:block absolute bottom-2 right-2 text-[10px] text-gray-400 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-gray-100 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Roll over image to zoom
        </div>
      </div>
    </div>
  );
}
