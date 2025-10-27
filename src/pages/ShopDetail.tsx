import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { shops, enhancedProducts } from "@/data/enhancedMockData";
import ProductCard from "@/components/ProductCard";
import { MessageSquare, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";

export default function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createThread } = useMessages();

  const shop = shops.find((s) => s.id === id);
  const shopProducts = enhancedProducts.filter((p) => p.shopId === id);

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Shop Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The shop you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/shop")}>Browse All Shops</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const thread = createThread(shop.ownerId);
    navigate(`/messages?threadId=${thread.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Shop Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{shop.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {shop.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{shop.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {shopProducts.length} products
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={handleContactSeller}
                className="gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Products from {shop.name}</h2>
          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                This shop doesn't have any products yet.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
