import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { enhancedProducts } from "@/data/enhancedMockData";

export default function Deals() {
  // Filter products with discounts or new items
  const dealProducts = enhancedProducts.filter(
    (product) => product.discount > 0 || product.isNew
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Deals & New Arrivals</h1>
        <p className="text-muted-foreground mb-8">
          {dealProducts.length} special offers and new products
        </p>

        {dealProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No deals available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
