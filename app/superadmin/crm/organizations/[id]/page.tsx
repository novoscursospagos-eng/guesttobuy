'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertCircle,
  Users,
  Home,
  UserCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Organization, Branch } from '@/lib/supabase';

export default function OrganizationDetailPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Organização não encontrada</AlertDescription>
        </Alert>
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
              <h1 className="text-xl font-bold text-foreground">{organization.name}</h1>
              <p className="text-xs text-muted-foreground">ID Master: {organization.master_id}</p>
            </div>
          </div>
          <Badge variant={organization.is_active ? 'default' : 'secondary'}>
            {organization.is_active ? 'Ativa' : 'Inativa'}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informações da Organização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Razão Social</p>
                  <p className="font-medium">{organization.name}</p>
                </div>
                {organization.trade_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Fantasia</p>
                    <p className="font-medium">{organization.trade_name}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organization.cnpj && (
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ</p>
                    <p className="font-mono">{organization.cnpj}</p>
                  </div>
                )}
                {organization.industry && (
                  <div>
                    <p className="text-sm text-muted-foreground">Setor</p>
                    <p className="font-medium capitalize">{organization.industry}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organization.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${organization.email}`} className="text-blue-600 hover:underline">
                      {organization.email}
                    </a>
                  </div>
                )}
                {organization.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{organization.phone}</span>
                  </div>
                )}
              </div>

              {organization.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {organization.website}
                  </a>
                </div>
              )}

              {(organization.address || organization.city) && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    {organization.address && <p>{organization.address}</p>}
                    {organization.neighborhood && <p>{organization.neighborhood}</p>}
                    {organization.city && organization.state && (
                      <p>{organization.city}, {organization.state} {organization.zip_code}</p>
                    )}
                  </div>
                </div>
              )}

              {organization.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm">{organization.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm">Filiais</span>
                </div>
                <span className="font-bold text-lg">{branches.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Corretores</span>
                </div>
                <span className="font-bold text-lg">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-orange-500" />
                  <span className="text-sm">Imóveis</span>
                </div>
                <span className="font-bold text-lg">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="text-sm">Compradores</span>
                </div>
                <span className="font-bold text-lg">0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="branches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="branches">Filiais ({branches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="branches">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filiais</CardTitle>
                  <Button onClick={() => router.push(`/superadmin/crm/organizations/${organizationId}/branches`)}>
                    Gerenciar Filiais
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {branches.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Nenhuma filial cadastrada</p>
                    <Button onClick={() => router.push(`/superadmin/crm/organizations/${organizationId}/branches`)}>
                      Adicionar Primeira Filial
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branches.map((branch) => (
                      <Card
                        key={branch.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => router.push(`/superadmin/crm/branches/${branch.id}`)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{branch.name}</CardTitle>
                            <Badge variant="outline" className="font-mono text-xs">
                              {branch.full_id}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {branch.city && branch.state && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {branch.city}, {branch.state}
                            </div>
                          )}
                          {branch.phone && (
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                              <Phone className="h-3 w-3 mr-1" />
                              {branch.phone}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
