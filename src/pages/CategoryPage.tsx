import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { products } from "@/data/mockData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categoryProducts = products.filter((p) => p.category === slug);
  
  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = categoryProducts.slice(startIndex, startIndex + itemsPerPage);

  const categoryNames: Record<string, string> = {
    electronics: "Electronics",
    books: "Books & Study Materials",
    furniture: "Furniture",
    fashion: "Fashion & Accessories",
    sports: "Sports & Fitness",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {categoryNames[slug || ""] || slug}
          </h1>
          <p className="text-muted-foreground">
            {categoryProducts.length} products available
          </p>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found in this category</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <>
            <ProductGrid products={paginatedProducts} />
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
