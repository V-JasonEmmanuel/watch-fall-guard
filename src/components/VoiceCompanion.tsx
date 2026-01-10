import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Send, 
  Sparkles, 
  Heart,
  X,
  Maximize2,
  Minimize2,
  Phone,
  Smile,
  Sun,
  Moon,
  Pill,
  Droplets,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

interface VoiceCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  elderName?: string;
}

const quickActions = [
  { label: "How are you feeling?", icon: Smile, type: "check-in" },
  { label: "Medication reminder", icon: Pill, type: "health" },
  { label: "Drink water", icon: Droplets, type: "reminder" },
  { label: "Call family", icon: Phone, type: "emotional" },
];

const greetings = [
  "Hello dear! I'm so happy to chat with you today. How are you feeling?",
  "Good to see you! What would you like to talk about?",
  "Hello! I'm here for you. How can I help you today?",
];

export const VoiceCompanion = ({ 
  isOpen, 
  onClose, 
  isExpanded, 
  onToggleExpand,
  elderName = "Friend"
}: VoiceCompanionProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: greetings[Math.floor(Math.random() * greetings.length)],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send after voice input
        setTimeout(() => handleSend(transcript), 500);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice not heard",
          description: "Please try speaking again or type your message.",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice not available",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = async (text: string, messageId: string) => {
    if (isMuted) return;

    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setIsSpeaking(true);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isPlaying: true } : { ...m, isPlaying: false }
      ));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gramps-ai-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voice: 'nova' }), // Nova is a warm, friendly voice
        }
      );

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);

      audio.onended = () => {
        setIsSpeaking(false);
        setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('gramps-ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          conversationType: 'general',
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak the response
      if (!isMuted) {
        setTimeout(() => speakText(data.message, assistantMessage.id), 300);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I had a little trouble there. Could you please try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSend(action.label);
  };

  if (!isOpen) return null;

  return (
    <Card className={cn(
      "fixed z-50 border-2 border-primary/20 shadow-2xl bg-card transition-all duration-300 overflow-hidden",
      isExpanded 
        ? "inset-4 rounded-3xl" 
        : "bottom-4 right-4 w-[420px] h-[600px] rounded-3xl"
    )}>
      {/* Header */}
      <CardHeader className="pb-4 border-b border-border bg-gradient-to-r from-primary/5 to-info/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20 bg-gradient-calm">
              <AvatarFallback className="bg-gradient-to-br from-primary to-info text-white text-xl">
                <Heart className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl flex items-center gap-2 font-display">
                GrampsAI
                <Sparkles className="w-5 h-5 text-warning animate-pulse-gentle" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">Your caring companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-10 w-10 rounded-full",
                isSpeaking && "bg-primary/10"
              )}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            {onToggleExpand && (
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={onToggleExpand}>
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-2 mt-3">
          {isSpeaking && (
            <Badge className="bg-primary/10 text-primary border-primary/30 gap-1.5">
              <div className="flex items-center gap-0.5">
                <div className="w-1 h-2 bg-primary rounded-full voice-wave" />
                <div className="w-1 h-3 bg-primary rounded-full voice-wave-delayed" />
                <div className="w-1 h-2 bg-primary rounded-full voice-wave" />
              </div>
              Speaking...
            </Badge>
          )}
          {isListening && (
            <Badge className="bg-safe/10 text-safe border-safe/30 gap-1.5 animate-pulse">
              <Mic className="w-3 h-3" />
              Listening...
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex gap-3",
                message.role === "user" && "justify-end"
              )}>
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 border border-border shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-info text-white text-sm">
                      <Heart className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-md" 
                    : "bg-muted rounded-bl-md"
                )}>
                  <p className="text-elder-base leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={cn(
                      "text-xs",
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0 rounded-full",
                          message.isPlaying && "bg-primary/10"
                        )}
                        onClick={() => speakText(message.content, message.id)}
                      >
                        <Volume2 className={cn(
                          "w-4 h-4",
                          message.isPlaying && "text-primary animate-pulse"
                        )} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-info text-white text-sm">
                    <Heart className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3 border-t border-border pt-3 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2 font-medium">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 h-9 text-sm"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 items-center">
            <Button
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={cn(
                "rounded-full shrink-0 h-12 w-12",
                isListening && "bg-safe animate-pulse"
              )}
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Input 
              placeholder="Type or tap the mic to speak..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="rounded-full bg-muted border-0 h-12 text-elder-base px-5"
            />
            <Button 
              size="icon" 
              className="rounded-full shrink-0 h-12 w-12" 
              onClick={() => handleSend()} 
              disabled={!input.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
