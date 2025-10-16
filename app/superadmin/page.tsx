'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Users,
  Home,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  AlertCircle,
  MapPin,
  Star,
  Target,
  Bed,
  Bath,
  Square,
  UsersIcon,
  Building,
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  images?: string[];
  dailyPrice: number;
  salePrice: number;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  maxGuests: number;
  availability: string;
  type: string;
  createdAt?: string;
  featured?: boolean;
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  publishedAt?: string;
  ownerName?: string;
  ownerEmail?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

interface Booking {
  id: string;
  propertyTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function SuperAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const router = useRouter();

  // Get all properties from localStorage
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
        loadData();
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const loadData = () => {
    // Load properties
    const publishedProperties = JSON.parse(localStorage.getItem('publishedProperties') || '[]');
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    const rejectedProperties = JSON.parse(localStorage.getItem('rejectedProperties') || '[]');
    
    const combinedProperties = [
      ...publishedProperties.map((p: Property) => ({ ...p, status: 'published' })),
      ...pendingProperties.map((p: Property) => ({ ...p, status: 'pending' })),
      ...rejectedProperties.map((p: Property) => ({ ...p, status: 'rejected' }))
    ];
    
    setAllProperties(combinedProperties);

    // Load mock users
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        role: 'host',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-01-20T14:30:00Z',
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        role: 'guest',
        status: 'active',
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-19T16:45:00Z',
      },
    ];
    setUsers(mockUsers);

    // Load mock bookings
    const mockBookings: Booking[] = [
      {
        id: 'GTB1705834567890',
        propertyTitle: 'Apartamento Moderno em Ipanema',
        guestName: 'Carlos Roberto',
        checkIn: '2024-02-01',
        checkOut: '2024-02-05',
        total: 1400,
        status: 'Confirmada',
        createdAt: '2024-01-20T10:30:00Z',
      },
    ];
    setBookings(mockBookings);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handlePropertyStatusChange = (propertyId: string, newStatus: 'published' | 'rejected') => {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;

    // Remove from current status array
    const currentStatusKey = `${property.status}Properties`;
    const currentArray = JSON.parse(localStorage.getItem(currentStatusKey) || '[]');
    const filteredArray = currentArray.filter((p: Property) => p.id !== propertyId);
    localStorage.setItem(currentStatusKey, JSON.stringify(filteredArray));

    // Add to new status array
    const newStatusKey = `${newStatus}Properties`;
    const newArray = JSON.parse(localStorage.getItem(newStatusKey) || '[]');
    const updatedProperty = { 
      ...property, 
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toISOString() : undefined
    };
    newArray.push(updatedProperty);
    localStorage.setItem(newStatusKey, JSON.stringify(newArray));

    // Reload data
    loadData();
  };

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProperty = () => {
    if (!propertyToDelete) return;

    const statusKey = `${propertyToDelete.status}Properties`;
    const currentArray = JSON.parse(localStorage.getItem(statusKey) || '[]');
    const filteredArray = currentArray.filter((p: Property) => p.id !== propertyToDelete.id);
    localStorage.setItem(statusKey, JSON.stringify(filteredArray));

    setIsDeleteDialogOpen(false);
    setPropertyToDelete(null);
    loadData();
  };

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalProperties: allProperties.length,
    publishedProperties: allProperties.filter(p => p.status === 'published').length,
    pendingProperties: allProperties.filter(p => p.status === 'pending').length,
    totalUsers: users.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.total, 0),
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Super Admin</h1>
              <p className="text-xs text-muted-foreground">Guest to Buy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="destructive">
              Super Admin
            </Badge>
            <Avatar className="h-8 w-8">
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="organizations">Organizações</TabsTrigger>
            <TabsTrigger value="properties">Todos os Imóveis</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Imóveis</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalProperties}</p>
                    </div>
                    <Home className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Imóveis Publicados</p>
                      <p className="text-2xl font-bold text-foreground">{stats.publishedProperties}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
                      <p className="text-2xl font-bold text-foreground">{stats.pendingProperties}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => router.push('/superadmin/properties/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Novo Imóvel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Usuários
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Todas as Reservas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/superadmin/crm')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Acessar CRM
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/superadmin/crm/organizations')}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Gerenciar Organizações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reservas este mês</span>
                    <span className="font-semibold">{stats.totalBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Receita total</span>
                    <span className="font-semibold">R$ {stats.totalRevenue.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Taxa de ocupação</span>
                    <span className="font-semibold">87%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Organizações</h2>
              <Button onClick={() => router.push('/superadmin/crm/organizations/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Organização
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/superadmin/crm/organizations')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Organizações Matriz</CardTitle>
                    <Building className="h-8 w-8 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gerencie as empresas matriz com IDs Master e suas respectivas filiais.
                  </p>
                  <Button variant="outline" className="w-full">
                    Acessar
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/superadmin/crm')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">CRM Completo</CardTitle>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Acesse o CRM com funnels, leads, contatos e atividades.
                  </p>
                  <Button variant="outline" className="w-full">
                    Acessar
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Estrutura Hierárquica</CardTitle>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>ID Master: Organização Matriz</span>
                    </div>
                    <div className="flex items-center ml-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Sub-ID: Filiais</span>
                    </div>
                    <div className="flex items-center ml-8">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                      <span>Sub-ID: Corretores</span>
                    </div>
                    <div className="flex items-center ml-8">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span>Sub-ID: Imóveis</span>
                    </div>
                    <div className="flex items-center ml-8">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                      <span>Sub-ID: Compradores</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Todos os Imóveis</h2>
              <Button onClick={() => router.push('/superadmin/properties/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Imóvel
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar imóveis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Properties Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imóvel</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Preços</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={property.images?.[0] || property.image}
                              alt={property.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-foreground">{property.title}</p>
                              <p className="text-sm text-muted-foreground">{property.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">R$ {property.dailyPrice}/noite</p>
                            <p className="text-sm text-muted-foreground">
                              R$ {(property.salePrice / 1000000).toFixed(1)}M
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              property.status === 'published'
                                ? 'default'
                                : property.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {property.status === 'published' && 'Publicado'}
                            {property.status === 'pending' && 'Pendente'}
                            {property.status === 'rejected' && 'Rejeitado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground">
                            {new Date(property.publishedAt || property.createdAt || '').toLocaleDateString('pt-BR')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/properties/${property.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/superadmin/properties/${property.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {property.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePropertyStatusChange(property.id, 'published')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePropertyStatusChange(property.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProperty(property)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Usuários</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.role === 'host' ? 'Proprietário' : 'Hóspede'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                          >
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Reservas</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserva</TableHead>
                      <TableHead>Hóspede</TableHead>
                      <TableHead>Datas</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{booking.id}</p>
                            <p className="text-sm text-muted-foreground">{booking.propertyTitle}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">{booking.guestName}</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">Check-in: {new Date(booking.checkIn).toLocaleDateString('pt-BR')}</p>
                            <p className="text-sm">Check-out: {new Date(booking.checkOut).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold">R$ {booking.total.toLocaleString('pt-BR')}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{booking.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o imóvel "{propertyToDelete?.title}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProperty}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}