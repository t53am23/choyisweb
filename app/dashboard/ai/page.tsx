"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Send, ChevronDown, Copy, RefreshCw, User, Bot, Coins } from "lucide-react"

const aiModels = [
  { id: "auto", name: "Auto Mode", description: "Automatically selects the best model" },
  { id: "gpt4", name: "GPT-4", description: "Best for complex tasks" },
  { id: "claude", name: "Claude 3", description: "Best for writing and analysis" },
  { id: "gemini", name: "Gemini Pro", description: "Best for general tasks" },
  { id: "llama", name: "Llama 3", description: "Fast and efficient" },
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  model?: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI assistant. I can help you with writing, coding, research, study prep, and more. What would you like to work on today?",
    model: "Auto Mode",
    timestamp: new Date(),
  },
]

export default function AIPage() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const [selectedModel, setSelectedModel] = React.useState(aiModels[0])
  const [showModelDropdown, setShowModelDropdown] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [credits] = React.useState(2450)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateDemoResponse(input),
        model: selectedModel.name,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateDemoResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    if (lowerInput.includes("email") || lowerInput.includes("write")) {
      return `Here's a professional email template for you:\n\nSubject: Meeting Request - Project Discussion\n\nDear [Recipient],\n\nI hope this message finds you well. I would like to schedule a meeting to discuss our upcoming project requirements.\n\nWould you be available for a 30-minute call this week? Please let me know your preferred time slots.\n\nBest regards,\n[Your Name]`
    }
    if (lowerInput.includes("code") || lowerInput.includes("function")) {
      return "```javascript\nfunction calculateTotal(items) {\n  return items.reduce((sum, item) => {\n    return sum + (item.price * item.quantity);\n  }, 0);\n}\n\n// Usage example\nconst cart = [\n  { name: 'Item 1', price: 10, quantity: 2 },\n  { name: 'Item 2', price: 15, quantity: 1 }\n];\n\nconsole.log(calculateTotal(cart)); // 35\n```"
    }
    return "I understand your request. Let me help you with that. Based on your input, here are some suggestions and insights that might be useful for your task. Feel free to ask follow-up questions or request more specific information!"
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">AI Chat</h1>
          <p className="text-muted-foreground">Access multiple AI models from one place</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 border border-teal-200">
            <Coins className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Credits: {credits.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-teal-500" />
                </div>
                AI Assistant
              </CardTitle>
              
              {/* Model Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
                >
                  <span className="font-medium">{selectedModel.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {showModelDropdown && (
                  <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg">
                    {aiModels.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model)
                          setShowModelDropdown(false)
                        }}
                        className="w-full flex flex-col items-start px-4 py-3 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-teal-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{message.model}</span>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-teal-600" />
                </div>
                <div className="bg-secondary rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-teal-500" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1 h-12"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-12 px-6 bg-teal-500 hover:bg-teal-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses may contain errors. Verify important information.
            </p>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="w-64 space-y-4 hidden lg:block">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Help me write a professional email",
                "Explain a coding concept",
                "Summarize this topic for study",
                "Draft a business proposal",
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left text-sm p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Writing & content creation</p>
              <p>• Code help & debugging</p>
              <p>• Research & summarization</p>
              <p>• Study prep & explanations</p>
              <p>• Business documents</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
