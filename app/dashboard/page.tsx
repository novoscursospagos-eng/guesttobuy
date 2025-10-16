'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  Calendar,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
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

  if (!user) {
    return null;
  }

  const getUserTypeLabel = (role: string) => {
    switch (role) {
      case 'host': return 'Proprietário';
      case 'guest': return 'Hóspede';
      case 'realtor': return 'Imobiliária';
      case 'furniture_supplier': return 'Fornecedor de Móveis';
      default: return 'Usuário';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Home className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Guest to Buy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              {getUserTypeLabel(user.role)}
            </Badge>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>
                {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button variant="default" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            {user.role === 'host' && (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/properties/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Imóvel
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservas
                </Button>
              </>
            )}
            {user.role === 'guest' && (
              <>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Minhas Reservas
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritos
                </Button>
              </>
            )}
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/messages')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Mensagens
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Bem-vindo, {user.name}!
              </h2>
              <p className="text-muted-foreground">
                Aqui está um resumo da sua atividade na plataforma.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.role === 'host' && (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Imóveis Ativos</p>
                          <p className="text-2xl font-bold text-foreground">3</p>
                        </div>
                        <Home className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Reservas Este Mês</p>
                          <p className="text-2xl font-bold text-foreground">12</p>
                        </div>
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Receita Este Mês</p>
                          <p className="text-2xl font-bold text-foreground">R$ 8.4K</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {user.role === 'guest' && (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Reservas Realizadas</p>
                          <p className="text-2xl font-bold text-foreground">5</p>
                        </div>
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Imóveis Favoritos</p>
                          <p className="text-2xl font-bold text-foreground">8</p>
                        </div>
                        <Heart className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Próxima Viagem</p>
                          <p className="text-2xl font-bold text-foreground">15 dias</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Suas últimas ações na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {user.role === 'host' 
                          ? 'Nova reserva recebida para Apartamento em Ipanema'
                          : 'Reserva confirmada para Casa na Barra da Tijuca'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">2 horas atrás</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {user.role === 'host' 
                          ? 'Imóvel atualizado com novas fotos'
                          : 'Novo imóvel adicionado aos favoritos'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">1 dia atrás</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        Mensagem recebida de um interessado
                      </p>
                      <p className="text-xs text-muted-foreground">2 dias atrás</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {user.role === 'host' && (
                    <>
                      <Button className="h-20 flex-col" onClick={() => router.push('/dashboard/properties/new')}>
                        <Plus className="h-6 w-6 mb-2" />
                        Cadastrar Imóvel
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Calendar className="h-6 w-6 mb-2" />
                        Ver Reservas
                      </Button>
                    </>
                  )}
                  {user.role === 'guest' && (
                    <>
                      <Button className="h-20 flex-col" onClick={() => router.push('/properties')}>
                        <Home className="h-6 w-6 mb-2" />
                        Buscar Imóveis
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Heart className="h-6 w-6 mb-2" />
                        Meus Favoritos
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/dashboard/messages')}>
                    <MessageCircle className="h-6 w-6 mb-2" />
                    Mensagens
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="h-6 w-6 mb-2" />
                    Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}