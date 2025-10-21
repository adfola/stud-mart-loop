import { Product, Shop, Order, Message, ChatThread } from "@/types";

export const shops: Shop[] = [
  {
    id: "s001",
    name: "Tech Haven",
    slug: "tech-haven",
    ownerId: "seller1",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=300&fit=crop",
    description: "Your one-stop shop for quality electronics and gadgets",
    rating: 4.7,
    productCount: 8,
    bankDetails: {
      bankName: "GTBank",
      accountName: "Tech Haven Store",
      accountNumber: "0123456789"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "s002",
    name: "Campus Books",
    slug: "campus-books",
    ownerId: "seller2",
    banner: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=300&fit=crop",
    description: "Textbooks, novels, and study materials for students",
    rating: 4.5,
    productCount: 4,
    bankDetails: {
      bankName: "Access Bank",
      accountName: "Campus Books Ltd",
      accountNumber: "9876543210"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "s003",
    name: "Style Hub",
    slug: "style-hub",
    ownerId: "seller1",
    banner: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=300&fit=crop",
    description: "Trendy fashion and accessories for the modern student",
    rating: 4.8,
    productCount: 3,
    bankDetails: {
      bankName: "Zenith Bank",
      accountName: "Style Hub Fashion",
      accountNumber: "5555666677"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "s004",
    name: "Fit Life",
    slug: "fit-life",
    ownerId: "seller2",
    banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=300&fit=crop",
    description: "Sports equipment and fitness gear for active students",
    rating: 4.6,
    productCount: 2,
    bankDetails: {
      bankName: "First Bank",
      accountName: "Fit Life Sports",
      accountNumber: "8888999900"
    },
    createdAt: new Date().toISOString()
  }
];

export const enhancedProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    price: 35000,
    originalPrice: 50000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop"
    ],
    category: "electronics",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    stock: 15,
    shopId: "s001",
    tags: ["audio", "wireless", "bluetooth"],
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
    isNew: true,
    discount: 30
  },
  {
    id: "2",
    name: "Study Lamp LED",
    price: 12000,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    stock: 25,
    shopId: "s001",
    tags: ["lamp", "led", "study"],
    description: "Adjustable LED study lamp with multiple brightness levels and USB charging port."
  },
  {
    id: "3",
    name: "Ergonomic Chair",
    price: 75000,
    originalPrice: 110000,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop",
    category: "furniture",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    stock: 8,
    shopId: "s001",
    tags: ["furniture", "chair", "ergonomic"],
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height.",
    discount: 32
  },
  {
    id: "4",
    name: "Calculus Textbook",
    price: 18000,
    originalPrice: 28000,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    category: "books",
    rating: 4.3,
    reviews: 67,
    inStock: true,
    stock: 12,
    shopId: "s002",
    tags: ["textbook", "mathematics", "education"],
    description: "Comprehensive calculus textbook for university students.",
    discount: 36
  },
  {
    id: "5",
    name: "Laptop Stand Aluminum",
    price: 18500,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.6,
    reviews: 145,
    inStock: true,
    stock: 20,
    shopId: "s001",
    tags: ["laptop", "stand", "aluminum", "accessories"],
    description: "Portable aluminum laptop stand with cooling ventilation."
  },
  {
    id: "6",
    name: "Yoga Mat Premium",
    price: 11000,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    category: "sports",
    rating: 4.4,
    reviews: 92,
    inStock: true,
    stock: 30,
    shopId: "s004",
    tags: ["yoga", "fitness", "mat"],
    description: "Non-slip premium yoga mat with carrying strap.",
    isNew: true
  },
  {
    id: "7",
    name: "Backpack Travel",
    price: 22000,
    originalPrice: 32000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "fashion",
    rating: 4.7,
    reviews: 178,
    inStock: true,
    stock: 18,
    shopId: "s003",
    tags: ["backpack", "travel", "fashion"],
    description: "Durable travel backpack with laptop compartment and USB charging port.",
    discount: 31
  },
  {
    id: "8",
    name: "Desk Organizer Set",
    price: 9500,
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop",
    category: "furniture",
    rating: 4.2,
    reviews: 54,
    inStock: true,
    stock: 40,
    shopId: "s001",
    tags: ["organizer", "desk", "accessories"],
    description: "Complete desk organizer set with pen holders and document trays."
  },
  {
    id: "9",
    name: "Smart Watch Fitness",
    price: 55000,
    originalPrice: 75000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.5,
    reviews: 312,
    inStock: true,
    stock: 12,
    shopId: "s001",
    tags: ["smartwatch", "fitness", "wearable"],
    description: "Fitness smart watch with heart rate monitor and GPS tracking.",
    isNew: true,
    discount: 27
  },
  {
    id: "10",
    name: "Notebook Set Premium",
    price: 7500,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    category: "books",
    rating: 4.6,
    reviews: 87,
    inStock: true,
    stock: 50,
    shopId: "s002",
    tags: ["notebook", "stationery", "premium"],
    description: "Set of 5 premium notebooks with hardcover and dotted pages."
  },
  {
    id: "11",
    name: "Wireless Mouse Ergonomic",
    price: 14500,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    stock: 22,
    shopId: "s001",
    tags: ["mouse", "wireless", "ergonomic"],
    description: "Ergonomic wireless mouse with adjustable DPI settings."
  },
  {
    id: "12",
    name: "Water Bottle Insulated",
    price: 8500,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    category: "sports",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    stock: 35,
    shopId: "s004",
    tags: ["water bottle", "insulated", "fitness"],
    description: "Double-walled insulated water bottle keeps drinks cold for 24 hours."
  },
  {
    id: "13",
    name: "Physics Textbook Advanced",
    price: 22000,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop",
    category: "books",
    rating: 4.5,
    reviews: 45,
    inStock: true,
    stock: 10,
    shopId: "s002",
    tags: ["textbook", "physics", "science"],
    description: "Advanced physics textbook with practice problems and solutions."
  },
  {
    id: "14",
    name: "Bluetooth Speaker Portable",
    price: 25000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.6,
    reviews: 198,
    inStock: true,
    stock: 16,
    shopId: "s001",
    tags: ["speaker", "bluetooth", "portable", "audio"],
    description: "Waterproof portable Bluetooth speaker with 12-hour battery life.",
    isNew: true
  },
  {
    id: "15",
    name: "Canvas Sneakers",
    price: 16000,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
    category: "fashion",
    rating: 4.3,
    reviews: 89,
    inStock: true,
    stock: 28,
    shopId: "s003",
    tags: ["shoes", "sneakers", "fashion"],
    description: "Comfortable canvas sneakers perfect for campus life."
  },
  {
    id: "16",
    name: "Engineering Drawing Set",
    price: 13500,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop",
    category: "books",
    rating: 4.7,
    reviews: 62,
    inStock: true,
    stock: 14,
    shopId: "s002",
    tags: ["drawing", "engineering", "tools"],
    description: "Complete engineering drawing set with compass, rulers, and templates."
  }
];

export const mockMessages: Message[] = [
  {
    id: "m001",
    threadId: "t001",
    senderId: "buyer1",
    receiverId: "seller1",
    content: "Hi, is this item still available?",
    productId: "1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true
  },
  {
    id: "m002",
    threadId: "t001",
    senderId: "seller1",
    receiverId: "buyer1",
    content: "Yes, it's available! Would you like to place an order?",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    read: true
  }
];

export const mockChatThreads: ChatThread[] = [
  {
    id: "t001",
    participants: ["buyer1", "seller1"],
    productId: "1",
    lastMessage: mockMessages[1],
    unreadCount: 0
  }
];

export const mockOrders: Order[] = [
  {
    id: "ord001",
    buyerId: "buyer1",
    sellerId: "seller1",
    shopId: "s001",
    items: [
      {
        ...enhancedProducts[0],
        quantity: 1
      }
    ],
    totalAmount: 35000,
    status: "awaiting_payment",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const config = {
  networkDelayMs: 600,
  paymentSuccessProbability: 0.9,
  notificationSoundUrl: "/notification.mp3"
};
