import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { UserCheck, UserPlus } from 'lucide-react';
import { getUserContext } from '@/lib/userData';

const UserTypeSelector = () => {
  const { setUserType, setUserData } = useAppContext();

  const handleClientSelect = () => {
    setUserType('client');
    const userCtx = getUserContext();
    setUserData({
      ingresos: userCtx.income,
      empleo: userCtx.occupation,
      deuda: Math.round(userCtx.income * 0.1),
      retrasos: 0,
      importe: userCtx.creditAmount,
    });
  };

  const handleVisitorSelect = () => {
    setUserType('visitor');
    setUserData(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <Card
        className="p-8 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-border hover:border-primary"
        onClick={handleClientSelect}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Soy Cliente</h3>
            <p className="text-muted-foreground">
              Accede con tus datos guardados y obtén recomendaciones personalizadas instantáneas
            </p>
          </div>
          <Button className="w-full" size="lg">
            Continuar como Cliente
          </Button>
        </div>
      </Card>

      <Card
        className="p-8 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-border hover:border-secondary"
        onClick={handleVisitorSelect}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
            <UserPlus className="w-10 h-10 text-secondary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Soy Visitante</h3>
            <p className="text-muted-foreground">
              Ingresa tus datos manualmente para descubrir tus opciones de crédito disponibles
            </p>
          </div>
          <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
            Continuar como Visitante
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserTypeSelector;
