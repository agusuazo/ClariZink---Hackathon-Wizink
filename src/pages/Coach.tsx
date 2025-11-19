import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

const Coach = () => {
  const { userType, chatHistory, addChatMessage } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Welcome message
    if (chatHistory.length === 0) {
      const welcomeMsg =
        userType === 'client'
          ? '¡Hola! Soy tu Coach Financiero. Veo que ya eres cliente. ¿En qué puedo ayudarte hoy? Puedo ayudarte con tu ruta de aprobación, productos recomendados, simulaciones o cualquier duda sobre créditos.'
          : '¡Hola! Soy tu Coach Financiero. Estoy aquí para ayudarte a entender mejor tus opciones de crédito. ¿Qué te gustaría saber?';
      addChatMessage('assistant', welcomeMsg);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    addChatMessage('user', message);
    setMessage('');
    setIsTyping(true);

    // Mock AI response - en producción esto llamaría a un endpoint de IA
    setTimeout(() => {
      const responses = [
        'Basado en tu perfil, te recomendaría enfocarte en reducir tu ratio deuda/ingresos. Esto podría aumentar tu probabilidad de aprobación hasta un 15%.',
        'Excelente pregunta. Con tus ingresos actuales, podrías calificar para préstamos de hasta 25,000€ con condiciones favorables.',
        'Te sugiero considerar el Préstamo Personal Plus. Tiene una tasa competitiva y tu probabilidad de aprobación es del 89%.',
        'Si reduces tu deuda en 6 meses, tu puntuación crediticia podría mejorar significativamente. ¿Quieres que simule este escenario?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addChatMessage('assistant', randomResponse);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  const suggestions = [
    'Mi Ruta de Aprobación',
    'Productos Recomendados',
    'Simular Cambios',
    'Duda General',
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
              Coach Financiero
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
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent/10 text-foreground border border-accent/20'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
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
                onKeyPress={e => e.key === 'Enter' && handleSend()}
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
