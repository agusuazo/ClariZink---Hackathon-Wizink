import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callPreApproval } from "@/lib/api";

const PreApprovalFinder = () => {
  const { userData, preApproval, setPreApproval } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const findPreApprovals = async () => {
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
      const res = await callPreApproval(userData);

      setPreApproval({
        products: res.productos.map((p) => ({
          name: p.producto,
          // conviertes "alta/media/baja" en número para los gráficos
          probability: p.prob === "alta" ? 85 : p.prob === "media" ? 65 : 40,
          amount: 15000, // placeholder
          risk: p.prob === "alta" ? "Bajo" : p.prob === "media" ? "Medio" : "Alto",
        })),
        overallRisk: 30, // dummy hasta tener lógica del backend
      });

      toast({
        title: "Análisis completo",
        description: "Productos recomendados disponibles",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo obtener recomendaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const scatterData = preApproval?.products.map(p => ({
    x: p.amount,
    y: p.probability,
    z: p.amount / 1000,
    name: p.name,
  }));

  const riskColors = {
    Bajo: 'hsl(var(--accent))',
    Medio: 'hsl(var(--violet))',
    Alto: 'hsl(var(--destructive))',
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Módulo 2: PreApproval Finder</h2>
        <p className="text-muted-foreground">Descubre todos los productos crediticios a tu alcance</p>
      </div>

      <Button
        onClick={findPreApprovals}
        disabled={loading || !userData}
        size="lg"
        className="w-full md:w-auto mb-6 bg-secondary hover:bg-secondary/90"
      >
        {loading ? 'Analizando...' : '¿A qué créditos puedo optar?'}
      </Button>

      {!preApproval && (
        <div className="border-2 border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-25" />
          <p className="font-medium">Los productos crediticios disponibles para tu perfil aparecerán aquí.</p>
          <p className="text-sm mt-1">Verás probabilidades de aprobación y comparativas de riesgo.</p>
        </div>
      )}

      {preApproval && (
        <div className="space-y-6">
          <Card className="p-6 bg-secondary/5 border-secondary/20">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="text-secondary" />
              Productos Recomendados
            </h3>
            <div className="space-y-4">
              {preApproval.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border"
                >
                  <div>
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Hasta {product.amount.toLocaleString()}€
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: riskColors[product.risk as keyof typeof riskColors] }}>
                      {product.probability}%
                    </p>
                    <p className="text-xs text-muted-foreground">Riesgo: {product.risk}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Importe vs Probabilidad</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="x" name="Importe" unit="€" />
                  <YAxis dataKey="y" name="Probabilidad" unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} fill="hsl(var(--secondary))">
                    {scatterData?.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--${index === 0 ? 'accent' : index === 1 ? 'secondary' : 'violet'}))`} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Indicador de Riesgo Global</h4>
              <div className="flex flex-col items-center justify-center h-[300px]">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="10"
                      strokeDasharray={`${preApproval.overallRisk * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-3xl font-bold fill-foreground">
                      {preApproval.overallRisk}%
                    </text>
                  </svg>
                </div>
                <p className="text-center text-muted-foreground mt-4">
                  Riesgo Global: <span className="font-semibold text-accent">Bajo</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PreApprovalFinder;
