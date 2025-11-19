import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Sparkles } from 'lucide-react';

const CoachFinancieroCTA = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-12 text-center bg-gradient-to-br from-accent/10 via-violet/10 to-secondary/10 border-2 border-accent/30">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-accent" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
            <Sparkles className="text-accent" />
            Coach Financiero con IA
          </h2>
          <p className="text-lg text-muted-foreground">
            Conversa con nuestro asistente inteligente para obtener recomendaciones personalizadas,
            resolver dudas y optimizar tu estrategia crediticia
          </p>
        </div>

        <Button
          size="lg"
          className="text-lg px-8 py-6 bg-accent hover:bg-accent/90"
          onClick={() => navigate('/coach')}
        >
          <MessageCircle className="mr-2" />
          Conversar con el Coach Financiero
        </Button>
      </div>
    </Card>
  );
};

export default CoachFinancieroCTA;
