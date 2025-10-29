import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { formatNGN } from "@/utils/currency";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    campus: "",
    department: "",
  });

  const shippingCost = 500;
  const total = totalPrice + shippingCost;

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOrder = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // For now, assume first seller - in real app, would group by seller
    const firstShopId = items[0]?.shopId || "s001";
    const firstSellerId = "seller1"; // Would get from shop data

    // Create order with proper structure
    const order = createOrder({
      buyerId: user.id,
      sellerId: firstSellerId,
      shopId: firstShopId,
      items: items,
      totalAmount: total,
      status: 'awaiting_payment' as const,
    });
    
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: `Order #${order.id} has been created. Seller has been notified.`,
    });
    navigate(`/order/${order.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5" /> : "1"}
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              {step > 2 ? <Check className="w-5 h-5" /> : "2"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleSubmitShipping} className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="campus">Campus</Label>
                        <Input
                          id="campus"
                          name="campus"
                          required
                          value={formData.campus}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          required
                          value={formData.department}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-6">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="bg-card p-6 rounded-lg border space-y-6">
                <h2 className="text-xl font-bold">Bank Transfer Payment</h2>
                
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-semibold">Transfer to:</p>
                  <p className="text-sm">Bank: GTBank</p>
                  <p className="text-sm">Account Name: Campus Market Escrow</p>
                  <p className="text-sm font-mono">Account Number: 0123456789</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Amount: {formatNGN(total)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    After making the transfer, click the button below to place your order.
                    The seller will be notified and will confirm your payment.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCompleteOrder}
                >
                  I have made the transfer - Place Order
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back to Shipping
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatNGN(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatNGN(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{formatNGN(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatNGN(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
