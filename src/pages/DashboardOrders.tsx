import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatNGN } from "@/utils/currency";
import { MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DashboardOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSellerOrders, updateOrderStatus } = useOrders();

  if (!user || user.role !== "seller") {
    navigate("/login");
    return null;
  }

  const orders = getSellerOrders();

  const handleConfirmPayment = (orderId: string) => {
    updateOrderStatus(orderId, "confirmed");
    toast({
      title: "Payment confirmed",
      description: "Order is now being processed.",
    });
  };

  const handleMarkShipped = (orderId: string) => {
    updateOrderStatus(orderId, "delivered");
    toast({
      title: "Order marked as shipped",
      description: "Buyer has been notified.",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500",
      awaiting_payment: "bg-orange-500/10 text-orange-500",
      confirmed: "bg-blue-500/10 text-blue-500",
      delivered: "bg-green-500/10 text-green-500",
      cancelled: "bg-red-500/10 text-red-500",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatNGN(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-primary">
                      {formatNGN(order.totalAmount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/messages")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                    {order.status === "awaiting_payment" && order.paymentScreenshot && (
                      <Button size="sm" onClick={() => handleConfirmPayment(order.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Payment
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button size="sm" onClick={() => handleMarkShipped(order.id)}>
                        Mark Shipped
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
