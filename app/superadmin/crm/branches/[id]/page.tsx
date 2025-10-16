'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Building,
  Plus,
  Users,
  Home,
  UserCheck,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Trash2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Branch, Organization, User, Property, PropertyInterest } from '@/lib/supabase';

interface Supplier {
  id: string;
  organization_id: string;
  branch_id: string | null;
  sub_id: string;
  full_id: string;
  name: string;
  company_name: string | null;
  cnpj: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  category: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
import { brazilianStates, getCitiesByState, formatPhone, formatCEP, formatCPF, validateCPF, formatCNPJ, validateCNPJ } from '@/lib/brazilian-locations';

export default function BranchDetailPage() {
  const params = useParams();
  const branchId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [brokers, setBrokers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [buyers, setBuyers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isBrokerDialogOpen, setIsBrokerDialogOpen] = useState(false);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [isBuyerDialogOpen, setIsBuyerDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const router = useRouter();

  const [brokerData, setBrokerData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    creci: '',
    role: 'broker_employee' as 'broker_owner' | 'broker_employee',
    password: '',
  });

  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    propertyType: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: '0',
    bathrooms: '0',
    area: '',
    brokerId: '',
  });

  const [buyerData, setBuyerData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
  });

  const [supplierData, setSupplierData] = useState({
    name: '',
    companyName: '',
    cnpj: '',
    email: '',
    phone: '',
    category: '',
    notes: '',
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
  }, [router, branchId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .maybeSingle();

      if (branchError || !branchData) {
        setError('Filial não encontrada');
        setLoading(false);
        return;
      }

      setBranch(branchData);

      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', branchData.organization_id)
        .maybeSingle();

      if (orgData) setOrganization(orgData);

      const { data: brokersData } = await supabase
        .from('users')
        .select('*')
        .eq('branch_id', branchId)
        .in('role', ['broker_owner', 'broker_employee'])
        .order('created_at', { ascending: false });

      setBrokers(brokersData || []);

      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      setProperties(propertiesData || []);

      const { data: buyersData } = await supabase
        .from('users')
        .select('*')
        .eq('branch_id', branchId)
        .eq('role', 'buyer')
        .order('created_at', { ascending: false });

      setBuyers(buyersData || []);

      const { data: suppliersData } = await supabase
        .from('suppliers')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      setSuppliers(suppliersData || []);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!brokerData.name || !brokerData.email || !brokerData.password) {
        setError('Nome, email e senha são obrigatórios.');
        setSaving(false);
        return;
      }

      if (brokerData.cpf && !validateCPF(brokerData.cpf)) {
        setError('CPF inválido.');
        setSaving(false);
        return;
      }

      const { data: nextSubIdData, error: subIdError } = await supabase
        .rpc('generate_next_user_sub_id', {
          org_id: branch!.organization_id,
          user_role: brokerData.role
        });

      if (subIdError) {
        setError('Erro ao gerar ID do corretor.');
        setSaving(false);
        return;
      }

      const fullId = `${branch!.full_id}-${nextSubIdData}`;

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          organization_id: branch!.organization_id,
          branch_id: branchId,
          sub_id: nextSubIdData,
          full_id: fullId,
          email: brokerData.email,
          password_hash: brokerData.password,
          name: brokerData.name,
          phone: brokerData.phone,
          role: brokerData.role,
          cpf: brokerData.cpf,
          creci: brokerData.creci,
          is_active: true,
        });

      if (insertError) {
        console.error('Erro ao criar corretor:', insertError);
        setError('Erro ao criar corretor. Verifique se o email já existe.');
        setSaving(false);
        return;
      }

      setSuccess(`Corretor criado com sucesso! ID: ${fullId}`);
      setIsBrokerDialogOpen(false);
      setBrokerData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        creci: '',
        role: 'broker_employee',
        password: '',
      });
      loadData();
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao criar corretor.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!propertyData.title || !propertyData.brokerId) {
        setError('Título e corretor responsável são obrigatórios.');
        setSaving(false);
        return;
      }

      const { data: nextSubIdData, error: subIdError } = await supabase
        .rpc('generate_next_property_sub_id', { org_id: branch!.organization_id });

      if (subIdError) {
        setError('Erro ao gerar ID do imóvel.');
        setSaving(false);
        return;
      }

      const fullId = `${branch!.full_id}-${nextSubIdData}`;

      const { error: insertError } = await supabase
        .from('properties')
        .insert({
          organization_id: branch!.organization_id,
          branch_id: branchId,
          broker_id: propertyData.brokerId,
          sub_id: nextSubIdData,
          full_id: fullId,
          title: propertyData.title,
          description: propertyData.description,
          property_type: propertyData.propertyType,
          address: propertyData.address,
          neighborhood: propertyData.neighborhood,
          city: propertyData.city,
          state: propertyData.state,
          zip_code: propertyData.zipCode,
          price: propertyData.price ? parseFloat(propertyData.price) : null,
          bedrooms: parseInt(propertyData.bedrooms) || 0,
          bathrooms: parseInt(propertyData.bathrooms) || 0,
          area: propertyData.area ? parseFloat(propertyData.area) : null,
          status: 'available',
          is_active: true,
        });

      if (insertError) {
        console.error('Erro ao criar imóvel:', insertError);
        setError('Erro ao criar imóvel.');
        setSaving(false);
        return;
      }

      setSuccess(`Imóvel criado com sucesso! ID: ${fullId}`);
      setIsPropertyDialogOpen(false);
      setPropertyData({
        title: '',
        description: '',
        propertyType: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        price: '',
        bedrooms: '0',
        bathrooms: '0',
        area: '',
        brokerId: '',
      });
      loadData();
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao criar imóvel.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!buyerData.name || !buyerData.email || !buyerData.password) {
        setError('Nome, email e senha são obrigatórios.');
        setSaving(false);
        return;
      }

      if (buyerData.cpf && !validateCPF(buyerData.cpf)) {
        setError('CPF inválido.');
        setSaving(false);
        return;
      }

      const { data: nextSubIdData, error: subIdError } = await supabase
        .rpc('generate_next_user_sub_id', {
          org_id: branch!.organization_id,
          user_role: 'buyer'
        });

      if (subIdError) {
        setError('Erro ao gerar ID do comprador.');
        setSaving(false);
        return;
      }

      const fullId = `${branch!.full_id}-${nextSubIdData}`;

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          organization_id: branch!.organization_id,
          branch_id: branchId,
          sub_id: nextSubIdData,
          full_id: fullId,
          email: buyerData.email,
          password_hash: buyerData.password,
          name: buyerData.name,
          phone: buyerData.phone,
          role: 'buyer',
          cpf: buyerData.cpf,
          is_active: true,
        });

      if (insertError) {
        console.error('Erro ao criar comprador:', insertError);
        setError('Erro ao criar comprador. Verifique se o email já existe.');
        setSaving(false);
        return;
      }

      setSuccess(`Comprador criado com sucesso! ID: ${fullId}`);
      setIsBuyerDialogOpen(false);
      setBuyerData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        password: '',
      });
      loadData();
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao criar comprador.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!supplierData.name || !supplierData.email) {
        setError('Nome e email são obrigatórios.');
        setSaving(false);
        return;
      }

      if (supplierData.cnpj) {
        const numbers = supplierData.cnpj.replace(/\D/g, '');
        if (numbers.length === 11) {
          if (!validateCPF(supplierData.cnpj)) {
            setError('CPF inválido.');
            setSaving(false);
            return;
          }
        } else if (numbers.length === 14) {
          if (!validateCNPJ(supplierData.cnpj)) {
            setError('CNPJ inválido.');
            setSaving(false);
            return;
          }
        } else if (numbers.length > 0) {
          setError('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.');
          setSaving(false);
          return;
        }
      }

      const { data: nextSubIdData, error: subIdError } = await supabase
        .rpc('generate_next_supplier_sub_id', { org_id: branch!.organization_id });

      if (subIdError) {
        setError('Erro ao gerar ID do fornecedor.');
        setSaving(false);
        return;
      }

      const fullId = `${branch!.full_id}-F${nextSubIdData}`;

      const { error: insertError } = await supabase
        .from('suppliers')
        .insert({
          organization_id: branch!.organization_id,
          branch_id: branchId,
          sub_id: nextSubIdData,
          full_id: fullId,
          name: supplierData.name,
          company_name: supplierData.companyName,
          cnpj: supplierData.cnpj,
          email: supplierData.email,
          phone: supplierData.phone,
          category: supplierData.category,
          notes: supplierData.notes,
          is_active: true,
        });

      if (insertError) {
        console.error('Erro ao criar fornecedor:', insertError);
        setError('Erro ao criar fornecedor.');
        setSaving(false);
        return;
      }

      setSuccess(`Fornecedor criado com sucesso! ID: ${fullId}`);
      setIsSupplierDialogOpen(false);
      setSupplierData({
        name: '',
        companyName: '',
        cnpj: '',
        email: '',
        phone: '',
        category: '',
        notes: '',
      });
      loadData();
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao criar fornecedor.');
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

  if (!branch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Filial não encontrada</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/superadmin/crm/organizations/${branch.organization_id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Building className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{branch.name}</h1>
              <p className="text-xs text-muted-foreground">
                {organization?.name} - ID: {branch.full_id}
              </p>
            </div>
          </div>
          <Badge variant={branch.is_active ? 'default' : 'secondary'}>
            {branch.is_active ? 'Ativa' : 'Inativa'}
          </Badge>
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Corretores</p>
                  <p className="text-2xl font-bold">{brokers.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Imóveis</p>
                  <p className="text-2xl font-bold">{properties.length}</p>
                </div>
                <Home className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold">{buyers.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fornecedores</p>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                </div>
                <Building className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                  <p className="text-2xl font-bold">
                    {properties.filter(p => p.status === 'available').length}
                  </p>
                </div>
                <Home className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="brokers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="brokers">Corretores ({brokers.length})</TabsTrigger>
            <TabsTrigger value="properties">Imóveis ({properties.length})</TabsTrigger>
            <TabsTrigger value="buyers">Clientes ({buyers.length})</TabsTrigger>
            <TabsTrigger value="suppliers">Fornecedores ({suppliers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="brokers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Corretores</CardTitle>
                  <Dialog open={isBrokerDialogOpen} onOpenChange={setIsBrokerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Corretor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Novo Corretor</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateBroker} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome Completo *</Label>
                            <Input
                              value={brokerData.name}
                              onChange={(e) => setBrokerData({...brokerData, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={brokerData.email}
                              onChange={(e) => setBrokerData({...brokerData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Telefone</Label>
                            <Input
                              value={brokerData.phone}
                              onChange={(e) => setBrokerData({...brokerData, phone: formatPhone(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CPF</Label>
                            <Input
                              value={brokerData.cpf}
                              onChange={(e) => setBrokerData({...brokerData, cpf: formatCPF(e.target.value)})}
                              placeholder="000.000.000-00"
                              maxLength={14}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>CRECI</Label>
                            <Input
                              value={brokerData.creci}
                              onChange={(e) => setBrokerData({...brokerData, creci: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo *</Label>
                            <Select
                              value={brokerData.role}
                              onValueChange={(value: any) => setBrokerData({...brokerData, role: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="broker_owner">Corretor Proprietário</SelectItem>
                                <SelectItem value="broker_employee">Corretor Funcionário</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Senha *</Label>
                          <Input
                            type="password"
                            value={brokerData.password}
                            onChange={(e) => setBrokerData({...brokerData, password: e.target.value})}
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-4">
                          <Button type="button" variant="outline" onClick={() => setIsBrokerDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={saving}>
                            {saving ? 'Criando...' : 'Criar Corretor'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CRECI</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brokers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum corretor cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      brokers.map((broker) => (
                        <TableRow key={broker.id}>
                          <TableCell className="font-mono text-sm">{broker.full_id}</TableCell>
                          <TableCell className="font-medium">{broker.name}</TableCell>
                          <TableCell>{broker.email}</TableCell>
                          <TableCell>{broker.creci || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {broker.role === 'broker_owner' ? 'Proprietário' : 'Funcionário'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={broker.is_active ? 'default' : 'secondary'}>
                              {broker.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Imóveis</CardTitle>
                  <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={brokers.length === 0}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Imóvel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Novo Imóvel</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateProperty} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Título *</Label>
                          <Input
                            value={propertyData.title}
                            onChange={(e) => setPropertyData({...propertyData, title: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Textarea
                            value={propertyData.description}
                            onChange={(e) => setPropertyData({...propertyData, description: e.target.value})}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select
                              value={propertyData.propertyType}
                              onValueChange={(value) => setPropertyData({...propertyData, propertyType: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="apartment">Apartamento</SelectItem>
                                <SelectItem value="house">Casa</SelectItem>
                                <SelectItem value="condo">Condomínio</SelectItem>
                                <SelectItem value="commercial">Comercial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Corretor Responsável *</Label>
                            <Select
                              value={propertyData.brokerId}
                              onValueChange={(value) => setPropertyData({...propertyData, brokerId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {brokers.map((broker) => (
                                  <SelectItem key={broker.id} value={broker.id}>
                                    {broker.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Endereço</Label>
                          <Input
                            value={propertyData.address}
                            onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Quartos</Label>
                            <Input
                              type="number"
                              min="0"
                              value={propertyData.bedrooms}
                              onChange={(e) => setPropertyData({...propertyData, bedrooms: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Banheiros</Label>
                            <Input
                              type="number"
                              min="0"
                              value={propertyData.bathrooms}
                              onChange={(e) => setPropertyData({...propertyData, bathrooms: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Área (m²)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={propertyData.area}
                              onChange={(e) => setPropertyData({...propertyData, area: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Preço (R$)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={propertyData.price}
                            onChange={(e) => setPropertyData({...propertyData, price: e.target.value})}
                          />
                        </div>

                        <div className="flex justify-end gap-4">
                          <Button type="button" variant="outline" onClick={() => setIsPropertyDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={saving}>
                            {saving ? 'Criando...' : 'Criar Imóvel'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {brokers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Cadastre um corretor primeiro para poder adicionar imóveis</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Corretor</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum imóvel cadastrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        properties.map((property) => {
                          const broker = brokers.find(b => b.id === property.broker_id);
                          return (
                            <TableRow key={property.id}>
                              <TableCell className="font-mono text-sm">{property.full_id}</TableCell>
                              <TableCell className="font-medium">{property.title}</TableCell>
                              <TableCell className="capitalize">{property.property_type || '-'}</TableCell>
                              <TableCell>{broker?.name || '-'}</TableCell>
                              <TableCell>
                                {property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                                  {property.status === 'available' ? 'Disponível' : property.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compradores</CardTitle>
                  <Dialog open={isBuyerDialogOpen} onOpenChange={setIsBuyerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Comprador
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Novo Comprador</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateBuyer} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome Completo *</Label>
                            <Input
                              value={buyerData.name}
                              onChange={(e) => setBuyerData({...buyerData, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={buyerData.email}
                              onChange={(e) => setBuyerData({...buyerData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Telefone</Label>
                            <Input
                              value={buyerData.phone}
                              onChange={(e) => setBuyerData({...buyerData, phone: formatPhone(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CPF</Label>
                            <Input
                              value={buyerData.cpf}
                              onChange={(e) => setBuyerData({...buyerData, cpf: formatCPF(e.target.value)})}
                              placeholder="000.000.000-00"
                              maxLength={14}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Senha *</Label>
                          <Input
                            type="password"
                            value={buyerData.password}
                            onChange={(e) => setBuyerData({...buyerData, password: e.target.value})}
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-4">
                          <Button type="button" variant="outline" onClick={() => setIsBuyerDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={saving}>
                            {saving ? 'Criando...' : 'Criar Comprador'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum comprador cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      buyers.map((buyer) => (
                        <TableRow key={buyer.id}>
                          <TableCell className="font-mono text-sm">{buyer.full_id}</TableCell>
                          <TableCell className="font-medium">{buyer.name}</TableCell>
                          <TableCell>{buyer.email}</TableCell>
                          <TableCell>{buyer.phone || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={buyer.is_active ? 'default' : 'secondary'}>
                              {buyer.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Fornecedores</CardTitle>
                  <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Fornecedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Novo Fornecedor</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateSupplier} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome do Contato *</Label>
                            <Input
                              value={supplierData.name}
                              onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Razão Social</Label>
                            <Input
                              value={supplierData.companyName}
                              onChange={(e) => setSupplierData({...supplierData, companyName: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={supplierData.email}
                              onChange={(e) => setSupplierData({...supplierData, email: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Telefone</Label>
                            <Input
                              value={supplierData.phone}
                              onChange={(e) => setSupplierData({...supplierData, phone: formatPhone(e.target.value)})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>CPF/CNPJ</Label>
                            <Input
                              value={supplierData.cnpj}
                              onChange={(e) => {
                                const numbers = e.target.value.replace(/\D/g, '');
                                const formatted = numbers.length <= 11
                                  ? formatCPF(e.target.value)
                                  : formatCNPJ(e.target.value);
                                setSupplierData({...supplierData, cnpj: formatted});
                              }}
                              placeholder="000.000.000-00 ou 00.000.000/0001-00"
                              maxLength={18}
                            />
                            <p className="text-xs text-muted-foreground">
                              Aceita CPF (11 dígitos) ou CNPJ (14 dígitos)
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                              value={supplierData.category}
                              onValueChange={(value) => setSupplierData({...supplierData, category: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="furniture">Móveis</SelectItem>
                                <SelectItem value="construction">Construção</SelectItem>
                                <SelectItem value="cleaning">Limpeza</SelectItem>
                                <SelectItem value="maintenance">Manutenção</SelectItem>
                                <SelectItem value="security">Segurança</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Observações</Label>
                          <Textarea
                            value={supplierData.notes}
                            onChange={(e) => setSupplierData({...supplierData, notes: e.target.value})}
                            rows={3}
                          />
                        </div>

                        <div className="flex justify-end gap-4">
                          <Button type="button" variant="outline" onClick={() => setIsSupplierDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={saving}>
                            {saving ? 'Criando...' : 'Criar Fornecedor'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum fornecedor cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-mono text-sm">{supplier.full_id}</TableCell>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>{supplier.company_name || '-'}</TableCell>
                          <TableCell>{supplier.email}</TableCell>
                          <TableCell className="capitalize">{supplier.category || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                              {supplier.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
