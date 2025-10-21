import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Message, ChatThread } from "@/types";
import { mockMessages, mockChatThreads } from "@/data/enhancedMockData";
import { useAuth } from "./AuthContext";
import { playNotificationSound, showNotification } from "@/utils/notifications";

interface MessageContextType {
  messages: Message[];
  threads: ChatThread[];
  sendMessage: (threadId: string, receiverId: string, content: string, productId?: string, image?: string) => void;
  createThread: (participantId: string, productId?: string) => ChatThread;
  getThreadMessages: (threadId: string) => Message[];
  getThreadById: (threadId: string) => ChatThread | undefined;
  getUserThreads: () => ChatThread[];
  markAsRead: (threadId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : mockMessages;
  });

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem("threads");
    return saved ? JSON.parse(saved) : mockChatThreads;
  });

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("threads", JSON.stringify(threads));
  }, [threads]);

  const sendMessage = (threadId: string, receiverId: string, content: string, productId?: string, image?: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      threadId,
      senderId: user.id,
      receiverId,
      content,
      productId,
      image,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);

    // Update thread
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, lastMessage: newMessage, unreadCount: thread.unreadCount + 1 }
        : thread
    ));

    // Simulate notification for receiver (in real app this would be server-side)
    setTimeout(() => {
      if (user.role === 'buyer') {
        playNotificationSound();
        showNotification('New message', { body: content });
      }
    }, 1000);
  };

  const createThread = (participantId: string, productId?: string): ChatThread => {
    if (!user) throw new Error("Must be logged in");

    const existingThread = threads.find(t => 
      t.participants.includes(user.id) && t.participants.includes(participantId) && t.productId === productId
    );

    if (existingThread) return existingThread;

    const newThread: ChatThread = {
      id: `thread_${Date.now()}`,
      participants: [user.id, participantId],
      productId,
      unreadCount: 0
    };

    setThreads(prev => [...prev, newThread]);
    return newThread;
  };

  const getThreadMessages = (threadId: string) => {
    return messages.filter(m => m.threadId === threadId);
  };

  const getThreadById = (threadId: string) => {
    return threads.find(t => t.id === threadId);
  };

  const getUserThreads = () => {
    if (!user) return [];
    return threads.filter(t => t.participants.includes(user.id));
  };

  const markAsRead = (threadId: string) => {
    if (!user) return;
    
    setMessages(prev => prev.map(msg => 
      msg.threadId === threadId && msg.receiverId === user.id
        ? { ...msg, read: true }
        : msg
    ));

    setThreads(prev => prev.map(thread => 
      thread.id === threadId
        ? { ...thread, unreadCount: 0 }
        : thread
    ));
  };

  return (
    <MessageContext.Provider value={{
      messages,
      threads,
      sendMessage,
      createThread,
      getThreadMessages,
      getThreadById,
      getUserThreads,
      markAsRead
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within MessageProvider");
  }
  return context;
}
