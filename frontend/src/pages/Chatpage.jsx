import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/Navbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Footer from "@/components/Footer"
import {
  Send,
  Bot,
  User,
  FileText,
  Brain,
  History,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatPage() {

  const [selectedFile, setSelectedFile] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! I'm your AI study companion. How can I help you learn today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [chatSessions, setChatSessions] = useState([
    {
      id: "1",
      title: "Math Help Session",
      lastMessage: "How do I solve quadratic equations?",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "Physics Discussion",
      lastMessage: "Explain Newton's laws",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Chemistry Questions",
      lastMessage: "What is molecular bonding?",
      timestamp: new Date(Date.now() - 259200000),
    },
  ])

  const [currentSessionId, setCurrentSessionId] = useState("current")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = () => {
    const responses = [
      "That's a great question! Let me break this down for you step by step...",
      "I can help you understand this concept better. Here's what you need to know...",
      "This is a common topic that many students find challenging. Let me explain...",
      "Based on your question, I think you're looking for information about...",
      "Let me provide you with a comprehensive explanation and some examples...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
  // ----------------------------
  // CASE 1: FILE UPLOADED
  // ----------------------------
  if (selectedFile) {
    const fileMessage = {
      id: Date.now().toString(),
      content: `📄 Uploaded: ${selectedFile.name}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, fileMessage]);
    setIsTyping(true);

    try {
      const formData = new FormData();
formData.append("file", selectedFile);

const res = await fetch("http://localhost:8000/api/chat/upload", {
  method: "POST",
  body: formData,
});

      const data = await res.json();

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "❌ Failed to process the document.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }

    setSelectedFile(null);
    setIsTyping(false);
    return;
  }

  // ----------------------------
  // CASE 2: TEXT MESSAGE
  // ----------------------------
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    content: inputValue,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    const res = await fetch("http://localhost:8000/api/chat/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMessage.content }),
    });

    const data = await res.json();

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: data.text,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        content: "❌ Sorry, I couldn't generate a response.",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI study companion. How can I help you learn today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
    setCurrentSessionId("new-" + Date.now())
  }

  const handleDocumentSummarize = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content:
          "I can help you summarize documents! Please upload a PDF or text file.",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }

  const handleTakeQuiz = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content:
          "What subject would you like a quiz on? Math, Science, History, etc.",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <>
    <Navbar />
  <SidebarProvider>
    <SidebarInset>
      <div className="min-h-screen bg-white">
        <div className="flex h-[calc(100vh-4rem)]">
          
          {/* Sidebar */}
          <div className="w-80 border-r bg-muted/30">
            <div className="p-4">
              <Button onClick={handleNewChat} className="w-full mb-4 rounded-sm border-black shadow-2xl">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>

              <div className="space-y-2 mb-6">
                <Button
                  variant="outline"
                  onClick={handleDocumentSummarize}
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Document Summarize
                </Button>

                <Button
                  variant="outline"
                  onClick={handleTakeQuiz}
                  className="w-full justify-start"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Take a Quiz
                </Button>
              </div>

              <Separator className="mb-4" />

              <h3 className="text-sm font-medium flex items-center mb-2">
                <History className="w-4 h-4 mr-2" />
                Chat History
              </h3>

              <ScrollArea className="h-[400px]">
                {chatSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    className="p-3 rounded-lg hover:bg-muted cursor-pointer mb-2"
                    onClick={() => setCurrentSessionId(session.id)}
                  >
                    <div className="text-sm font-medium truncate">
                      {session.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {session.lastMessage}
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      msg.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <p className="text-sm text-muted-foreground">
                  AI is typing...
                </p>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>

<div className="border-t p-4 flex gap-2 items-center">

  {/* FILE UPLOAD */}
  <label className="cursor-pointer">
    <Upload className="w-6 h-6 text-gray-600 hover:text-black" />
  <input
  type="file"
  className="hidden"
  onChange={(e) => setSelectedFile(e.target.files[0])}
  accept=".pdf,.docx,.pptx"
/>

  </label>

  <Input
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    placeholder="Ask me anything..."
    onKeyDown={(e) =>
      e.key === "Enter" && handleSendMessage()
    }
  />

  <Button onClick={handleSendMessage} disabled={isTyping}>
    <Send className="w-4 h-4" />
  </Button>
</div>

          </div>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
  <Footer></Footer>
  </>
)
}
