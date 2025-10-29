import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useShop } from "@/contexts/ShopContext";
import { formatNGN } from "@/utils/currency";
import { Package, ShoppingCart, TrendingUp, Bell, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getSellerOrders } = useOrders();
  const { getShopsByOwner } = useShop();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isAuthenticated || user?.role !== 'seller') {
    navigate("/login");
    return null;
  }

  const orders = getSellerOrders();
  const shops = getShopsByOwner(user.id);
  const pendingOrders = orders.filter(o => o.status === 'awaiting_payment' || o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  
  const totalRevenue = confirmedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayRevenue = confirmedOrders
    .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    {
      title: "Total Revenue",
      value: formatNGN(totalRevenue),
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Today's Sales",
      value: formatNGN(todayRevenue),
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      icon: Package,
      color: "text-orange-600"
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: Bell,
      color: "text-purple-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'awaiting_payment': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your shop and track your sales
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">
              Orders {pendingOrders.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products" onClick={() => navigate("/dashboard/products")}>
              Products
            </TabsTrigger>
            <TabsTrigger value="payouts" onClick={() => navigate("/dashboard/payouts")}>
              Payouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold">{formatNGN(order.totalAmount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {shops.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Your Shop</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{shops[0].name}</p>
                    <p className="text-sm text-muted-foreground">{shops[0].description}</p>
                  </div>
                  <Button onClick={() => navigate(`/shop/${shops[0].id}`)}>
                    View Shop
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">All Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                        <div className="mt-2">
                          {order.items.map((item) => (
                            <p key={item.id} className="text-sm">
                              {item.name} x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-lg">{formatNGN(order.totalAmount)}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/messages?orderId=${order.id}`);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat with Buyer
                        </Button>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Products</h2>
                <Button onClick={() => navigate("/products/new")}>
                  Add Product
                </Button>
              </div>
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Product management coming soon
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll be able to add, edit, and manage your products here
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
