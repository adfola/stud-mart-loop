import { Product } from "@/types";
import { products } from "@/data/mockData";

const MOCK_DELAY = 600;

const delay = (ms: number = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async getProducts(): Promise<Product[]> {
    await delay();
    return products;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    await delay();
    return products.find((p) => p.id === id);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    await delay();
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay();
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  },

  async getRecommendations(productId?: string): Promise<Product[]> {
    await delay();
    // Return first 6 products as recommendations
    return products.slice(0, 6);
  },
};
