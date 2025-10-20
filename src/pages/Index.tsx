import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySidebar from "@/components/CategorySidebar";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import Recommendations from "@/components/Recommendations";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { products } from "@/data/mockData";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Recommendation products (first 6)
  const recommendedProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />

      <main className="flex-1">
        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Category Select */}
              <div className="lg:hidden mb-6">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                >
                  <option value="all">All Products</option>
                  <option value="electronics">Electronics</option>
                  <option value="books">Books & Study</option>
                  <option value="furniture">Furniture</option>
                  <option value="fashion">Fashion</option>
                  <option value="sports">Sports & Fitness</option>
                </select>
              </div>

              <ProductGrid products={paginatedProducts} />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <Recommendations products={recommendedProducts} />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
