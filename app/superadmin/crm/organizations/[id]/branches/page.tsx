'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Plus,
  Building,
  Edit,
  Trash2,
  MapPin,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Organization, Branch } from '@/lib/supabase';
import { brazilianStates, getCitiesByState, formatPhone, formatCEP, formatCNPJ, validateCNPJ, fetchAddressByCEP } from '@/lib/brazilian-locations';

export default function BranchesPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const router = useRouter();

  const [branchData, setBranchData] = useState({
    name: '',
    cnpj: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
        loadData();
      } else {
        router.push('/superadmin');
      }
    } else {
      router.push('/login');
    }
  }, [router, organizationId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .maybeSingle();

      if (orgError) {
        console.error('Erro ao carregar organização:', orgError);
        setError('Erro ao carregar organização');
        return;
      }

      if (!orgData) {
        setError('Organização não encontrada');
        return;
      }

      setOrganization(orgData);

      const { data: branchesData, error: branchesError } = await supabase
        .from('branches')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (branchesError) {
        console.error('Erro ao carregar filiais:', branchesError);
        setError('Erro ao carregar filiais');
      } else {
        setBranches(branchesData || []);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (field === 'zipCode') {
      formattedValue = formatCEP(value);

      if (formattedValue.length === 9) {
        handleCEPLookup(formattedValue);
      }
    }

    setBranchData(prev => ({ ...prev, [field]: formattedValue }));

    if (field === 'state') {
      const cities = getCitiesByState(value);
      setAvailableCities(cities);
      setBranchData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleCEPLookup = async (cep: string) => {
    setIsLoadingCEP(true);
    try {
      const addressData = await fetchAddressByCEP(cep);
      setBranchData(prev => ({
        ...prev,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
      }));

      const cities = getCitiesByState(addressData.state);
      setAvailableCities(cities);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!branchData.name) {
        setError('Nome da filial é obrigatório.');
        setSaving(false);
        return;
      }

      if (branchData.cnpj && !validateCNPJ(branchData.cnpj)) {
        setError('CNPJ inválido.');
        setSaving(false);
        return;
      }

      const { data: nextSubIdData, error: subIdError } = await supabase
        .rpc('generate_next_branch_sub_id', { org_id: organizationId });

      if (subIdError) {
        console.error('Erro ao gerar sub_id:', subIdError);
        setError('Erro ao gerar ID da filial.');
        setSaving(false);
        return;
      }

      const fullId = `${organization!.master_id}-${nextSubIdData}`;

      const { error: insertError } = await supabase
        .from('branches')
        .insert({
          organization_id: organizationId,
          sub_id: nextSubIdData,
          full_id: fullId,
          name: branchData.name,
          cnpj: branchData.cnpj,
          email: branchData.email,
          password: branchData.password,
          phone: branchData.phone,
          address: branchData.address,
          neighborhood: branchData.neighborhood,
          city: branchData.city,
          state: branchData.state,
          zip_code: branchData.zipCode,
          is_active: true,
        });

      if (insertError) {
        console.error('Erro ao criar filial:', insertError);
        setError('Erro ao criar filial. Tente novamente.');
        setSaving(false);
        return;
      }

      setSuccess(`Filial criada com sucesso! ID: ${fullId}`);
      setIsDialogOpen(false);
      setBranchData({
        name: '',
        cnpj: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      });
      loadData();
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao criar filial. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta filial?')) return;

    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir filial:', error);
        setError('Erro ao excluir filial');
      } else {
        setSuccess('Filial excluída com sucesso!');
        loadData();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao excluir filial');
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
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin/crm/organizations')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Building className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Filiais</h1>
              <p className="text-xs text-muted-foreground">
                {organization?.name} - ID: {organization?.master_id}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Filial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Filial</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Filial *</Label>
                    <Input
                      id="name"
                      value={branchData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome da filial"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={branchData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0001-00"
                      maxLength={18}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={branchData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="filial@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={branchData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Senha de acesso"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={branchData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CEP</Label>
                  <div className="relative">
                    <Input
                      value={branchData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="00000-000"
                      className={isLoadingCEP ? 'pr-10' : ''}
                      maxLength={9}
                    />
                    {isLoadingCEP && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    value={branchData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={branchData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    placeholder="Nome do bairro"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={branchData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Select
                      value={branchData.city}
                      onValueChange={(value) => handleInputChange('city', value)}
                      disabled={!branchData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchData.state ? "Selecione a cidade" : "Selecione o estado primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Criando...' : 'Criar Filial'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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

        {branches.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma filial cadastrada</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando sua primeira filial para esta organização
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/superadmin/crm/branches/${branch.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <Badge variant="outline" className="font-mono text-xs">
                          {branch.full_id}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{branch.name}</CardTitle>
                    </div>
                    <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                      {branch.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {branch.cnpj && (
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-16">CNPJ:</span>
                        <span className="font-mono">{branch.cnpj}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-16">Email:</span>
                        <span className="truncate">{branch.email}</span>
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-16">Tel:</span>
                        <span>{branch.phone}</span>
                      </div>
                    )}
                    {(branch.city || branch.state) && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{branch.city && branch.state ? `${branch.city}, ${branch.state}` : branch.city || branch.state}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/superadmin/crm/branches/${branch.id}`);
                      }}
                    >
                      Gerenciar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(branch.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
