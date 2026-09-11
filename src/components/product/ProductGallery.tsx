import { useState, useEffect } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
  className?: string;
  featuredImage?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";

export default function ProductGallery({
  images = [],
  productName,
  className = "",
  featuredImage,
}: ProductGalleryProps) {
  const baseImageList = images.length > 0 ? images : [FALLBACK_IMAGE];
  const imageList =
    featuredImage && !baseImageList.includes(featuredImage)
      ? [featuredImage, ...baseImageList]
      : baseImageList;

  const [selectedImage, setSelectedImage] = useState<string>(featuredImage || imageList[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    if (featuredImage) {
      setSelectedImage(featuredImage);
    } else if (imageList.length > 0) {
      setSelectedImage(imageList[0]);
    }
  }, [featuredImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setMousePos({ x: xPercent, y: yPercent });
  };

  // Lens rectangle position calculation (40% x 40% lens box matching 2.5x zoom ratio)
  const lensWidth = 40;
  const lensHeight = 40;
  const lensLeft = Math.max(0, Math.min(mousePos.x - lensWidth / 2, 100 - lensWidth));
  const lensTop = Math.max(0, Math.min(mousePos.y - lensHeight / 2, 100 - lensHeight));

  const openModal = () => {
    const idx = imageList.indexOf(selectedImage);
    setModalIndex(idx >= 0 ? idx : 0);
    setIsModalOpen(true);
  };

  return (
    <div className={`w-full max-w-full min-w-0 flex flex-col select-none relative ${className}`}>
      {/* Row Layout: Vertical Thumbnails Strip (Left) + Main Image Viewport (Right) */}
      <div className="flex flex-row items-start gap-2.5 sm:gap-3 w-full">
        {/* Left Side: Vertical Thumbnail Column (Amazon desktop layout) */}
        {imageList.length > 1 && (
          <div className="flex flex-col gap-2 shrink-0 overflow-y-auto max-h-[320px] sm:max-h-[380px] py-0.5 px-0.5 no-scrollbar">
            {imageList.map((img, idx) => {
              const isSelected = (selectedImage || imageList[0]) === img;
              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setSelectedImage(img)}
                  onClick={() => setSelectedImage(img)}
                  aria-label={`Select product image ${idx + 1}`}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded bg-white overflow-hidden transition-all shrink-0 cursor-pointer p-0.5 ${
                    isSelected
                      ? "border-2 border-[#007185] ring-1 ring-[#007185]/40 shadow-2xs scale-105"
                      : "border border-gray-300 hover:border-gray-500 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain rounded-xs"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Right Side: Main Image Viewport Container */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
          <div
            className="relative w-full aspect-square max-h-[320px] sm:max-h-[380px] bg-white rounded-lg flex items-center justify-center p-0 cursor-crosshair group border border-transparent hover:border-gray-200 transition-colors"
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                setIsHovered(true);
              }
            }}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={openModal}
          >
            <img
              src={selectedImage || imageList[0]}
              alt={productName}
              className="w-full h-full max-w-full max-h-full object-contain"
            />

            {/* Amazon Lens Box over mouse position on main image */}
            {isHovered && (
              <div
                className="hidden md:block absolute border border-[#007185] bg-[#007185]/20 backdrop-blur-[0.5px] pointer-events-none z-20 shadow-xs rounded-xs"
                style={{
                  left: `${lensLeft}%`,
                  top: `${lensTop}%`,
                  width: `${lensWidth}%`,
                  height: `${lensHeight}%`,
                }}
              />
            )}

            {/* Hover zoom pill hint */}
            <div className="hidden sm:flex items-center gap-1 absolute bottom-2 right-2 text-[10px] text-gray-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-gray-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xs">
              <ZoomIn className="w-3 h-3 text-[#007185]" />
              <span>Roll over image to zoom</span>
            </div>

            {/* Amazon Side Flyout Zoom Window */}
            {isHovered && (
              <div className="hidden md:block absolute left-[calc(100%+12px)] top-0 z-50 w-[640px] lg:w-[760px] xl:w-[860px] h-full min-h-[320px] bg-white border border-gray-400 shadow-2xl rounded-xs overflow-hidden pointer-events-none">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${selectedImage || imageList[0]})`,
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: "250% 250%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}
          </div>

          {/* Click to see full view link */}
          <button
            type="button"
            onClick={openModal}
            className="text-[11px] text-[#007185] hover:text-[#c7511f] hover:underline font-normal mt-1 flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <ZoomIn className="w-3 h-3 text-[#007185]" />
            <span>Click to see full view</span>
          </button>
        </div>
      </div>

      {/* Amazon Full-Screen Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col justify-between p-4 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between text-white pb-2 max-w-6xl mx-auto w-full">
            <h2 className="text-sm font-semibold truncate max-w-lg">{productName}</h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close high-res view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Center Viewport */}
          <div className="flex-1 flex items-center justify-center relative max-w-5xl mx-auto w-full my-auto overflow-hidden">
            {imageList.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setModalIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1))
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={imageList[modalIndex]}
              alt={`${productName} full view ${modalIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded"
            />

            {imageList.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setModalIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Modal Thumbnail Row Footer */}
          <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto max-w-xl mx-auto w-full">
            {imageList.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setModalIndex(idx)}
                className={`w-12 h-12 rounded border p-0.5 bg-white transition-all cursor-pointer ${
                  modalIndex === idx
                    ? "border-[#007185] ring-2 ring-[#007185] scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
