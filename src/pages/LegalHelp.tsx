import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, MessageSquarePlus, History, Trash2, Loader2 } from "lucide-react";
import MarkdownMessage from "@/components/MarkdownMessage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  createChat,
  getUserChats,
  getChatMessages,
  addMessage,
  deleteChat,
  type Chat,
  type Message as DBMessage,
} from "@/lib/database/chatOperations";
import { sendChatMessage } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LegalHelp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I'm your AI legal assistant. I can help you understand the Indian Constitution, explain legal procedures, and answer questions about your rights and duties. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scroll to bottom when messages change
  //useEffect(() => {
  //  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //}, [messages]);

  // Load chat history when user logs in
  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    const chats = await getUserChats();
    setChatHistory(chats);
  };

  const startNewChat = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to save your chat history.",
      });
      navigate("/auth/login");
      return;
    }

    const chat = await createChat("New Chat");
    if (chat) {
      setCurrentChatId(chat.id);
      setMessages([
        {
          role: "assistant",
          content:
            "Namaste! I'm your AI legal assistant. I can help you understand the Indian Constitution, explain legal procedures, and answer questions about your rights and duties. How can I assist you today?",
        },
      ]);
      loadChatHistory();
      toast({
        title: "New chat started",
        description: "Your conversation will be saved automatically.",
      });
    }
  };

  const loadChat = async (chatId: string) => {
    setLoading(true);
    const chatMessages = await getChatMessages(chatId);

    const formattedMessages: Message[] = chatMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    setMessages(formattedMessages);
    setCurrentChatId(chatId);
    setShowHistory(false);
    setLoading(false);
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await deleteChat(chatId);
    if (success) {
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed.",
      });
      loadChatHistory();
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([
          {
            role: "assistant",
            content:
              "Namaste! I'm your AI legal assistant. I can help you understand the Indian Constitution, explain legal procedures, and answer questions about your rights and duties. How can I assist you today?",
          },
        ]);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // If user is not logged in, warn them
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to save your chat history.",
      });
    }

    // If no current chat and user is logged in, create one
    if (!currentChatId && user) {
      const chat = await createChat(input.substring(0, 50) + "...");
      if (chat) {
        setCurrentChatId(chat.id);
        loadChatHistory();
      }
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database if logged in
    if (currentChatId) {
      await addMessage(currentChatId, "user", input);
    }

    setInput("");
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call AI backend
      const aiResponse = await sendChatMessage(input, history);

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database if logged in
      if (currentChatId) {
        await addMessage(currentChatId, "assistant", aiResponse);
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting to the AI service. Please make sure the backend server is running and try again. Error: " + (error as Error).message,
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get AI response. Check if backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedQueries = [
    "What are my fundamental rights?",
    "Explain Article 21 of the Constitution",
    "What are the fundamental duties of citizens?",
    "How does the amendment process work?",
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Legal Chatbot
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Ask questions about Indian law and get clear, reliable answers
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-4 flex-1">
            {/* Chat History Sidebar */}
            {user && (
              <div className="lg:col-span-1">
                <Card className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Chat History
                    </h3>
                    <Button size="sm" variant="ghost" onClick={startNewChat}>
                      <MessageSquarePlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {chatHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No chat history yet
                      </p>
                    ) : (
                      chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${currentChatId === chat.id ? "bg-muted" : ""
                            }`}
                          onClick={() => loadChat(chat.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium truncate flex-1">
                              {chat.title}
                            </p>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(chat.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Main Chat Area */}
            <div className={user ? "lg:col-span-3 flex flex-col" : "lg:col-span-4 flex flex-col"}>
              {/* Suggested Queries */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(query)}
                      className="text-xs"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <Card className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                          }`}
                      >
                        {message.role === "assistant" ? (
                          <MarkdownMessage content={message.content} />
                        ) : (
                          message.content
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="ml-3 bg-muted rounded-lg px-4 py-3 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-border">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your legal question here..."
                      className="resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button onClick={handleSend} size="icon" className="h-auto">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Log in to save your chat history
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LegalHelp;
