import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { Send, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { getUserThreads, getThreadMessages, sendMessage, markAsRead, getThreadById } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      // Find thread for this order and select it
      const threads = getUserThreads();
      const thread = threads.find(t => t.productId); // Simplified
      if (thread) {
        setSelectedThreadId(thread.id);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedThreadId) {
      markAsRead(selectedThreadId);
      scrollToBottom();
    }
  }, [selectedThreadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const threads = getUserThreads();
  const selectedThread = selectedThreadId ? getThreadById(selectedThreadId) : null;
  const messages = selectedThreadId ? getThreadMessages(selectedThreadId) : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;

    const receiverId = selectedThread.participants.find(p => p !== user!.id);
    if (!receiverId) return;

    sendMessage(selectedThread.id, receiverId, messageText, selectedThread.productId);
    setMessageText("");
    setTimeout(scrollToBottom, 100);
  };

  const getOtherParticipantName = (thread: any) => {
    const otherUserId = thread.participants.find((p: string) => p !== user!.id);
    return otherUserId === 'seller1' ? 'Tech Haven' :
           otherUserId === 'seller2' ? 'Campus Books' :
           otherUserId === 'buyer1' ? 'Student User' : 'User';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Thread List */}
          <Card className="p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4">Conversations</h2>
            {threads.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${
                      selectedThreadId === thread.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getOtherParticipantName(thread)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {getOtherParticipantName(thread)}
                        </p>
                        {thread.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {thread.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {thread.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                          {thread.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getOtherParticipantName(selectedThread)[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{getOtherParticipantName(selectedThread)}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === user!.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
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
