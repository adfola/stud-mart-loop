import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useShop } from "@/contexts/ShopContext";
import { formatNGN } from "@/utils/currency";
import { Package, ShoppingCart, TrendingUp, Bell, MessageSquare, ArrowRight, BarChart3, Wallet, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Analytics data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const salesData = last7Days.map(date => {
    const dayOrders = orders.filter(o => 
      new Date(o.createdAt).toDateString() === date.toDateString() &&
      (o.status === 'confirmed' || o.status === 'delivered')
    );
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: dayOrders.length
    };
  });

  const stats = [
    {
      title: "Total Revenue",
      value: formatNGN(totalRevenue),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Today's Sales",
      value: formatNGN(todayRevenue),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10"
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
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sales Chart */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Sales Overview (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        formatter={(value: number) => formatNGN(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Orders Overview (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="orders" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/products')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Manage</p>
                      <p className="text-lg font-semibold">Products</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('orders')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">View All</p>
                      <p className="text-lg font-semibold">Orders</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/payouts')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Request</p>
                      <p className="text-lg font-semibold">Payouts</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
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
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
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
              </CardContent>
            </Card>

            {shops.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Shop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{shops[0].name}</p>
                      <p className="text-sm text-muted-foreground">{shops[0].description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Rating: {shops[0].rating} ⭐ • {shops[0].productCount} products
                      </p>
                    </div>
                    <Button onClick={() => navigate(`/shop/${shops[0].id}`)}>
                      View Shop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Orders</CardTitle>
                  <Button onClick={() => navigate('/dashboard/orders')}>
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            {/* This tab just navigates to the products page */}
          </TabsContent>

          <TabsContent value="payouts">
            {/* This tab just navigates to the payouts page */}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
