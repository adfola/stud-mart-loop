import { Package, Laptop, BookOpen, Home, Shirt, Dumbbell, Star, Tag, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySidebar = ({ selectedCategory, onCategoryChange }: CategorySidebarProps) => {
  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "electronics", name: "Electronics", icon: Laptop },
    { id: "books", name: "Books & Study", icon: BookOpen },
    { id: "furniture", name: "Furniture", icon: Home },
    { id: "fashion", name: "Fashion", icon: Shirt },
    { id: "sports", name: "Sports & Fitness", icon: Dumbbell },
  ];

  const filters = [
    { id: "new", name: "New Arrivals", icon: Star },
    { id: "best", name: "Best Sellers", icon: TrendingDown },
    { id: "sale", name: "On Sale", icon: Tag },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-20">
        <ScrollArea className="h-[calc(100vh-6rem)]">
          <div className="space-y-6 pr-4">
            {/* Categories */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        selectedCategory === category.id && "bg-secondary"
                      )}
                      onClick={() => onCategoryChange(category.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Other</h3>
              <div className="space-y-1">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{filter.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default CategorySidebar;
