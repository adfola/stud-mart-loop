import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Shop } from "@/types";
import { shops as initialShops } from "@/data/enhancedMockData";

interface ShopContextType {
  shops: Shop[];
  getShopById: (id: string) => Shop | undefined;
  getShopsByOwner: (ownerId: string) => Shop[];
  createShop: (shop: Omit<Shop, 'id' | 'createdAt' | 'productCount' | 'rating'>) => Shop;
  updateShop: (id: string, updates: Partial<Shop>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem("shops");
    return saved ? JSON.parse(saved) : initialShops;
  });

  useEffect(() => {
    localStorage.setItem("shops", JSON.stringify(shops));
  }, [shops]);

  const getShopById = (id: string) => {
    return shops.find(shop => shop.id === id);
  };

  const getShopsByOwner = (ownerId: string) => {
    return shops.filter(shop => shop.ownerId === ownerId);
  };

  const createShop = (shopData: Omit<Shop, 'id' | 'createdAt' | 'productCount' | 'rating'>) => {
    const newShop: Shop = {
      ...shopData,
      id: `shop_${Date.now()}`,
      productCount: 0,
      rating: 0,
      createdAt: new Date().toISOString()
    };
    setShops(prev => [...prev, newShop]);
    return newShop;
  };

  const updateShop = (id: string, updates: Partial<Shop>) => {
    setShops(prev => prev.map(shop => 
      shop.id === id ? { ...shop, ...updates } : shop
    ));
  };

  return (
    <ShopContext.Provider value={{
      shops,
      getShopById,
      getShopsByOwner,
      createShop,
      updateShop
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
