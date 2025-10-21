export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  shopId: string;
  tags?: string[];
  description?: string;
  isNew?: boolean;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  banner?: string;
  description: string;
  rating: number;
  productCount: number;
  bankDetails: BankDetails;
  createdAt: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  shopId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'awaiting_payment' | 'confirmed' | 'delivered' | 'cancelled';
  paymentScreenshot?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  productId?: string;
  image?: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  participants: string[];
  productId?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'payment';
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  timestamp: string;
}
