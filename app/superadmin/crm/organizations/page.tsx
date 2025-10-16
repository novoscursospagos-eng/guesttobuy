'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Plus,
  Search,
  Building,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Organization } from '@/lib/supabase';

export default function OrganizationsListPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
        loadOrganizations();
      } else {
        router.push('/superadmin');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar organizações:', error);
        setError('Erro ao carregar organizações');
      } else {
        setOrganizations(data || []);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao carregar organizações');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.master_id.includes(searchTerm) ||
    (org.email && org.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.cnpj && org.cnpj.includes(searchTerm))
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta organização?')) return;

    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir organização:', error);
        setError('Erro ao excluir organização');
      } else {
        loadOrganizations();
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro ao excluir organização');
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
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin/crm')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao CRM
            </Button>
            <Building className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Organizações</h1>
              <p className="text-xs text-muted-foreground">Gerenciar empresas matriz</p>
            </div>
          </div>
          <Button onClick={() => router.push('/superadmin/crm/organizations/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Organização
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, ID, email ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {filteredOrganizations.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma organização encontrada</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira organização'}
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push('/superadmin/crm/organizations/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Organização
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <Badge variant="outline" className="font-mono text-xs">
                          {org.master_id}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{org.name}</CardTitle>
                      {org.trade_name && (
                        <p className="text-sm text-muted-foreground">{org.trade_name}</p>
                      )}
                    </div>
                    <Badge variant={org.is_active ? 'default' : 'secondary'}>
                      {org.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {org.cnpj && (
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-16">CNPJ:</span>
                        <span className="font-mono">{org.cnpj}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground w-16">Email:</span>
                      <span className="truncate">{org.email}</span>
                    </div>
                    {org.phone && (
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-16">Tel:</span>
                        <span>{org.phone}</span>
                      </div>
                    )}
                    {(org.city || org.state) && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{org.city && org.state ? `${org.city}, ${org.state}` : org.city || org.state}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/superadmin/crm/organizations/${org.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/superadmin/crm/organizations/${org.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/superadmin/crm/organizations/${org.id}/branches`)}>
                          <Users className="h-4 w-4 mr-2" />
                          Gerenciar Filiais
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(org.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
