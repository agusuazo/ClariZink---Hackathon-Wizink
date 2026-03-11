import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { callCoachFinanciero } from "@/lib/api";
import { getUserContext } from "@/lib/userData";
import MarkdownResponse from '@/components/MarkdownResponse';

const Coach = () => {
  const { userType, chatHistory, addChatMessage } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const welcomeSent = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (welcomeSent.current || chatHistory.length > 0) return;
    welcomeSent.current = true;
    const userCtx = getUserContext();
    const welcomeMsg = userType === 'client'
      ? `¡Hola! Soy Clari, tu Coach Financiero. ${userCtx.personalizedGreeting}. Basado en tu perfil ${userCtx.tier}, puedo ayudarte con productos especializados.`
      : `¡Hola! Soy Clari, tu Coach Financiero. ${userCtx.personalizedGreeting}, estoy aquí para ayudarte con opciones de crédito personalizadas para tu perfil ${userCtx.tier}.`;
    addChatMessage('assistant', welcomeMsg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    addChatMessage('user', message);
    const userMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      const userCtx = getUserContext();
      const contextualMessage = `Usuario: ${userCtx.personalizedGreeting}, Nivel de riesgo: ${userCtx.riskLevel}. Pregunta: ${userMessage}`;
      
      const res = await callCoachFinanciero(contextualMessage);
      addChatMessage('assistant', res.reply);

    } catch (err) {
      console.error(err);
      addChatMessage(
        'assistant',
        "He tenido un problema para procesar tu pregunta. Intenta nuevamente en unos segundos."
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  const userCtx = getUserContext();
  const suggestions = [
    'Mi Ruta de Aprobación',
    `Productos para perfil ${userCtx.tier}`,
    'Simular Cambios',
    userCtx.recommendations[0] || 'Duda General',
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-header-green py-6 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-header-green-foreground">
            <ArrowLeft className="mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-header-green-foreground flex items-center gap-2">
              <Sparkles />
              ClariZink, tu Coach Financiero Personal
            </h1>
            <p className="text-header-green-foreground/80">Asistente inteligente personalizado</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Card className="flex flex-col h-[calc(100vh-250px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent/10 text-foreground border border-accent/20'
                    }`}
                >
                  <div className="leading-relaxed">
                    <MarkdownResponse
                      content={msg.content}
                      boldClass="font-semibold mt-2 mb-1"
                      normalClass="mb-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-accent/10 text-foreground border border-accent/20 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sugg, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(sugg)}
                  className="text-xs"
                >
                  {sugg}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!message.trim()} className="bg-accent hover:bg-accent/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Coach;
