import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Heart, 
  Pill, 
  Activity,
  Brain,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GrampsAIProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const quickQuestions = [
  "What's a healthy heart rate for elderly?",
  "Blood pressure guidelines",
  "When to call emergency?",
  "Medication reminders tips",
];

export const GrampsAI = ({ isOpen, onClose, isExpanded, onToggleExpand }: GrampsAIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm GrampsAI, your dedicated elderly care assistant. I can help with health questions, medication guidance, emergency protocols, and daily care tips. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulated AI responses based on keywords
    setTimeout(() => {
      let response = "";
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("heart rate") || lowerMessage.includes("pulse")) {
        response = "For elderly individuals, a normal resting heart rate is typically between 60-100 bpm. However, many medications can affect this. If the heart rate is consistently above 100 bpm (tachycardia) or below 60 bpm (bradycardia), consult a healthcare provider. Watch for symptoms like dizziness, shortness of breath, or chest pain.";
      } else if (lowerMessage.includes("blood pressure")) {
        response = "For elderly adults, blood pressure guidelines suggest: Normal: less than 120/80 mmHg, Elevated: 120-129/less than 80, High (Stage 1): 130-139/80-89, High (Stage 2): 140+/90+. Monitor regularly and report consistent readings above 140/90 to your healthcare provider.";
      } else if (lowerMessage.includes("emergency") || lowerMessage.includes("call")) {
        response = "Call emergency services (911) immediately if you observe: chest pain, difficulty breathing, sudden confusion, severe headache, loss of consciousness, signs of stroke (FAST - Face drooping, Arm weakness, Speech difficulty, Time to call), or any fall resulting in head injury or inability to get up.";
      } else if (lowerMessage.includes("medication") || lowerMessage.includes("medicine")) {
        response = "Medication management tips for elderly care: 1) Use pill organizers, 2) Set consistent daily times, 3) Keep an updated medication list, 4) Never skip doses without doctor consultation, 5) Watch for side effects, 6) Store medications properly. Our system tracks medication adherence automatically.";
      } else if (lowerMessage.includes("fall") || lowerMessage.includes("falling")) {
        response = "Fall prevention is critical for elderly safety. Our camera system monitors posture and can detect falls in real-time. If a fall is detected, WhatsApp alerts are sent immediately. Tips: ensure good lighting, remove trip hazards, install grab bars, encourage proper footwear, and regular exercise for balance.";
      } else {
        response = "Thank you for your question. I'm here to help with elderly care concerns including health monitoring, medication management, emergency protocols, and daily care tips. Could you provide more details about what specific guidance you need?";
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    simulateResponse(input);
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    simulateResponse(question);
  };

  if (!isOpen) return null;

  return (
    <Card className={cn(
      "fixed z-50 border border-border shadow-2xl bg-background transition-all duration-300",
      isExpanded 
        ? "inset-4 rounded-2xl" 
        : "bottom-4 right-4 w-96 h-[32rem] rounded-2xl"
    )}>
      {/* Header */}
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-foreground rounded-lg">
              <Bot className="w-5 h-5 text-background" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                GrampsAI
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
              <p className="text-xs text-muted-foreground">Elderly Health Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onToggleExpand && (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onToggleExpand}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex gap-3",
                message.role === "user" && "justify-end"
              )}>
                {message.role === "assistant" && (
                  <div className="p-1.5 h-fit bg-muted rounded-lg">
                    <Brain className="w-4 h-4" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5",
                  message.role === "user" 
                    ? "bg-foreground text-background" 
                    : "bg-muted"
                )}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={cn(
                    "text-[10px] mt-1",
                    message.role === "user" ? "text-background/60" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="p-1.5 h-fit bg-muted rounded-lg">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <Badge 
                  key={i}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-muted text-xs"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input 
              placeholder="Ask about elderly care..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="rounded-full bg-muted border-0"
            />
            <Button size="icon" className="rounded-full shrink-0" onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
