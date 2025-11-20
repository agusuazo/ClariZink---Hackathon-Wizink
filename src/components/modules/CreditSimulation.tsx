import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAppContext } from '@/contexts/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callSimulateScenario } from "@/lib/api";

const CreditSimulation = () => {
  const { userData, simulation, setSimulation } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [simParams, setSimParams] = useState({
    importe: userData?.importe || 15000,
    plazo: 24,
    deuda: userData?.deuda || 12000,
    tiempo: 6,
  });

  const simulateScenario = async () => {
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
      // usa un valor base o la probabilidad actual del backend si la tienes
      const beforeScore = 68;

      const res = await callSimulateScenario(
        beforeScore,
        "reducir_deuda",
        simParams.deuda
      );

      setSimulation({
        narrative: res.narrative,
        beforeScore: res.before,
        afterScore: res.after,
        impactFactors: [
          { factor: "Deuda", value: simParams.deuda },
          { factor: "Plazo", value: simParams.plazo },
          { factor: "Tiempo", value: simParams.tiempo },
        ],
      });

      toast({
        title: "Simulación lista",
        description: "Escenario generado correctamente",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo simular el escenario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const comparisonData = simulation
    ? [
      { scenario: 'Actual', score: simulation.beforeScore },
      { scenario: 'Simulado', score: simulation.afterScore },
    ]
    : [];

  const COLORS = ['hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--violet))', 'hsl(var(--primary))'];

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Módulo 3: Personalized Credit Simulation</h2>
        <p className="text-muted-foreground">Simula diferentes escenarios y descubre cómo mejorar</p>
      </div>

      <Card className="p-6 mb-6 bg-violet/5 border-violet/20">
        <h3 className="text-xl font-semibold text-foreground mb-4">Simulador ¿Y si...?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Importe solicitado: {simParams.importe.toLocaleString()}€</Label>
              <Slider
                value={[simParams.importe]}
                onValueChange={([value]) => setSimParams(prev => ({ ...prev, importe: value }))}
                min={5000}
                max={50000}
                step={1000}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Plazo: {simParams.plazo} meses</Label>
              <Slider
                value={[simParams.plazo]}
                onValueChange={([value]) => setSimParams(prev => ({ ...prev, plazo: value }))}
                min={12}
                max={60}
                step={6}
                className="mt-2"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Reducir deuda a: {simParams.deuda.toLocaleString()}€</Label>
              <Slider
                value={[simParams.deuda]}
                onValueChange={([value]) => setSimParams(prev => ({ ...prev, deuda: value }))}
                min={0}
                max={userData?.deuda || 20000}
                step={500}
                className="mt-2"
              />
            </div>
            <div>
              <Label>En cuánto tiempo: {simParams.tiempo} meses</Label>
              <Slider
                value={[simParams.tiempo]}
                onValueChange={([value]) => setSimParams(prev => ({ ...prev, tiempo: value }))}
                min={3}
                max={24}
                step={3}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </Card>

      <Button
        onClick={simulateScenario}
        disabled={loading || !userData}
        size="lg"
        className="w-full md:w-auto mb-6 bg-violet hover:bg-violet/90"
      >
        {loading ? 'Simulando...' : 'Simular Escenario'}
      </Button>

      {simulation && (
        <div className="space-y-6">
          <Card className="p-6 bg-violet/5 border-violet/20">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="text-violet" />
              Análisis del Escenario
            </h3>
            <p className="text-foreground leading-relaxed">{simulation.narrative}</p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Antes vs Después</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="scenario" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--violet))" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Impacto por Factor</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={simulation.impactFactors}
                    dataKey="value"
                    nameKey="factor"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {simulation.impactFactors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4 text-center">Escenario Actual</h4>
              <div className="text-center">
                <p className="text-6xl font-bold text-secondary">{simulation.beforeScore}</p>
                <p className="text-muted-foreground mt-2">Puntuación actual</p>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4 text-center">Escenario Simulado</h4>
              <div className="text-center">
                <p className="text-6xl font-bold text-violet">{simulation.afterScore}</p>
                <p className="text-muted-foreground mt-2">Puntuación mejorada</p>
                <p className="text-accent font-semibold mt-2">
                  +{simulation.afterScore - simulation.beforeScore} puntos
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CreditSimulation;
