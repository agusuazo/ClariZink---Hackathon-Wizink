import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callCreditPath } from "@/lib/api";
import MarkdownResponse from '@/components/MarkdownResponse';

const CreditPathAdvisor = () => {
  const { userData, creditPath, setCreditPath } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateCreditPath = async () => {
    if (!userData) {
      toast({
        title: "Error",
        description: "Por favor ingresa tus datos primero",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await callCreditPath(userData);

      setCreditPath({
        explanation: res.narrative,
        currentProbability: res.prob_actual,
        improvedProbability: res.prob_mejorada,
        limitingFactors: res.limitations.map((l) => ({
          factor: l.factor,
          impact: l.impacto,
        })),
      });

      toast({
        title: "Ruta generada",
        description: "Tu análisis está listo",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo generar la ruta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

      {!creditPath && (
        <div className="border-2 border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
          <Gauge className="w-10 h-10 mx-auto mb-3 opacity-25" />
          <p className="font-medium">Tu análisis de aprobación crediticia aparecerá aquí.</p>
          <p className="text-sm mt-1">Incluye probabilidades actuales, mejoradas y factores limitantes.</p>
        </div>
      )}

      {creditPath && (
        <div className="space-y-6">
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Gauge className="text-accent" />
              Tu Análisis Personalizado
            </h3>
            <div className="text-foreground leading-relaxed">
              <MarkdownResponse content={creditPath.explanation} />
            </div>
          </Card>

          <div>
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Probabilidad de Aprobación</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={probabilityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {probabilityData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--accent))'} />
                    ))}
                  </Bar>
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
