import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategorySidebar from "@/components/CategorySidebar";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { products } from "@/data/mockData";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showNew, setShowNew] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categoryParam = searchParams.get("category");
  const effectiveCategory = categoryParam || selectedCategory;

  // Filter products
  let filteredProducts = products.filter((p) => {
    const matchesCategory = effectiveCategory === "all" || p.category === effectiveCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesNew = !showNew || p.isNew;
    const matchesDiscount = !showDiscount || (p.discount && p.discount > 0);
    
    return matchesCategory && matchesPrice && matchesNew && matchesDiscount;
  });

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-64 space-y-6">
            <CategorySidebar
              selectedCategory={effectiveCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            />
            
            {/* Price Range Filter */}
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000}
                step={1000}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₦{priceRange[0].toLocaleString()}</span>
                <span>₦{priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="bg-card p-4 rounded-lg border space-y-3">
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="new" 
                  checked={showNew} 
                  onCheckedChange={(checked) => setShowNew(checked as boolean)}
                />
                <Label htmlFor="new" className="cursor-pointer">New Arrivals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="discount" 
                  checked={showDiscount} 
                  onCheckedChange={(checked) => setShowDiscount(checked as boolean)}
                />
                <Label htmlFor="discount" className="cursor-pointer">On Sale</Label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
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
      </main>
      <Footer />
    </div>
  );
}
