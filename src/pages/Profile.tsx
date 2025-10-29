import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User, CreditCard, Bell } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleBankUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bank details updated",
      description: "Your bank information has been saved securely.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Tabs defaultValue="profile" className="max-w-2xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="bank">
              <CreditCard className="h-4 w-4 mr-2" />
              Bank Details
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({ ...profileData, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card className="p-6">
              <form onSubmit={handleBankUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g. GTBank"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, bankName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={bankDetails.accountName}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, accountName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Save Bank Details</Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about order status
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Message Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive messages
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates
                    </p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
