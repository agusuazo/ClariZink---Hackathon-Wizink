import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreditPathAdvisor = () => {
  const { userData, creditPath, setCreditPath } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateCreditPath = async () => {
    if (!userData) {
      toast({ title: 'Error', description: 'Por favor ingresa tus datos primero', variant: 'destructive' });
      return;
    }

    setLoading(true);
    // Mock API call - en producción esto llamaría a /credit_path
    setTimeout(() => {
      setCreditPath({
        explanation: `Basado en tus ingresos de ${userData.ingresos.toLocaleString()}€ y una deuda de ${userData.deuda.toLocaleString()}€, tu probabilidad actual de aprobación es del 68%. Si reduces tu deuda en un 30% y mantienes un historial de pagos limpio, tu probabilidad aumentaría al 89%. Los factores que más limitan tu aprobación son: ratio deuda/ingresos y antigüedad laboral.`,
        currentProbability: 68,
        improvedProbability: 89,
        limitingFactors: [
          { factor: 'Ratio Deuda/Ingresos', impact: 35 },
          { factor: 'Antigüedad Laboral', impact: 25 },
          { factor: 'Historial de Pagos', impact: 20 },
          { factor: 'Importe Solicitado', impact: 15 },
          { factor: 'Otros Factores', impact: 5 },
        ],
      });
      setLoading(false);
      toast({ title: 'Ruta generada', description: 'Tu análisis está listo' });
    }, 1500);
  };

  const probabilityData = creditPath
    ? [
        { name: 'Actual', value: creditPath.currentProbability },
        { name: 'Mejorada', value: creditPath.improvedProbability },
      ]
    : [];

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Módulo 1: Credit Path Advisor</h2>
        <p className="text-muted-foreground">
          Descubre tu ruta personalizada hacia la aprobación crediticia
        </p>
      </div>

      <Button
        onClick={generateCreditPath}
        disabled={loading || !userData}
        size="lg"
        className="w-full md:w-auto mb-6"
      >
        {loading ? 'Generando...' : 'Generar mi Ruta de Aprobación'}
      </Button>

      {creditPath && (
        <div className="space-y-6">
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Gauge className="text-accent" />
              Tu Análisis Personalizado
            </h3>
            <p className="text-foreground leading-relaxed">{creditPath.explanation}</p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Probabilidad de Aprobación</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={probabilityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {probabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--accent))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Factores Limitantes</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={creditPath.limitingFactors} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" domain={[0, 40]} />
                  <YAxis dataKey="factor" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="impact" fill="hsl(var(--violet))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Probabilidad Actual</p>
              <p className="text-5xl font-bold text-secondary">{creditPath.currentProbability}%</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Probabilidad Mejorada</p>
              <p className="text-5xl font-bold text-accent">{creditPath.improvedProbability}%</p>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CreditPathAdvisor;
