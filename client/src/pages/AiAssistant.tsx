import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const AiAssistant = () => {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o Assistente IA Agro da BOVISION. Como posso ajudá-lo com manejo, alimentação, vacinação ou produtividade do seu rebanho?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Entendi sua pergunta. Baseado nos dados do seu rebanho, recomendo... (resposta IA)',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur border-b border-accent/20 px-4 sm:px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">
              <span className="text-accent">Assistente</span>
              <span className="text-cyan-400"> IA Agro</span>
            </h1>
            <p className="text-xs text-gray-400">Especializado em manejo pecuário</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message, i) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-accent/20 border border-accent/40 text-white'
                  : 'bg-cyan-400/10 border border-cyan-400/40 text-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-cyan-400/10 border border-cyan-400/40 px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="bg-black/80 backdrop-blur border-t border-accent/20 p-4 sm:p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Faça uma pergunta sobre seu rebanho..."
            className="flex-1 bg-black/50 border border-accent/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-accent/60 focus:outline-none transition"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-accent to-cyan-400 text-black rounded-lg hover:shadow-lg hover:shadow-accent/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
