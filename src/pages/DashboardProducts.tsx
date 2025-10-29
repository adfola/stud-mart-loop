import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/mockData";
import { formatNGN } from "@/utils/currency";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DashboardProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "electronics",
    description: "",
    stock: "",
  });

  if (!user || user.role !== "seller") {
    navigate("/login");
    return null;
  }

  // In real app, filter by user's shop
  const myProducts = products.slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product added",
      description: "Your product has been created successfully.",
    });
    setIsDialogOpen(false);
    setProductForm({
      name: "",
      price: "",
      category: "electronics",
      description: "",
      stock: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Products</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (NGN)</Label>
                    <Input
                      id="price"
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({ ...productForm, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({ ...productForm, stock: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                  >
                    <option value="electronics">Electronics</option>
                    <option value="books">Books</option>
                    <option value="furniture">Furniture</option>
                    <option value="fashion">Fashion</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {myProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="font-bold text-primary mt-1">{formatNGN(product.price)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
