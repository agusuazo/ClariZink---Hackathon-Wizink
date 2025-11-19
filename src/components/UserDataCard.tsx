import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { CheckCircle, Edit2 } from 'lucide-react';

const UserDataCard = () => {
  const { userType, userData, setUserData } = useAppContext();
  const [isEditing, setIsEditing] = useState(userType === 'visitor');
  const [formData, setFormData] = useState(
    userData || {
      ingresos: 0,
      empleo: '',
      deuda: 0,
      retrasos: 0,
      importe: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isEditing && userData) {
    return (
      <Card className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle className="text-accent" />
            Tu información financiera
          </h3>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ingresos mensuales</p>
            <p className="text-xl font-semibold text-foreground">{userData.ingresos.toLocaleString()}€</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tipo de empleo</p>
            <p className="text-xl font-semibold text-foreground">{userData.empleo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Deuda actual</p>
            <p className="text-xl font-semibold text-foreground">{userData.deuda.toLocaleString()}€</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Retrasos en pagos</p>
            <p className="text-xl font-semibold text-foreground">{userData.retrasos}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Importe solicitado</p>
            <p className="text-xl font-semibold text-foreground">{userData.importe.toLocaleString()}€</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-foreground mb-6">
        {userType === 'visitor' ? 'Ingresa tus datos' : 'Actualiza tu información'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ingresos">Ingresos mensuales (€)</Label>
            <Input
              id="ingresos"
              type="number"
              value={formData.ingresos}
              onChange={e => handleChange('ingresos', Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empleo">Tipo de empleo</Label>
            <Input
              id="empleo"
              type="text"
              value={formData.empleo}
              onChange={e => handleChange('empleo', e.target.value)}
              placeholder="Ej: Contrato Indefinido"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deuda">Deuda actual (€)</Label>
            <Input
              id="deuda"
              type="number"
              value={formData.deuda}
              onChange={e => handleChange('deuda', Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retrasos">Retrasos en pagos</Label>
            <Input
              id="retrasos"
              type="number"
              value={formData.retrasos}
              onChange={e => handleChange('retrasos', Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="importe">Importe solicitado (€)</Label>
            <Input
              id="importe"
              type="number"
              value={formData.importe}
              onChange={e => handleChange('importe', Number(e.target.value))}
              required
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full">
          Guardar información
        </Button>
      </form>
    </Card>
  );
};

export default UserDataCard;
