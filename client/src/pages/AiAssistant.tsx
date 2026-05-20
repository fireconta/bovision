import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Streamdown } from 'streamdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const mockResponses = [
  'Para melhorar o ganho de peso do rebanho, recomendo aumentar a ingestão de proteína em 15-20% e garantir acesso constante a água fresca.',
  'A vacinação contra brucelose deve ser realizada em bezerras de 3-8 meses. Consulte seu veterinário para o calendário completo.',
  'O confinamento ideal para gado de corte é de 8-10 m² por animal. Certifique-se de boa ventilação e drenagem.',
  'Para detectar mastite precocemente, inspecione os tetos diariamente e monitore a produção de leite. Qualquer alteração requer atenção veterinária.',
];

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o **BOVISION AI Assistant**, seu especialista em gestão pecuária. Posso ajudar com:\n\n- 📊 Análise de dados do rebanho\n- 💊 Recomendações de saúde e vacinação\n- 🍽️ Otimização de alimentação\n- 📈 Previsões de produtividade\n- 🏥 Diagnósticos de doenças comuns\n\nComo posso ajudá-lo hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response with typing animation
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, response]);
      setLoading(false);

      // Remove typing animation after 2 seconds
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === response.id ? { ...msg, isTyping: false } : msg))
        );
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">BOVISION AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Especialista em gestão pecuária</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl ${
                      message.role === 'user'
                        ? 'bg-accent/20 border border-accent rounded-2xl rounded-tr-none'
                        : 'bg-card border border-border rounded-2xl rounded-tl-none'
                    } p-4`}
                  >
                    {message.role === 'assistant' ? (
                      <Streamdown>{message.content}</Streamdown>
                    ) : (
                      <p className="text-foreground">{message.content}</p>
                    )}

                    {message.isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-1 mt-2"
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                            className="w-2 h-2 bg-accent rounded-full"
                          />
                        ))}
                      </motion.div>
                    )}

                    {message.role === 'assistant' && !message.isTyping && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                        <button className="p-1 hover:bg-accent/10 rounded transition">
                          <Copy className="w-4 h-4 text-muted-foreground hover:text-accent" />
                        </button>
                        <button className="p-1 hover:bg-accent/10 rounded transition">
                          <ThumbsUp className="w-4 h-4 text-muted-foreground hover:text-accent" />
                        </button>
                        <button className="p-1 hover:bg-accent/10 rounded transition">
                          <ThumbsDown className="w-4 h-4 text-muted-foreground hover:text-accent" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 flex gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">Pensando...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur sticky bottom-0">
        <div className="container py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <Input
                placeholder="Faça uma pergunta sobre o seu rebanho..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-background border-border focus:border-accent"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'Como melhorar ganho de peso?',
                'Calendário de vacinação',
                'Sinais de doença',
                'Alimentação ideal',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="text-xs px-3 py-1 rounded-full border border-accent/30 text-accent hover:bg-accent/10 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
