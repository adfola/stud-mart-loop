import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { products } from "@/data/mockData";

export default function Categories() {
  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const getCategoryCount = (category: string) => {
    return products.filter((p) => p.category === category).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">All Categories</h1>
        <p className="text-muted-foreground mb-8">
          Browse products by category
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/?category=${encodeURIComponent(category)}`}
              className="group bg-card border rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {category}
              </h3>
              <p className="text-muted-foreground">
                {getCategoryCount(category)} products
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
