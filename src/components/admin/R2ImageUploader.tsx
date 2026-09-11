import { useState, useRef } from "react";
import { UploadCloud, X, Star, Loader2, ImagePlus, Link2, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

interface R2ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function R2ImageUploader({
  images,
  onChange,
  maxImages = 6,
}: R2ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (fileArray.length === 0) {
      setError("Please select valid image files (PNG, JPG, WEBP, AVIF).");
      return;
    }

    if (images.length + fileArray.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images per product.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("file", file);
      });

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrls: string[] = res.data.urls || (res.data.url ? [res.data.url] : []);
      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to upload image to Cloudflare R2.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images reached.`);
      return;
    }
    onChange([...images, manualUrl.trim()]);
    setManualUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-800">
          Product Images (Cloudflare R2 Storage)
        </label>
        <span className="text-[11px] text-gray-500">
          {images.length} of {maxImages} uploaded
        </span>
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          uploading
            ? "border-[#0ea9df] bg-cyan-50/50 cursor-wait"
            : "border-gray-300 hover:border-[#0ea9df] hover:bg-slate-50 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-[#0ea9df] animate-spin" />
            <p className="text-xs font-bold text-[#191142]">Uploading to Cloudflare R2 Bucket...</p>
            <p className="text-[11px] text-gray-500">Optimizing and storing high-resolution assets</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-[#0ea9df]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#191142]">
              Drag & drop images here, or <span className="text-[#0ea9df] underline">browse</span>
            </p>
            <p className="text-[11px] text-gray-400">
              Supports PNG, JPG, WEBP, AVIF up to 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Manual URL Toggle Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#0ea9df] hover:underline font-semibold flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          {showUrlInput ? "Hide URL input" : "+ Add image via URL"}
        </button>
      </div>

      {/* Manual URL Form */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df]"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 bg-[#191142] text-white text-xs font-bold rounded-lg hover:bg-[#261d5e] transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Image Thumbnails Strip */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className={`relative group rounded-xl border p-1.5 bg-white shadow-xs overflow-hidden ${
                idx === 0
                  ? "border-[#0ea9df] ring-2 ring-[#0ea9df]/20"
                  : "border-gray-200"
              }`}
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={url}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Cover Badge for First Image */}
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-[#191142] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-[#0ea9df] text-[#0ea9df]" /> Cover
                </span>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1.5 p-1">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Make Cover Image"
                    className="p-1.5 bg-white/90 hover:bg-white text-[#191142] rounded-lg shadow-sm text-[10px] font-bold"
                  >
                    Set Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Remove Image"
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
