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
import { Shield, Users, Building, Calendar, DollarSign, TrendingUp, Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, LogOut, AlertCircle, MapPin, Star, BarChart3, PieChart, Target, Activity, FileText, Upload, Download, Settings, UserPlus, Briefcase, Phone, Mail, MessageSquare, FileSpreadsheet, Kanban, List, ArrowRight, ArrowLeft, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  exportData,
  formatFunnelsForExport,
  formatLeadsForExport,
  formatContactsForExport,
  formatOrganizationsForExport,
  formatActivitiesForExport,
  type ExportFormat,
} from '@/lib/export-utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CRMPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [funnels, setFunnels] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({
    funnels: [],
    leads: [],
    contacts: [],
    organizations: [],
    activities: [],
  });
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState<any>(null);
  const [viewModalType, setViewModalType] = useState<'lead' | 'contact' | 'organization' | 'activity' | null>(null);
  const [exportType, setExportType] = useState<'funnels' | 'leads' | 'contacts' | 'organizations' | 'activities'>('funnels');
  const [funnelSearchTerm, setFunnelSearchTerm] = useState('');
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Search and filter states for leads
  const [leadsSearchTerm, setLeadsSearchTerm] = useState('');
  const [selectedFunnelFilter, setSelectedFunnelFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState<any>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [leadComments, setLeadComments] = useState<any[]>([]);
  const [leadHistory, setLeadHistory] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
        loadCRMData();
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const loadCRMData = () => {
    // Initialize CRM data if not exists
    if (!localStorage.getItem('crmFunnels')) {
      const defaultFunnels = [
        {
          id: '1',
          name: 'Vendas Imóveis',
          description: 'Funil principal para vendas de imóveis',
          stages: [
            { id: '1', name: 'Lead', order: 1, color: '#3b82f6' },
            { id: '2', name: 'Qualificado', order: 2, color: '#8b5cf6' },
            { id: '3', name: 'Proposta', order: 3, color: '#f59e0b' },
            { id: '4', name: 'Negociação', order: 4, color: '#ef4444' },
            { id: '5', name: 'Fechado', order: 5, color: '#10b981' },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Hospedagem',
          description: 'Funil para reservas de hospedagem',
          stages: [
            { id: '6', name: 'Interesse', order: 1, color: '#3b82f6' },
            { id: '7', name: 'Reserva', order: 2, color: '#10b981' },
            { id: '8', name: 'Check-in', order: 3, color: '#f59e0b' },
            { id: '9', name: 'Finalizado', order: 4, color: '#6b7280' },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('crmFunnels', JSON.stringify(defaultFunnels));
    }

    if (!localStorage.getItem('crmLeads')) {
      const defaultLeads = [
        {
          id: '1',
          title: 'João Silva - Apartamento Ipanema',
          type: 'Compra',
          category: 'Apartamento',
          estimatedValue: 1200000,
          funnelId: '1',
          stageId: '2',
          organizationId: null,
          contactId: '1',
          status: 'active',
          createdAt: new Date().toISOString(),
          notes: 'Cliente interessado em apartamento com vista para o mar',
          attachments: [],
          activities: [],
        },
        {
          id: '2',
          title: 'Maria Santos - Casa Barra',
          type: 'Hospedagem',
          category: 'Casa',
          estimatedValue: 2500,
          funnelId: '2',
          stageId: '6',
          organizationId: null,
          contactId: '2',
          status: 'active',
          createdAt: new Date().toISOString(),
          notes: 'Reserva para família com 2 crianças',
          attachments: [],
          activities: [],
        },
      ];
      localStorage.setItem('crmLeads', JSON.stringify(defaultLeads));
    }

    if (!localStorage.getItem('crmContacts')) {
      const defaultContacts = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(21) 99999-9999',
          type: 'person',
          organizationId: null,
          customFields: {},
          notes: '',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(11) 88888-8888',
          type: 'person',
          organizationId: null,
          customFields: {},
          notes: '',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('crmContacts', JSON.stringify(defaultContacts));
    }

    if (!localStorage.getItem('crmOrganizations')) {
      localStorage.setItem('crmOrganizations', JSON.stringify([]));
    }

    if (!localStorage.getItem('crmActivities')) {
      localStorage.setItem('crmActivities', JSON.stringify([]));
    }

    // Load all data
    setFunnels(JSON.parse(localStorage.getItem('crmFunnels') || '[]'));
    setLeads(JSON.parse(localStorage.getItem('crmLeads') || '[]'));
    setContacts(JSON.parse(localStorage.getItem('crmContacts') || '[]'));
    setOrganizations(JSON.parse(localStorage.getItem('crmOrganizations') || '[]'));
    setActivities(JSON.parse(localStorage.getItem('crmActivities') || '[]'));
    
    // Load properties from all sources
    const publishedProperties = JSON.parse(localStorage.getItem('publishedProperties') || '[]');
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    const rejectedProperties = JSON.parse(localStorage.getItem('rejectedProperties') || '[]');
    
    const allProperties = [
      ...publishedProperties.map((p: any) => ({ ...p, status: 'published' })),
      ...pendingProperties.map((p: any) => ({ ...p, status: 'pending' })),
      ...rejectedProperties.map((p: any) => ({ ...p, status: 'rejected' }))
    ];
    setProperties(allProperties);
  };

  const deleteFunnel = (funnelId: string) => {
    if (confirm('Tem certeza que deseja excluir este funil? Todos os leads vinculados serão removidos.')) {
      const updatedFunnels = funnels.filter(f => f.id !== funnelId);
      localStorage.setItem('crmFunnels', JSON.stringify(updatedFunnels));
      
      // Remove leads from this funnel
      const updatedLeads = leads.filter(l => l.funnelId !== funnelId);
      localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));
      
      loadCRMData();
    }
  };

  const deleteLead = (leadId: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      const updatedLeads = leads.filter(l => l.id !== leadId);
      localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));
      loadCRMData();
    }
  };

  const deleteOrganization = (orgId: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      const updatedOrgs = organizations.filter(o => o.id !== orgId);
      localStorage.setItem('crmOrganizations', JSON.stringify(updatedOrgs));
      loadCRMData();
    }
  };

  const markLeadAsWon = (leadId: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: 'won' } : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
  };

  const markLeadAsLost = (leadId: string) => {
    const reason = prompt('Motivo da perda:');
    if (reason) {
      const updatedLeads = leads.map(lead => 
        lead.id === leadId ? { ...lead, status: 'lost', lossReason: reason } : lead
      );
      localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));
      setLeads(updatedLeads);
    }
  };

  const completeActivity = (activityId: string) => {
    const updatedActivities = activities.map(activity => 
      activity.id === activityId ? { 
        ...activity, 
        status: 'completed',
        completedAt: new Date().toISOString()
      } : activity
    );
    localStorage.setItem('crmActivities', JSON.stringify(updatedActivities));
    loadCRMData();
  };

  const handleSelectItem = (type: string, itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].includes(itemId)
        ? prev[type].filter(id => id !== itemId)
        : [...prev[type], itemId]
    }));
  };

  const handleSelectAll = (type: string, items: any[]) => {
    const allIds = items.map(item => item.id);
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].length === allIds.length ? [] : allIds
    }));
  };

  const handleExport = (format: ExportFormat) => {
    try {
      const selectedIds = selectedItems[exportType];
      let dataToExport: any[] = [];
      let filename = '';

      switch (exportType) {
        case 'funnels':
          const funnelsToExport = selectedIds.length > 0 
            ? funnels.filter(f => selectedIds.includes(f.id))
            : funnels;
          dataToExport = formatFunnelsForExport(funnelsToExport, leads);
          filename = `funis_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'leads':
          const leadsToExport = selectedIds.length > 0 
            ? leads.filter(l => selectedIds.includes(l.id))
            : leads;
          dataToExport = formatLeadsForExport(leadsToExport, funnels, contacts);
          filename = `leads_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'contacts':
          const contactsToExport = selectedIds.length > 0 
            ? contacts.filter(c => selectedIds.includes(c.id))
            : contacts;
          dataToExport = formatContactsForExport(contactsToExport);
          filename = `contatos_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'organizations':
          const orgsToExport = selectedIds.length > 0 
            ? organizations.filter(o => selectedIds.includes(o.id))
            : organizations;
          dataToExport = formatOrganizationsForExport(orgsToExport);
          filename = `empresas_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'activities':
          const activitiesToExport = selectedIds.length > 0 
            ? activities.filter(a => selectedIds.includes(a.id))
            : activities;
          dataToExport = formatActivitiesForExport(activitiesToExport, leads, contacts);
          filename = `atividades_${new Date().toISOString().split('T')[0]}`;
          break;
      }

      if (dataToExport.length === 0) {
        alert('Nenhum item selecionado para exportar.');
        return;
      }

      exportData(dataToExport, filename, format);
      setIsExportDialogOpen(false);
      setSelectedItems(prev => ({ ...prev, [exportType]: [] }));
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  // Calculate real stats
  const stats = {
    totalLeads: leads.length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0,
    wonRevenue: leads.filter(l => l.status === 'won').reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0),
    activitiesToday: activities.filter(a => {
      if (!a.dueDate) return false;
      const today = new Date().toDateString();
      return new Date(a.dueDate).toDateString() === today;
    }).length,
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = leadsSearchTerm === '' || 
      lead.title.toLowerCase().includes(leadsSearchTerm.toLowerCase()) ||
      lead.type.toLowerCase().includes(leadsSearchTerm.toLowerCase()) ||
      (lead.category && lead.category.toLowerCase().includes(leadsSearchTerm.toLowerCase()));
    
    const matchesFunnel = selectedFunnelFilter === 'all' || lead.funnelId === selectedFunnelFilter;
    const matchesStatus = selectedStatusFilter === 'all' || lead.status === selectedStatusFilter;
    
    return matchesSearch && matchesFunnel && matchesStatus;
  });

  const loadLeadHistory = (leadId: string) => {
    // Load comments for this lead
    const comments = JSON.parse(localStorage.getItem(`leadComments_${leadId}`) || '[]');
    setLeadComments(comments);
    
    // Load history for this lead
    const history = JSON.parse(localStorage.getItem(`leadHistory_${leadId}`) || '[]');
    setLeadHistory(history);
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedLeadForHistory) return;
    
    setIsAddingComment(true);
    
    try {
      const comment = {
        id: Date.now().toString(),
        content: newComment,
        author: user.name,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        type: 'comment',
      };
      
      const updatedComments = [...leadComments, comment];
      localStorage.setItem(`leadComments_${selectedLeadForHistory.id}`, JSON.stringify(updatedComments));
      setLeadComments(updatedComments);
      
      // Add to history
      const historyEntry = {
        id: Date.now().toString(),
        action: 'comment_added',
        description: `Comentário adicionado: "${newComment.substring(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
        author: user.name,
        createdAt: new Date().toISOString(),
      };
      
      const updatedHistory = [...leadHistory, historyEntry];
      localStorage.setItem(`leadHistory_${selectedLeadForHistory.id}`, JSON.stringify(updatedHistory));
      setLeadHistory(updatedHistory);
      
      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const attachPropertyToLead = (leadId: string, propertyId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const attachedProperties = lead.attachedProperties || [];
    if (attachedProperties.includes(propertyId)) return;
    
    const updatedLead = {
      ...lead,
      attachedProperties: [...attachedProperties, propertyId]
    };
    
    const updatedLeads = leads.map(l => l.id === leadId ? updatedLead : l);
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    
    // Add to history
    const property = properties.find(p => p.id === propertyId);
    const historyEntry = {
      id: Date.now().toString(),
      action: 'property_attached',
      description: `Imóvel anexado: ${property?.title || 'Imóvel'}`,
      author: user.name,
      createdAt: new Date().toISOString(),
    };
    
    const currentHistory = JSON.parse(localStorage.getItem(`leadHistory_${leadId}`) || '[]');
    localStorage.setItem(`leadHistory_${leadId}`, JSON.stringify([...currentHistory, historyEntry]));
  };

  const attachActivityToLead = (leadId: string, activityId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const attachedActivities = lead.attachedActivities || [];
    if (attachedActivities.includes(activityId)) return;
    
    const updatedLead = {
      ...lead,
      attachedActivities: [...attachedActivities, activityId]
    };
    
    const updatedLeads = leads.map(l => l.id === leadId ? updatedLead : l);
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    
    // Add to history
    const activity = activities.find(a => a.id === activityId);
    const historyEntry = {
      id: Date.now().toString(),
      action: 'activity_attached',
      description: `Atividade anexada: ${activity?.title || 'Atividade'}`,
      author: user.name,
      createdAt: new Date().toISOString(),
    };
    
    const currentHistory = JSON.parse(localStorage.getItem(`leadHistory_${leadId}`) || '[]');
    localStorage.setItem(`leadHistory_${leadId}`, JSON.stringify([...currentHistory, historyEntry]));
  };

  const openLeadHistory = (lead: any) => {
    setSelectedLeadForHistory(lead);
    loadLeadHistory(lead.id);
    setIsHistoryModalOpen(true);
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
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Target className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">CRM</h1>
              <p className="text-xs text-muted-foreground">Customer Relationship Management</p>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="funnels">Funis</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="organizations">Empresas</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Leads</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalLeads}</p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-foreground">{stats.conversionRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Ganho</p>
                      <p className="text-2xl font-bold text-foreground">
                        R$ {(stats.wonRevenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Atividades Hoje</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activitiesToday}</p>
                    </div>
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversão por Funil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {funnels.map((funnel) => {
                      const funnelLeads = leads.filter(l => l.funnelId === funnel.id);
                      const conversionRate = funnelLeads.length > 0 
                        ? (funnelLeads.filter(l => l.status === 'won').length / funnelLeads.length) * 100
                        : 0;
                      
                      return (
                        <div key={funnel.id} className="flex items-center justify-between">
                          <span className="text-sm">{funnel.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${conversionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{Math.round(conversionRate)}%</span>
                          </div>
                        </div>
                      );
                    })}
                    {funnels.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum funil criado
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('leads')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Lead
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('funnels')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Gerenciar Funis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/superadmin/crm/contacts/new')}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Contato
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/superadmin/crm/organizations/new')}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Nova Empresa
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setExportType('funnels');
                      setIsExportDialogOpen(true);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/superadmin/crm/activities/new')}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Nova Atividade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Funnels Tab */}
          <TabsContent value="funnels" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Funis de Vendas</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setExportType('funnels');
                    setIsExportDialogOpen(true);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => router.push('/superadmin/crm/funnels/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Funil
                </Button>
              </div>
            </div>

            {funnels.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum funil criado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando seu primeiro funil de vendas.
                </p>
                <Button onClick={() => router.push('/superadmin/crm/funnels/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Funil
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {funnels.map((funnel) => {
                  const isSelected = selectedItems.funnels.includes(funnel.id);
                  const funnelLeads = leads.filter(lead => lead.funnelId === funnel.id);
                  const conversionRate = funnelLeads.length > 0 
                    ? Math.round((funnelLeads.filter(lead => lead.status === 'won').length / funnelLeads.length) * 100)
                    : 0;
                  
                  return (
                    <Card key={funnel.id} className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectItem('funnels', funnel.id)}
                          />
                          <div className="flex items-center gap-2">
                            <Badge>{funnel.stages?.length || 0} etapas</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => router.push(`/superadmin/crm/funnels/${funnel.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/superadmin/crm/funnels/edit/${funnel.id}`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteFunnel(funnel.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2 cursor-pointer" 
                            onClick={() => router.push(`/superadmin/crm/funnels/${funnel.id}`)}>
                          {funnel.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {funnel.description || 'Sem descrição'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Leads:</span>
                            <div className="font-semibold">{funnelLeads.length}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conversão:</span>
                            <div className="font-semibold text-green-600">{conversionRate}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Leads</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar leads..."
                      value={leadsSearchTerm}
                      onChange={(e) => setLeadsSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedFunnelFilter} onValueChange={setSelectedFunnelFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por funil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os funis</SelectItem>
                      {funnels.map((funnel) => (
                        <SelectItem key={funnel.id} value={funnel.id}>
                          {funnel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="analyzing">Em Análise</SelectItem>
                      <SelectItem value="won">Ganhos</SelectItem>
                      <SelectItem value="lost">Perdidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => router.push('/superadmin/crm/leads/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Lead
                </Button>
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum lead criado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando seu primeiro lead.
                </p>
                <Button onClick={() => router.push('/superadmin/crm/leads/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Lead
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedItems.leads.includes(lead.id);
                  const leadFunnel = funnels.find(f => f.id === lead.funnelId);
                  const leadStage = leadFunnel?.stages?.find((s: any) => s.id === lead.stageId);
                  const leadContact = contacts.find(c => c.id === lead.contactId);
                  
                  return (
                    <Card key={lead.id} className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectItem('leads', lead.id)}
                          />
                          <Badge>{lead.type}</Badge>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                // For now, show lead details in alert
                                alert(`Lead: ${lead.title}\nTipo: ${lead.type}\nValor: R$ ${lead.estimatedValue.toLocaleString('pt-BR')}\nNotas: ${lead.notes || 'Nenhuma'}`);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/superadmin/crm/leads/${lead.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteLead(lead.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">
                          {lead.title}
                        </h3>
                        <div className="space-y-2 mb-4">
                          {lead.category && (
                            <Badge variant="secondary" className="text-xs">
                              {lead.category}
                            </Badge>
                          )}
                          <div className="flex gap-1">
                            {(lead.attachedProperties || []).length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {(lead.attachedProperties || []).length} imóvel(is)
                              </Badge>
                            )}
                            {(lead.attachedActivities || []).length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {(lead.attachedActivities || []).length} atividade(s)
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {leadStage?.name || 'Sem etapa'}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {leadContact?.name || 'Sem contato'}
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => openLeadHistory(lead)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Histórico
                          </Button>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className={`flex-1 ${
                                lead.status === 'won' 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : ''
                              }`}
                              variant={lead.status === 'won' ? 'default' : 'outline'}
                              onClick={() => markLeadAsWon(lead.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Ganho
                            </Button>
                            <Button 
                              size="sm" 
                              className={`flex-1 ${
                                lead.status === 'lost' 
                                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                                  : ''
                              }`}
                              variant={lead.status === 'lost' ? 'default' : 'outline'}
                              onClick={() => markLeadAsLost(lead.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Perda
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Contatos</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setExportType('contacts');
                    setIsExportDialogOpen(true);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </Button>
                <Button onClick={() => router.push('/superadmin/crm/contacts/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Contato
                </Button>
              </div>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum contato cadastrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece cadastrando seu primeiro contato.
                </p>
                <Button onClick={() => router.push('/superadmin/crm/contacts/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Contato
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                  <Card key={contact.id} className={`hover:shadow-lg transition-shadow ${selectedItems.contacts.includes(contact.id) ? 'ring-2 ring-primary' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Checkbox
                          checked={selectedItems.contacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectItem('contacts', contact.id)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              setViewModalData(contact);
                              setViewModalType('contact');
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/superadmin/crm/contacts/${contact.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este contato?')) {
                                const updatedContacts = contacts.filter(c => c.id !== contact.id);
                                localStorage.setItem('crmContacts', JSON.stringify(updatedContacts));
                                loadCRMData();
                              }
                            }} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {contact.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {contact.type === 'person' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/superadmin/crm/contacts/${contact.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            if (!contact.phone) {
                              alert('Este contato não possui telefone cadastrado.');
                              return;
                            }
                            const message = `Olá ${contact.name}, entro em contato da Guest to Buy...`;
                            const phoneNumber = contact.phone.replace(/\D/g, '');
                            const whatsappUrl = `https://api.whatsapp.com/send/?phone=55${phoneNumber}&text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contato
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Empresas</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setExportType('organizations');
                    setIsExportDialogOpen(true);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </Button>
                <Button onClick={() => router.push('/superadmin/crm/organizations/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </div>
            </div>

            {organizations.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhuma empresa cadastrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece cadastrando sua primeira empresa ou importe dados via CSV.
                </p>
                <Button onClick={() => router.push('/superadmin/crm/organizations/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Empresa
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Card key={org.id} className={`hover:shadow-lg transition-shadow ${selectedItems.organizations.includes(org.id) ? 'ring-2 ring-primary' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Checkbox
                          checked={selectedItems.organizations.includes(org.id)}
                          onCheckedChange={() => handleSelectItem('organizations', org.id)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              setViewModalData(org);
                              setViewModalType('organization');
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/superadmin/crm/organizations/${org.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteOrganization(org.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{org.name}</h3>
                          <p className="text-sm text-muted-foreground">{org.tradeName || org.industry}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          {org.email}
                        </div>
                        {org.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {org.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/superadmin/crm/organizations/${org.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            if (!org.phone) {
                              alert('Esta empresa não possui telefone cadastrado.');
                              return;
                            }
                            const message = `Olá, entro em contato da Guest to Buy sobre uma oportunidade de negócio...`;
                            const phoneNumber = org.phone.replace(/\D/g, '');
                            const whatsappUrl = `https://api.whatsapp.com/send/?phone=55${phoneNumber}&text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contato
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Atividades</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setExportType('activities');
                    setIsExportDialogOpen(true);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => router.push('/superadmin/crm/activities/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Atividade
                </Button>
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhuma atividade criada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando sua primeira atividade.
                </p>
                <Button onClick={() => router.push('/superadmin/crm/activities/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Atividade
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Pendentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities.filter(activity => activity.status === 'pending').length > 0 && (
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAll('activities', activities.filter(activity => activity.status === 'pending'))}
                        >
                          {selectedItems.activities.length === activities.filter(activity => activity.status === 'pending').length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                        </Button>
                      </div>
                    )}
                    <div className="space-y-4">
                      {activities.filter(activity => activity.status === 'pending').map((activity) => (
                        <div key={activity.id} className={`flex items-center gap-4 p-4 border border-border rounded-lg ${selectedItems.activities.includes(activity.id) ? 'ring-2 ring-primary' : ''}`}>
                          <Checkbox
                            checked={selectedItems.activities.includes(activity.id)}
                            onCheckedChange={() => handleSelectItem('activities', activity.id)}
                          />
                          <div className={`w-2 h-2 rounded-full ${
                            activity.priority === 'urgent' ? 'bg-red-500' :
                            activity.priority === 'high' ? 'bg-orange-500' :
                            activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            {activity.dueDate && (
                              <p className="text-xs text-muted-foreground">
                                Vence em {new Date(activity.dueDate).toLocaleDateString('pt-BR')}
                                {activity.dueTime && ` às ${activity.dueTime}`}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => {
                                  setViewModalData(activity);
                                  setViewModalType('activity');
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Toggle status between pending and completed
                                  const newStatus = activity.status === 'pending' ? 'completed' : 'pending';
                                  const updatedActivities = activities.map(a => 
                                    a.id === activity.id ? { 
                                      ...a, 
                                      status: newStatus,
                                      completedAt: newStatus === 'completed' ? new Date().toISOString() : null
                                    } : a
                                  );
                                  localStorage.setItem('crmActivities', JSON.stringify(updatedActivities));
                                  loadCRMData();
                                }}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {activity.status === 'pending' ? 'Marcar como Concluída' : 'Marcar como Pendente'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  if (confirm('Tem certeza que deseja excluir esta atividade?')) {
                                    const updatedActivities = activities.filter(a => a.id !== activity.id);
                                    localStorage.setItem('crmActivities', JSON.stringify(updatedActivities));
                                    loadCRMData();
                                  }
                                }} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => completeActivity(activity.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {activities.filter(activity => activity.status === 'pending').length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhuma atividade pendente
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities.filter(activity => activity.status === 'completed').length > 0 && (
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAll('activities', activities.filter(activity => activity.status === 'completed'))}
                        >
                          {selectedItems.activities.filter(id => activities.find(a => a.id === id && a.status === 'completed')).length === activities.filter(activity => activity.status === 'completed').length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                        </Button>
                      </div>
                    )}
                    <div className="space-y-4">
                      {activities.filter(activity => activity.status === 'completed').slice(0, 5).map((activity) => (
                        <div key={activity.id} className={`flex items-center gap-4 p-4 bg-muted/30 rounded-lg ${selectedItems.activities.includes(activity.id) ? 'ring-2 ring-primary' : ''}`}>
                          <Checkbox
                            checked={selectedItems.activities.includes(activity.id)}
                            onCheckedChange={() => handleSelectItem('activities', activity.id)}
                          />
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            {activity.completedAt && (
                              <p className="text-xs text-muted-foreground">
                                Concluída em {new Date(activity.completedAt).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => {
                                  setViewModalData(activity);
                                  setViewModalType('activity');
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Toggle status between completed and pending
                                  const newStatus = 'pending';
                                  const updatedActivities = activities.map(a => 
                                    a.id === activity.id ? { 
                                      ...a, 
                                      status: newStatus,
                                      completedAt: null
                                    } : a
                                  );
                                  localStorage.setItem('crmActivities', JSON.stringify(updatedActivities));
                                  loadCRMData();
                                }}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Marcar como Pendente
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  if (confirm('Tem certeza que deseja excluir esta atividade?')) {
                                    const updatedActivities = activities.filter(a => a.id !== activity.id);
                                    localStorage.setItem('crmActivities', JSON.stringify(updatedActivities));
                                    loadCRMData();
                                  }
                                }} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      {activities.filter(activity => activity.status === 'completed').length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhuma atividade concluída
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar {
              exportType === 'funnels' ? 'Funis' :
              exportType === 'leads' ? 'Leads' :
              exportType === 'contacts' ? 'Contatos' :
              exportType === 'organizations' ? 'Empresas' :
              'Atividades'
            }</DialogTitle>
            <DialogDescription>
              {selectedItems[exportType].length > 0 
                ? `${selectedItems[exportType].length} item(s) selecionado(s) para exportação`
                : 'Todos os itens serão exportados'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleExport('xlsx')}
                className="flex items-center justify-center"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel (.xlsx)
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExport('csv')}
                className="flex items-center justify-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                CSV (.csv)
              </Button>
            </div>
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setIsExportDialogOpen(false)}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead History Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Histórico do Lead: {selectedLeadForHistory?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
            {/* Lead Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações do Lead</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Tipo</Label>
                    <Badge variant="outline" className="block w-fit">{selectedLeadForHistory?.type}</Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Valor</Label>
                    <p className="font-semibold">R$ {selectedLeadForHistory?.estimatedValue?.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge variant={selectedLeadForHistory?.status === 'won' ? 'default' : 'secondary'}>
                      {selectedLeadForHistory?.status === 'won' ? 'Ganho' : 
                       selectedLeadForHistory?.status === 'lost' ? 'Perdido' : 'Ativo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Attached Properties */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Imóveis Anexados</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64">
                        {properties.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            Nenhum imóvel disponível
                          </div>
                        ) : (
                          properties.slice(0, 10).map((property) => (
                            <DropdownMenuItem 
                              key={property.id}
                              onClick={() => attachPropertyToLead(selectedLeadForHistory?.id, property.id)}
                              disabled={(selectedLeadForHistory?.attachedProperties || []).includes(property.id)}
                            >
                              <Building className="h-4 w-4 mr-2" />
                              <div className="flex-1 truncate">
                                <div className="text-sm font-medium truncate">{property.title}</div>
                                <div className="text-xs text-muted-foreground">{property.location}</div>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(selectedLeadForHistory?.attachedProperties || []).map((propertyId: string) => {
                      const property = properties.find(p => p.id === propertyId);
                      return property ? (
                        <div key={propertyId} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                          <Building className="h-4 w-4 text-primary" />
                          <div className="flex-1 truncate">
                            <div className="font-medium truncate">{property.title}</div>
                            <div className="text-xs text-muted-foreground">{property.location}</div>
                          </div>
                        </div>
                      ) : null;
                    })}
                    {(selectedLeadForHistory?.attachedProperties || []).length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum imóvel anexado</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Attached Activities */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Atividades Anexadas</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64">
                        {activities.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            Nenhuma atividade disponível
                          </div>
                        ) : (
                          activities.slice(0, 10).map((activity) => (
                            <DropdownMenuItem 
                              key={activity.id}
                              onClick={() => attachActivityToLead(selectedLeadForHistory?.id, activity.id)}
                              disabled={(selectedLeadForHistory?.attachedActivities || []).includes(activity.id)}
                            >
                              <Activity className="h-4 w-4 mr-2" />
                              <div className="flex-1 truncate">
                                <div className="text-sm font-medium truncate">{activity.title}</div>
                                <div className="text-xs text-muted-foreground">{activity.type}</div>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(selectedLeadForHistory?.attachedActivities || []).map((activityId: string) => {
                      const activity = activities.find(a => a.id === activityId);
                      return activity ? (
                        <div key={activityId} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                          <Activity className="h-4 w-4 text-primary" />
                          <div className="flex-1 truncate">
                            <div className="font-medium truncate">{activity.title}</div>
                            <div className="text-xs text-muted-foreground">{activity.type}</div>
                          </div>
                        </div>
                      ) : null;
                    })}
                    {(selectedLeadForHistory?.attachedActivities || []).length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhuma atividade anexada</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History Timeline */}
            <div className="space-y-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Histórico de Ações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {leadHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhuma ação registrada
                      </p>
                    ) : (
                      leadHistory.map((entry) => (
                        <div key={entry.id} className="flex gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{entry.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{entry.author}</span>
                              <span>•</span>
                              <span>{new Date(entry.createdAt).toLocaleDateString('pt-BR')}</span>
                              <span>{new Date(entry.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base">Comentários</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 space-y-4 max-h-64 overflow-y-auto mb-4">
                    {leadComments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhum comentário ainda
                      </p>
                    ) : (
                      leadComments.map((comment) => (
                        <div key={comment.id} className="space-y-2">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm text-foreground">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">{comment.author}</span>
                            <span>•</span>
                            <span>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
                            <span>{new Date(comment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add Comment */}
                  <div className="space-y-3 border-t pt-4">
                    <Textarea
                      placeholder="Adicionar comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={addComment}
                        disabled={!newComment.trim() || isAddingComment}
                        className="flex-1"
                      >
                        {isAddingComment ? 'Enviando...' : 'Comentar'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewModalType !== null} onOpenChange={() => {
        setViewModalType(null);
        setViewModalData(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {viewModalType === 'lead' && viewModalData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Detalhes do Lead
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Título</Label>
                    <p className="text-foreground">{viewModalData.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <Badge variant="outline">{viewModalData.type}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                    <p className="text-foreground">{viewModalData.category || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Valor Estimado</Label>
                    <p className="text-foreground font-semibold">R$ {viewModalData.estimatedValue?.toLocaleString('pt-BR') || '0'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge 
                      variant={
                        viewModalData.status === 'won' ? 'default' : 
                        viewModalData.status === 'analyzing' ? 'secondary' : 
                        viewModalData.status === 'lost' ? 'destructive' : 'outline'
                      }
                    >
                      {viewModalData.status === 'won' ? 'Ganho' : 
                       viewModalData.status === 'analyzing' ? 'Em Análise' : 
                       viewModalData.status === 'lost' ? 'Perdido' : 'Ativo'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Prioridade</Label>
                    <Badge variant="outline">
                      {viewModalData.priority === 'high' ? 'Alta' : 
                       viewModalData.priority === 'low' ? 'Baixa' : 'Média'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Funil</Label>
                    <p className="text-foreground">
                      {funnels.find(f => f.id === viewModalData.funnelId)?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Etapa</Label>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const funnel = funnels.find(f => f.id === viewModalData.funnelId);
                        const stage = funnel?.stages?.find((s: any) => s.id === viewModalData.stageId);
                        return stage ? (
                          <>
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <span className="text-foreground">{stage.name}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contato</Label>
                    <p className="text-foreground">
                      {contacts.find(c => c.id === viewModalData.contactId)?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Origem</Label>
                    <p className="text-foreground">{viewModalData.source || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                  <p className="text-foreground">
                    {viewModalData.createdAt ? new Date(viewModalData.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>

                {viewModalData.notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-foreground text-sm">{viewModalData.notes}</p>
                    </div>
                  </div>
                )}

                {viewModalData.lossReason && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Motivo da Perda</Label>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-red-700 dark:text-red-300 text-sm">{viewModalData.lossReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {viewModalType === 'contact' && viewModalData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Detalhes do Contato
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                    <p className="text-foreground font-semibold">{viewModalData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <Badge variant="outline">
                      {viewModalData.type === 'person' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-foreground">{viewModalData.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                    <p className="text-foreground">{viewModalData.phone || 'N/A'}</p>
                  </div>
                </div>

                {viewModalData.type === 'person' && (viewModalData.company || viewModalData.position) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Empresa</Label>
                      <p className="text-foreground">{viewModalData.company || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cargo</Label>
                      <p className="text-foreground">{viewModalData.position || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {(viewModalData.address || viewModalData.city || viewModalData.state) && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-foreground text-sm">
                        {[
                          viewModalData.address,
                          viewModalData.neighborhood,
                          viewModalData.city,
                          viewModalData.state,
                          viewModalData.zipCode
                        ].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Origem</Label>
                  <p className="text-foreground">{viewModalData.source || 'N/A'}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                  <p className="text-foreground">
                    {viewModalData.createdAt ? new Date(viewModalData.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>

                {viewModalData.notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-foreground text-sm">{viewModalData.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {viewModalType === 'organization' && viewModalData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Detalhes da Empresa
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                    <p className="text-foreground font-semibold">{viewModalData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome Fantasia</Label>
                    <p className="text-foreground">{viewModalData.tradeName || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                    <p className="text-foreground font-mono">{viewModalData.cnpj || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-foreground">{viewModalData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                    <p className="text-foreground">{viewModalData.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                    <p className="text-foreground">{viewModalData.website || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                    <Badge variant="outline">
                      {viewModalData.industry === 'real-estate' ? 'Imobiliário' :
                       viewModalData.industry === 'construction' ? 'Construção' :
                       viewModalData.industry === 'finance' ? 'Financeiro' :
                       viewModalData.industry === 'technology' ? 'Tecnologia' :
                       viewModalData.industry === 'retail' ? 'Varejo' :
                       viewModalData.industry === 'services' ? 'Serviços' :
                       viewModalData.industry || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Porte</Label>
                    <Badge variant="outline">
                      {viewModalData.size === 'micro' ? 'Microempresa' :
                       viewModalData.size === 'small' ? 'Pequena' :
                       viewModalData.size === 'medium' ? 'Média' :
                       viewModalData.size === 'large' ? 'Grande' :
                       viewModalData.size || 'N/A'}
                    </Badge>
                  </div>
                </div>

                {(viewModalData.address || viewModalData.city || viewModalData.state) && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-foreground text-sm">
                        {[
                          viewModalData.address,
                          viewModalData.neighborhood,
                          viewModalData.city,
                          viewModalData.state,
                          viewModalData.zipCode
                        ].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Origem</Label>
                  <p className="text-foreground">{viewModalData.source || 'N/A'}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                  <p className="text-foreground">
                    {viewModalData.createdAt ? new Date(viewModalData.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>

                {viewModalData.notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-foreground text-sm">{viewModalData.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {viewModalType === 'activity' && viewModalData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Detalhes da Atividade
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Título</Label>
                    <p className="text-foreground font-semibold">{viewModalData.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <Badge variant="outline">
                      {viewModalData.type === 'call' ? 'Ligação' :
                       viewModalData.type === 'meeting' ? 'Reunião' :
                       viewModalData.type === 'email' ? 'Email' :
                       viewModalData.type === 'task' ? 'Tarefa' :
                       viewModalData.type === 'visit' ? 'Visita' :
                       viewModalData.type === 'follow-up' ? 'Follow-up' :
                       viewModalData.type === 'presentation' ? 'Apresentação' :
                       viewModalData.type === 'negotiation' ? 'Negociação' :
                       viewModalData.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge variant={viewModalData.status === 'completed' ? 'default' : 'secondary'}>
                      {viewModalData.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Prioridade</Label>
                    <Badge 
                      variant={
                        viewModalData.priority === 'urgent' ? 'destructive' :
                        viewModalData.priority === 'high' ? 'default' :
                        'outline'
                      }
                    >
                      {viewModalData.priority === 'urgent' ? 'Urgente' :
                       viewModalData.priority === 'high' ? 'Alta' :
                       viewModalData.priority === 'low' ? 'Baixa' : 'Média'}
                    </Badge>
                  </div>
                </div>

                {viewModalData.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-foreground text-sm">{viewModalData.description}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Lead Relacionado</Label>
                    <p className="text-foreground">
                      {leads.find(l => l.id === viewModalData.leadId)?.title || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contato Relacionado</Label>
                    <p className="text-foreground">
                      {contacts.find(c => c.id === viewModalData.contactId)?.name || 'N/A'}
                    </p>
                  </div>
                </div>

                {(viewModalData.dueDate || viewModalData.dueTime) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Data de Vencimento</Label>
                      <p className="text-foreground">
                        {viewModalData.dueDate ? new Date(viewModalData.dueDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Horário</Label>
                      <p className="text-foreground">{viewModalData.dueTime || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {(viewModalData.location || viewModalData.duration) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Local</Label>
                      <p className="text-foreground">{viewModalData.location || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Duração</Label>
                      <p className="text-foreground">
                        {viewModalData.duration ? `${viewModalData.duration} minutos` : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                  <p className="text-foreground">
                    {viewModalData.createdAt ? new Date(viewModalData.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>

                {viewModalData.completedAt && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Conclusão</Label>
                    <p className="text-foreground">
                      {new Date(viewModalData.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                {viewModalData.checklist && viewModalData.checklist.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Checklist</Label>
                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      {viewModalData.checklist.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            item.completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
                          }`}>
                            {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}