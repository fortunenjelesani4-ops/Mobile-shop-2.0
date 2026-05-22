export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  brand: string;
  stock: number;
  isTrending?: boolean;
  isNew?: boolean;
  isFlashSale?: boolean;
  discountRate?: number;
}

export interface CartItem {
  id: string; // combination of productId_size_color
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TrackingStep {
  status: 'ordered' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'ordered' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  paymentMethod: 'card' | 'airtel' | 'mtn';
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentNumber?: string; // for Mobile Money
  address: DeliveryAddress;
  createdAt: string;
  riderName?: string;
  riderPhone?: string;
  estimatedDelivery: string;
  couponCode?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  addresses: DeliveryAddress[];
  wishlist: string[]; // product IDs
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: string[]; // IDs of products
}
