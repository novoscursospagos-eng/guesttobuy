'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Target,
  GripVertical,
} from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export default function NewFunnelPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [funnelData, setFunnelData] = useState({
    name: '',
    description: '',
  });

  const [stages, setStages] = useState<Stage[]>([
    { id: '1', name: 'Lead', order: 1, color: '#3b82f6' },
    { id: '2', name: 'Qualificado', order: 2, color: '#8b5cf6' },
    { id: '3', name: 'Proposta', order: 3, color: '#f59e0b' },
    { id: '4', name: 'Fechado', order: 4, color: '#10b981' },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
      } else {
        router.push('/superadmin');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const addStage = () => {
    const newStage: Stage = {
      id: Date.now().toString(),
      name: `Etapa ${stages.length + 1}`,
      order: stages.length + 1,
      color: '#6b7280',
    };
    setStages(prev => [...prev, newStage]);
  };

  const removeStage = (stageId: string) => {
    if (stages.length <= 2) {
      setError('Um funil deve ter pelo menos 2 etapas.');
      return;
    }
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  };

  const updateStage = (stageId: string, field: keyof Stage, value: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, [field]: value } : stage
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!funnelData.name.trim()) {
        setError('Nome do funil é obrigatório.');
        return;
      }

      if (stages.some(stage => !stage.name.trim())) {
        setError('Todas as etapas devem ter um nome.');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create funnel object
      const newFunnel = {
        id: Date.now().toString(),
        name: funnelData.name,
        description: funnelData.description,
        stages: stages.map((stage, index) => ({ ...stage, order: index + 1 })),
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingFunnels = JSON.parse(localStorage.getItem('crmFunnels') || '[]');
      existingFunnels.push(newFunnel);
      localStorage.setItem('crmFunnels', JSON.stringify(existingFunnels));

      setSuccess('Funil criado com sucesso!');
      setTimeout(() => {
        router.push('/superadmin/crm');
      }, 1500);
    } catch (err) {
      setError('Erro ao criar funil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin/crm')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao CRM
            </Button>
            <Target className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Novo Funil</h1>
              <p className="text-xs text-muted-foreground">Criar funil de vendas</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Funil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Funil *</Label>
                <Input
                  id="name"
                  value={funnelData.name}
                  onChange={(e) => setFunnelData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Vendas Imóveis"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={funnelData.description}
                  onChange={(e) => setFunnelData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito deste funil..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stages */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Etapas do Funil</CardTitle>
                <Button type="button" variant="outline" onClick={addStage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Etapa</Label>
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                        placeholder="Nome da etapa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <div className="flex gap-2">
                        {['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6b7280'].map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${stage.color === color ? 'border-foreground' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateStage(stage.id, 'color', color)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ordem</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStage(stage.id)}
                          disabled={stages.length <= 2}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/superadmin/crm')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Criando...' : 'Criar Funil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}