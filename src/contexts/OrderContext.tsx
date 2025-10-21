import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Order } from "@/types";
import { mockOrders } from "@/data/enhancedMockData";
import { useAuth } from "./AuthContext";
import { playNotificationSound, showNotification } from "@/utils/notifications";

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getBuyerOrders: () => Order[];
  getSellerOrders: () => Order[];
  markAsPaid: (orderId: string, screenshot?: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode}) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : mockOrders;
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [...prev, newOrder]);

    // Notify seller
    setTimeout(() => {
      playNotificationSound();
      showNotification('New Order!', {
        body: `You have a new order for ₦${newOrder.totalAmount.toLocaleString()}`,
        tag: newOrder.id
      });
    }, 500);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const markAsPaid = (orderId: string, screenshot?: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { 
            ...order, 
            status: 'confirmed' as const, 
            paymentScreenshot: screenshot,
            updatedAt: new Date().toISOString() 
          }
        : order
    ));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getBuyerOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.buyerId === user.id);
  };

  const getSellerOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.sellerId === user.id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      getBuyerOrders,
      getSellerOrders,
      markAsPaid
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
}
