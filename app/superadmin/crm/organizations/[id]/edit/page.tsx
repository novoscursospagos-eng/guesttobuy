'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditOrganizationPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [organization, setOrganization] = useState<any>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const router = useRouter();
  const params = useParams();

  const [organizationData, setOrganizationData] = useState({
    name: '',
    tradeName: '',
    cnpj: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    size: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    source: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
        loadOrganization();
      } else {
        router.push('/superadmin');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router, params.id]);

  const loadOrganization = () => {
    const organizationsData = JSON.parse(localStorage.getItem('crmOrganizations') || '[]');
    const foundOrganization = organizationsData.find((org: any) => org.id === params.id);
    
    if (foundOrganization) {
      setOrganization(foundOrganization);
      setOrganizationData({
        name: foundOrganization.name || '',
        tradeName: foundOrganization.tradeName || '',
        cnpj: foundOrganization.cnpj || '',
        email: foundOrganization.email || '',
        phone: foundOrganization.phone || '',
        website: foundOrganization.website || '',
        industry: foundOrganization.industry || '',
        size: foundOrganization.size || '',
        address: foundOrganization.address || '',
        neighborhood: foundOrganization.neighborhood || '',
        city: foundOrganization.city || '',
        state: foundOrganization.state || '',
        zipCode: foundOrganization.zipCode || '',
        notes: foundOrganization.notes || '',
        source: foundOrganization.source || '',
      });

      // Load cities for the current state
      if (foundOrganization.state) {
        const cities = getCitiesByState(foundOrganization.state);
        setAvailableCities(cities);
      }
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
    
    setOrganizationData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (field === 'state') {
      const cities = getCitiesByState(value);
      setAvailableCities(cities);
      setOrganizationData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleCEPLookup = async (cep: string) => {
    setIsLoadingCEP(true);
    try {
      const addressData = await fetchAddressByCEP(cep);
      setOrganizationData(prev => ({
        ...prev,
        address: addressData.address,
        neighborhood: addressData.neighborhood,
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
      if (!organizationData.name || !organizationData.email) {
        setError('Nome da empresa e email são obrigatórios.');
        return;
      }

      // Check for duplicate CNPJ or email (excluding current organization)
      const existingOrganizations = JSON.parse(localStorage.getItem('crmOrganizations') || '[]');
      if (organizationData.cnpj && existingOrganizations.some((org: any) => org.cnpj === organizationData.cnpj && org.id !== organization.id)) {
        setError('Já existe outra empresa com este CNPJ.');
        return;
      }
      if (existingOrganizations.some((org: any) => org.email === organizationData.email && org.id !== organization.id)) {
        setError('Já existe outra empresa com este email.');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedOrganization = {
        ...organization,
        name: organizationData.name,
        tradeName: organizationData.tradeName,
        cnpj: organizationData.cnpj,
        email: organizationData.email,
        phone: organizationData.phone,
        website: organizationData.website,
        industry: organizationData.industry,
        size: organizationData.size,
        address: organizationData.address,
        neighborhood: organizationData.neighborhood,
        city: organizationData.city,
        state: organizationData.state,
        zipCode: organizationData.zipCode,
        notes: organizationData.notes,
        source: organizationData.source,
        updatedAt: new Date().toISOString(),
      };

      const updatedOrganizations = existingOrganizations.map((org: any) => 
        org.id === organization.id ? updatedOrganization : org
      );
      localStorage.setItem('crmOrganizations', JSON.stringify(updatedOrganizations));

      setSuccess('Empresa atualizada com sucesso!');
      setTimeout(() => {
        router.push('/superadmin/crm');
      }, 1500);
    } catch (err) {
      setError('Erro ao atualizar empresa. Tente novamente.');
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

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Empresa não encontrada</h2>
          <Button onClick={() => router.push('/superadmin/crm')}>
            Voltar ao CRM
          </Button>
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
              <h1 className="text-xl font-bold text-foreground">Editar Empresa</h1>
              <p className="text-xs text-muted-foreground">Atualizar informações da empresa</p>
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
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Razão Social *</Label>
                  <Input
                    id="name"
                    value={organizationData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Empresa LTDA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradeName">Nome Fantasia</Label>
                  <Input
                    id="tradeName"
                    value={organizationData.tradeName}
                    onChange={(e) => handleInputChange('tradeName', e.target.value)}
                    placeholder="Nome comercial"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={organizationData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    placeholder="00.000.000/0001-00"
                    maxLength={18}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={organizationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contato@empresa.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={organizationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={organizationData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select value={organizationData.industry} onValueChange={(value) => setOrganizationData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-estate">Imobiliário</SelectItem>
                      <SelectItem value="construction">Construção</SelectItem>
                      <SelectItem value="finance">Financeiro</SelectItem>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                      <SelectItem value="retail">Varejo</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Porte da Empresa</Label>
                  <Select value={organizationData.size} onValueChange={(value) => setOrganizationData(prev => ({ ...prev, size: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o porte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Microempresa (até 9 funcionários)</SelectItem>
                      <SelectItem value="small">Pequena (10-49 funcionários)</SelectItem>
                      <SelectItem value="medium">Média (50-249 funcionários)</SelectItem>
                      <SelectItem value="large">Grande (250+ funcionários)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CEP</Label>
                <div className="relative">
                  <Input
                    value={organizationData.zipCode}
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
                  value={organizationData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, complemento"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input
                  value={organizationData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={organizationData.state} onValueChange={(value) => handleInputChange('state', value)}>
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
                    value={organizationData.city} 
                    onValueChange={(value) => handleInputChange('city', value)}
                    disabled={!organizationData.state}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={organizationData.state ? "Selecione a cidade" : "Selecione o estado primeiro"} />
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
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Complementares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Origem do Contato</Label>
                <Select value={organizationData.source} onValueChange={(value) => setOrganizationData(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como conheceu a empresa?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Telefone">Telefone</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                    <SelectItem value="Parceria">Parceria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={organizationData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Informações importantes sobre esta empresa..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/superadmin/crm')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}