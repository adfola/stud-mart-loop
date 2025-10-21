import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { shops } from "@/data/enhancedMockData";
import { enhancedProducts } from "@/data/enhancedMockData";

export default function Shop() {
  const getShopProductCount = (shopId: string) => {
    return enhancedProducts.filter((p) => p.shopId === shopId).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">All Shops</h1>
        <p className="text-muted-foreground mb-8">
          {shops.length} shops available
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              to={`/shop/${shop.id}`}
              className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {shop.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {shop.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {getShopProductCount(shop.id)} products
                  </span>
                  <span className="text-primary font-medium">
                    View Shop →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
