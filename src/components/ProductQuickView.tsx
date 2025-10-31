import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { Star, ShoppingCart, MessageSquare, Plus, Minus } from "lucide-react";
import { formatNGN } from "@/utils/currency";
import { shops } from "@/data/enhancedMockData";
import { toast } from "@/hooks/use-toast";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { createThread } = useMessages();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const shop = shops.find((s) => s.id === product.shopId);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart",
      description: `${product.name} (x${quantity}) added to your cart`,
    });
    onOpenChange(false);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (shop) {
      const thread = createThread(shop.ownerId, product.id);
      navigate(`/messages?threadId=${thread.id}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">
                {product.category}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-primary">
                  {formatNGN(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatNGN(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-4">
                {product.description || "High quality product available now."}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleContactSeller}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat with Seller
            </Button>

            {/* Shop */}
            {shop && (
              <div className="pt-4 border-t">
                <p className="text-sm mb-1">
                  <span className="font-medium">Sold by:</span>{" "}
                  <button 
                    onClick={() => {
                      navigate(`/shop/${shop.id}`);
                      onOpenChange(false);
                    }}
                    className="text-primary hover:underline"
                  >
                    {shop.name}
                  </button>
                </p>
              </div>
            )}

            <Button 
              variant="link" 
              className="w-full"
              onClick={() => {
                navigate(`/product/${product.id}`);
                onOpenChange(false);
              }}
            >
              View Full Details →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
