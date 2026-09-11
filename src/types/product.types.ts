export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: Category;
  is_trending?: boolean;
  rating?: number;
  review_count?: number;
  reviewsCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface CanReviewResponse {
  canReview: boolean;
  alreadyReviewed: boolean;
  isPurchased?: boolean;
  reason?: string | null;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

