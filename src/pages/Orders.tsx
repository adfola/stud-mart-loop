import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { formatNGN } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";

export default function Orders() {
  const { getBuyerOrders } = useOrders();
  const { user } = useAuth();
  const { getUserThreads } = useMessages();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const orders = getBuyerOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'awaiting_payment':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          {orders.length} orders total
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button onClick={() => navigate("/")}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'PPp')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatNGN(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex-1">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary ml-4">
                      {formatNGN(order.totalAmount)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const threads = getUserThreads();
                      const orderThread = threads.find(t => 
                        t.productId && order.items.some(item => item.id === t.productId)
                      );
                      if (orderThread) {
                        navigate(`/messages?threadId=${orderThread.id}`);
                      } else {
                        navigate(`/messages?orderId=${order.id}`);
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                </div>

                {order.status === 'awaiting_payment' && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm mb-2">Please transfer to:</p>
                    <p className="text-sm font-mono">GTBank - 0123456789</p>
                    <p className="text-sm">Amount: {formatNGN(order.totalAmount)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
