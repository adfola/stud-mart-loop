import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { useOrders } from "@/contexts/OrderContext";
import { Send, MessageSquare, Image as ImageIcon, CheckCircle2, Clock, Info, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { formatNGN } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { getUserThreads, getThreadMessages, sendMessage, markAsRead, getThreadById } = useMessages();
  const { orders } = useOrders();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const threadId = searchParams.get('threadId');
    const orderId = searchParams.get('orderId');
    
    if (threadId) {
      setSelectedThreadId(threadId);
    } else if (orderId) {
      const threads = getUserThreads();
      const thread = threads.find(t => t.productId);
      if (thread) {
        setSelectedThreadId(thread.id);
      }
    }
  }, [searchParams, getUserThreads]);

  useEffect(() => {
    if (selectedThreadId) {
      markAsRead(selectedThreadId);
      scrollToBottom();
    }
  }, [selectedThreadId, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const threads = getUserThreads();
  const selectedThread = selectedThreadId ? getThreadById(selectedThreadId) : null;
  const messages = selectedThreadId ? getThreadMessages(selectedThreadId) : [];
  
  // Get related order if exists
  const relatedOrder = selectedThread?.productId 
    ? orders.find(o => o.items.some(item => item.id === selectedThread.productId))
    : null;

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;

    const receiverId = selectedThread.participants.find(p => p !== user!.id);
    if (!receiverId) return;

    sendMessage(selectedThread.id, receiverId, messageText, selectedThread.productId);
    setMessageText("");
    setTimeout(scrollToBottom, 100);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getOtherParticipant = (thread: any) => {
    const otherUserId = thread.participants.find((p: string) => p !== user!.id);
    // Mock user data lookup
    const users: Record<string, { name: string; username: string }> = {
      'seller1': { name: 'Tech Haven', username: 'techhaven' },
      'seller2': { name: 'Campus Books', username: 'campusbooks' },
      'seller3': { name: 'Style Hub', username: 'stylehub' },
      'seller4': { name: 'Fit Life', username: 'fitlife' },
      'buyer1': { name: 'John Doe', username: 'johndoe' },
    };
    return users[otherUserId || ''] || { name: 'User', username: 'user' };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Chat with buyers and sellers</p>
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-280px)]">
          {/* Thread List */}
          <Card className="flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Conversations</h2>
            </div>
            <ScrollArea className="flex-1">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MessageSquare className="w-16 h-16 mb-4 text-muted-foreground" />
                  <p className="font-medium mb-1">No conversations yet</p>
                  <p className="text-sm text-muted-foreground">Start chatting with sellers or buyers</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all hover:bg-muted/50 ${
                        selectedThreadId === thread.id ? 'bg-muted shadow-sm' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-1">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getOtherParticipant(thread).name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex flex-col">
                              <p className="font-medium truncate">
                                {getOtherParticipant(thread).name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{getOtherParticipant(thread).username}
                              </p>
                            </div>
                            {thread.lastMessage && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {formatDistanceToNow(new Date(thread.lastMessage.timestamp), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          {thread.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {thread.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {thread.unreadCount > 0 && (
                          <Badge className="ml-auto">{thread.unreadCount}</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="flex flex-col">
            {selectedThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getOtherParticipant(selectedThread).name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{getOtherParticipant(selectedThread).name}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-sm text-muted-foreground">@{getOtherParticipant(selectedThread).username}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info Banner (if order exists) */}
                {relatedOrder && (
                  <div className="p-4 bg-primary/5 border-b">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">Order #{relatedOrder.id}</p>
                          <Badge variant={
                            relatedOrder.status === 'delivered' ? 'default' :
                            relatedOrder.status === 'confirmed' ? 'secondary' : 'outline'
                          }>
                            {relatedOrder.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Total Amount: <span className="font-semibold text-foreground">{formatNGN(relatedOrder.totalAmount)}</span>
                        </p>
                        
                        {/* Bank Details */}
                        {user?.role === 'buyer' && relatedOrder.status === 'pending' && (
                          <div className="bg-background rounded-lg p-4 space-y-3 border">
                            <p className="font-medium text-sm mb-2">Transfer to seller's account:</p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div>
                                  <p className="text-xs text-muted-foreground">Bank Name</p>
                                  <p className="font-mono font-medium">First Bank Nigeria</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleCopy('First Bank Nigeria', 'Bank name')}
                                >
                                  {copiedField === 'Bank name' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div>
                                  <p className="text-xs text-muted-foreground">Account Name</p>
                                  <p className="font-mono font-medium">Tech Haven Store</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleCopy('Tech Haven Store', 'Account name')}
                                >
                                  {copiedField === 'Account name' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div>
                                  <p className="text-xs text-muted-foreground">Account Number</p>
                                  <p className="font-mono font-medium text-lg">3084562911</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleCopy('3084562911', 'Account number')}
                                >
                                  {copiedField === 'Account number' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2 pt-2">
                              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <p className="text-xs text-muted-foreground">
                                After making payment, send a screenshot here for confirmation
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user!.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className={isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                                {isOwn ? user.name[0] : getOtherParticipant(selectedThread).name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-2xl px-4 py-3 shadow-sm ${
                                isOwn
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                  : 'bg-muted rounded-tl-sm'
                              }`}
                            >
                              {!isOwn && (
                                <p className="text-xs opacity-70 mb-1">
                                  @{getOtherParticipant(selectedThread).username}
                                </p>
                              )}
                              <p className="break-words">{message.content}</p>
                              <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <p className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                </p>
                                {isOwn && message.read && (
                                  <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex gap-2 items-end">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        className="resize-none bg-background"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">No Conversation Selected</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
