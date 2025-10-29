import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/mockData";
import { Product } from "@/types";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-8">
          {results.length} results for "{query}"
        </p>
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
