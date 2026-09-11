import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Loader from "../../components/common/Loader";
import R2ImageUploader from "../../components/admin/R2ImageUploader";
import { Database, Copy, Check, ExternalLink, RefreshCw, HardDrive } from "lucide-react";

interface MediaItem {
  key: string;
  size: number;
  uploaded: string;
  url: string;
}

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/media");
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-50 text-[#0ea9df]">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#191142]">
              Cloudflare R2 Media Storage
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Connected Bucket: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#191142] font-mono font-bold">buddymatters</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMedia}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white transition-colors shadow-xs"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Direct Uploader Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#191142] flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#0ea9df]" /> Upload High-Resolution Product Images
        </h2>
        <R2ImageUploader
          images={uploadedUrls}
          onChange={(imgs) => {
            setUploadedUrls(imgs);
            fetchMedia();
          }}
          maxImages={12}
        />
      </div>

      {/* Storage Items Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#191142]">
          Stored Assets in Bucket ({items.length})
        </h2>

        {loading ? (
          <Loader text="Querying R2 bucket storage..." />
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 text-xs">
            No media files uploaded yet in bucket <code className="font-bold">buddymatters</code>. Upload files above to populate storage.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.key}
                className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-xs space-y-2 group hover:border-[#0ea9df] transition-all"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
                  <img
                    src={item.url}
                    alt={item.key}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url)}
                      className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 shadow-sm"
                      title="Copy URL"
                    >
                      {copiedUrl === item.url ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 shadow-sm"
                      title="Open full size"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 truncate" title={item.key}>
                  {item.key.replace("products/", "")}
                </div>
                <div className="text-[9px] text-gray-400 flex justify-between items-center">
                  <span>{(item.size / 1024).toFixed(1)} KB</span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="hidden sm:inline text-[#0ea9df] group-hover:underline cursor-pointer" onClick={() => handleCopy(item.url)}>
                    {copiedUrl === item.url ? "Copied!" : "Copy"}
                  </span>
                </div>

                {/* Mobile touch action buttons (visible on mobile where hover is not available) */}
                <div className="flex sm:hidden items-center justify-between gap-1 pt-1.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="flex-1 py-1 px-1.5 bg-gray-50 hover:bg-gray-100 text-[#191142] text-[10px] font-bold rounded-md flex items-center justify-center gap-1 border border-gray-200 transition-colors"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-500" /> Copy
                      </>
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-gray-500 hover:text-gray-800 rounded-md bg-gray-50 border border-gray-200"
                    title="Open image"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
