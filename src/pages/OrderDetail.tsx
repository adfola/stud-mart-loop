import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { formatNGN } from "@/utils/currency";
import { ArrowLeft, Upload, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrderById, markAsPaid, updateOrderStatus } = useOrders();
  const { getShopById } = useShop();
  const [proofImage, setProofImage] = useState<string>("");

  const order = getOrderById(orderId || "");

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Order not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const shop = getShopById(order.shopId);
  const isBuyer = user?.id === order.buyerId;
  const isSeller = user?.id === order.sellerId;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkPaid = () => {
    markAsPaid(order.id, proofImage);
    toast({
      title: "Payment proof uploaded",
      description: "Seller has been notified to verify your payment.",
    });
  };

  const handleConfirmPayment = () => {
    updateOrderStatus(order.id, "confirmed");
    toast({
      title: "Payment confirmed",
      description: "Order is now being processed.",
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold mb-2">Order Items</h2>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatNGN(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatNGN(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {isBuyer && order.status === "awaiting_payment" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Upload Payment Proof</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="proof">Upload Screenshot</Label>
                    <Input
                      id="proof"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2"
                    />
                  </div>
                  {proofImage && (
                    <img src={proofImage} alt="Payment proof" className="max-w-sm rounded" />
                  )}
                  <Button onClick={handleMarkPaid} disabled={!proofImage} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Payment Proof
                  </Button>
                </div>
              </Card>
            )}

            {isSeller && order.paymentScreenshot && order.status === "awaiting_payment" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Verify Payment</h2>
                <img
                  src={order.paymentScreenshot}
                  alt="Payment proof"
                  className="max-w-sm rounded mb-4"
                />
                <Button onClick={handleConfirmPayment} className="w-full">
                  Confirm Payment Received
                </Button>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            {shop && (
              <Card className="p-6 mb-4">
                <h2 className="font-bold mb-2">Shop Information</h2>
                <p className="text-lg mb-4">{shop.name}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact {isBuyer ? "Seller" : "Buyer"}
                </Button>
              </Card>
            )}

            {shop?.bankDetails && isBuyer && order.status === "awaiting_payment" && (
              <Card className="p-6">
                <h2 className="font-bold mb-4">Bank Transfer Details</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Bank</p>
                    <p className="font-medium">{shop.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Name</p>
                    <p className="font-medium">{shop.bankDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-mono font-medium">{shop.bankDetails.accountNumber}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-primary">{formatNGN(order.totalAmount)}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
