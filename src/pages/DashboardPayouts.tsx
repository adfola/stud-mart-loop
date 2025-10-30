import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatNGN } from "@/utils/currency";
import { Wallet, TrendingUp, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Payout {
  id: string;
  amount: number;
  status: "pending" | "completed";
  requestedAt: string;
}

export default function DashboardPayouts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSellerOrders } = useOrders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payouts, setPayouts] = useState<Payout[]>([]);

  if (!user || user.role !== "seller") {
    navigate("/login");
    return null;
  }

  const orders = getSellerOrders();
  const confirmedOrders = orders.filter((o) => o.status === "confirmed" || o.status === "delivered");
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingPayouts = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = totalRevenue - pendingPayouts;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(payoutAmount);
    if (amount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough available balance.",
        variant: "destructive",
      });
      return;
    }

    const newPayout: Payout = {
      id: `payout_${Date.now()}`,
      amount,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    setPayouts([newPayout, ...payouts]);
    toast({
      title: "Payout requested",
      description: "Your payout request has been submitted for processing.",
    });
    setIsDialogOpen(false);
    setPayoutAmount("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground mt-1">Manage your earnings and withdrawals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold">{formatNGN(availableBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">{formatNGN(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-3xl font-bold">{formatNGN(pendingPayouts)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payout History</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Request Payout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <Label>Available Balance</Label>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {formatNGN(availableBalance)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="amount">Payout Amount (NGN)</Label>
                  <Input
                    id="amount"
                    type="number"
                    required
                    max={availableBalance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Request Payout
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payout Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No payout history</p>
                <p className="text-sm text-muted-foreground">
                  Request your first payout to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{formatNGN(payout.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payout.requestedAt).toLocaleDateString()} at{' '}
                          {new Date(payout.requestedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={payout.status === "completed" ? "default" : "secondary"}
                      className={
                        payout.status === "completed"
                          ? "bg-green-500/10 text-green-600 border-green-200"
                          : "bg-orange-500/10 text-orange-600 border-orange-200"
                      }
                    >
                      {payout.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
