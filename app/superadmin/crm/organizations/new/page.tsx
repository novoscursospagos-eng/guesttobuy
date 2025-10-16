'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Building,
} from 'lucide-react';
import { brazilianStates, getCitiesByState, formatPhone, formatCEP, formatCNPJ, fetchAddressByCEP } from '@/lib/brazilian-locations';
import { supabase } from '@/lib/supabase';

export default function NewOrganizationPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const router = useRouter();

  const [organizationData, setOrganizationData] = useState({
    name: '',
    email: '',
    password: '',
  });

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

  const handleInputChange = (field: string, value: string) => {
    setOrganizationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!organizationData.name) {
        setError('Nome da organização é obrigatório.');
        setSaving(false);
        return;
      }

      if (!organizationData.email) {
        setError('Email é obrigatório.');
        setSaving(false);
        return;
      }

      if (!organizationData.password) {
        setError('Senha é obrigatória.');
        setSaving(false);
        return;
      }

      const { data: nextMasterIdData, error: masterIdError } = await supabase
        .rpc('generate_next_master_id');

      if (masterIdError) {
        console.error('Erro ao gerar master_id:', masterIdError);
        setError('Erro ao gerar ID da organização.');
        setSaving(false);
        return;
      }

      const { data: newOrg, error: insertError } = await supabase
        .from('organizations')
        .insert({
          master_id: nextMasterIdData,
          name: organizationData.name,
          email: organizationData.email,
          password: organizationData.password,
          is_active: true,
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Erro ao criar organização:', insertError);
        setError('Erro ao criar organização. Tente novamente.');
        setSaving(false);
        return;
      }

      setSuccess(`Organização criada com sucesso! ID Master: ${newOrg.master_id}`);
      setTimeout(() => {
        router.push('/superadmin/crm/organizations');
      }, 2000);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao criar organização. Tente novamente.');
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
            <Building className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Nova Organização</h1>
              <p className="text-xs text-muted-foreground">Criar organização matriz</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Informações da Organização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Organização *</Label>
                <Input
                  id="name"
                  value={organizationData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Imobiliária ABC, Construtora XYZ, Grupo Empresarial 123"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A organização é a conta matriz principal. Você poderá adicionar filiais, corretores e imóveis dentro dela.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={organizationData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={organizationData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Senha de acesso"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Senha para acesso da organização ao sistema
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/superadmin/crm/organizations')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Criando...' : 'Criar Organização'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}