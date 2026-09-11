import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../../services/product.service";
import { useCart } from "../../context/CartContext";
import { decryptId } from "../../utils/urlSecurity";
import type { Product, ProductColorVariant } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import ProductBreadcrumbs from "../../components/product/ProductBreadcrumbs";
import ProductGallery from "../../components/product/ProductGallery";
import ProductInfo from "../../components/product/ProductInfo";
import ProductBuyBox from "../../components/product/ProductBuyBox";
import ProductReviewsSection from "../../components/product/ProductReviewsSection";

export default function ProductDetail() {
  const { id: urlParamId } = useParams<{ id: string }>();
  const id = decryptId(urlParamId || "");
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductColorVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getById(id);
        if (isMounted) {
          const p = res.data;
          setProduct(p);
          if (p.color_variants && p.color_variants.length > 0) {
            setSelectedVariant(p.color_variants[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loader text="Loading product details..." />;

  if (!product) {
    return (
      <div className="bg-white p-12 text-center border border-gray-200 rounded-xl max-w-lg mx-auto my-12 space-y-3">
        <h2 className="text-lg font-bold text-[#191142]">Product not found</h2>
        <p className="text-xs text-gray-500">The product you are looking for might have been moved or removed.</p>
        <Link to="/" className="inline-block text-xs font-bold text-white bg-[#0ea9df] hover:bg-[#0c93c4] px-4 py-2 rounded-lg transition-colors">
          Return to Store
        </Link>
      </div>
    );
  }

  const activeImage =
    selectedVariant?.image ||
    (product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800");

  const handleAddToCart = (quantity: number) => {
    addItem({
      productId: product.id,
      name: selectedVariant?.name ? `${product.name} (${selectedVariant.name})` : product.name,
      price: product.price,
      quantity,
      image: activeImage,
      color: selectedVariant?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (quantity: number) => {
    addItem({
      productId: product.id,
      name: selectedVariant?.name ? `${product.name} (${selectedVariant.name})` : product.name,
      price: product.price,
      quantity,
      image: activeImage,
      color: selectedVariant?.name,
    });
    navigate("/checkout");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xs space-y-6 pb-28 lg:pb-8 w-full max-w-full overflow-hidden">
      {/* Breadcrumb Navigation */}
      <ProductBreadcrumbs
        categoryName={product.category?.name}
        categoryId={product.categoryId}
        productName={product.name}
      />

      {/* Responsive 3-Column PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 w-full min-w-0">
          <ProductGallery
            images={product.images}
            productName={product.name}
            featuredImage={selectedVariant?.image}
          />
        </div>

        {/* Column 2: Specs & Details (4 cols) */}
        <div className="lg:col-span-4 w-full min-w-0">
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={(v) => setSelectedVariant(v)}
          />
        </div>

        {/* Column 3: Buy Box (3 cols) */}
        <div className="lg:col-span-3 w-full min-w-0 lg:sticky lg:top-24">
          <ProductBuyBox
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isAdding={added}
          />
        </div>
      </div>

      {/* Customer Ratings & Verified Buyer Reviews */}
      <ProductReviewsSection product={product} />

      {/* Sticky Mobile Action Bar (Hidden on desktop, fixed above bottom nav on mobile) */}
      <div className="lg:hidden fixed bottom-[calc(52px+max(0.375rem,env(safe-area-inset-bottom,0px)))] md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="shrink-0">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-gray-600">₹</span>
              <span className="text-lg font-black text-[#191142]">
                {product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={() => handleAddToCart(1)}
              className="flex-1 max-w-[130px] py-2.5 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#191142] text-xs font-bold transition-all text-center border border-gray-300 cursor-pointer"
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => handleBuyNow(1)}
              className="flex-1 max-w-[130px] py-2.5 px-2 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-all text-center shadow-xs cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
