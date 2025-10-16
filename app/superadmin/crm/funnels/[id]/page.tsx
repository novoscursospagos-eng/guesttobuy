'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label as FormLabel } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MoreHorizontal,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Kanban,
  List,
  Settings,
  Eye,
  X,
  Send,
  Paperclip,
  Home as HomeIcon,
  Calendar,
  User,
  Building,
  Activity,
  MessageCircle,
  FileText,
  Plus,
  LogOut,
  Shield,
} from 'lucide-react';

export default function FunnelDetailPage(): JSX.Element {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [funnel, setFunnel] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [leadComments, setLeadComments] = useState<any[]>([]);
  const [leadHistory, setLeadHistory] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const router = useRouter();
  const params = useParams();

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
    setLoading(false);
  }, [router, params.id]);

  const loadData = () => {
    // Load funnel
    const funnels = JSON.parse(localStorage.getItem('crmFunnels') || '[]');
    const foundFunnel = funnels.find((f: any) => f.id === params.id);
    setFunnel(foundFunnel);

    // Load all data
    const leadsData = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const contactsData = JSON.parse(localStorage.getItem('crmContacts') || '[]');
    const activitiesData = JSON.parse(localStorage.getItem('crmActivities') || '[]');
    const organizationsData = JSON.parse(localStorage.getItem('crmOrganizations') || '[]');
    
    // Load properties from all sources
    const publishedProperties = JSON.parse(localStorage.getItem('publishedProperties') || '[]');
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    const rejectedProperties = JSON.parse(localStorage.getItem('rejectedProperties') || '[]');
    const allProperties = [
      ...publishedProperties.map((p: any) => ({ ...p, status: 'published' })),
      ...pendingProperties.map((p: any) => ({ ...p, status: 'pending' })),
      ...rejectedProperties.map((p: any) => ({ ...p, status: 'rejected' }))
    ];

    setLeads(leadsData.filter((lead: any) => lead.funnelId === params.id));
    setContacts(contactsData);
    setActivities(activitiesData);
    setProperties(allProperties);
    setOrganizations(organizationsData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setSidePanelOpen(true);
    loadLeadData(lead.id);
  };

  const loadLeadData = (leadId: string) => {
    // Load comments for this lead
    const comments = JSON.parse(localStorage.getItem(`leadComments_${leadId}`) || '[]');
    setLeadComments(comments);

    // Load history for this lead
    const history = JSON.parse(localStorage.getItem(`leadHistory_${leadId}`) || '[]');
    setLeadHistory(history);

    // Load attachments for this lead
    const attachments = JSON.parse(localStorage.getItem(`leadAttachments_${leadId}`) || '[]');
    setAttachedFiles(attachments);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedLead) return;

    const comment = {
      id: Date.now().toString(),
      leadId: selectedLead.id,
      content: newComment.trim(),
      author: user.name,
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...leadComments, comment];
    setLeadComments(updatedComments);
    localStorage.setItem(`leadComments_${selectedLead.id}`, JSON.stringify(updatedComments));

    // Add to history
    addToHistory(selectedLead.id, 'comment', `Comentário adicionado: "${newComment.trim()}"`);
    
    setNewComment('');
  };

  const addToHistory = (leadId: string, action: string, description: string) => {
    const historyEntry = {
      id: Date.now().toString(),
      leadId,
      action,
      description,
      author: user.name,
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };

    const currentHistory = JSON.parse(localStorage.getItem(`leadHistory_${leadId}`) || '[]');
    const updatedHistory = [...currentHistory, historyEntry];
    localStorage.setItem(`leadHistory_${leadId}`, JSON.stringify(updatedHistory));
    setLeadHistory(updatedHistory);
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!selectedLead || files.length === 0) return;

    files.forEach(file => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        return;
      }

      // Create file attachment object
      const attachment = {
        id: Date.now().toString() + Math.random(),
        leadId: selectedLead.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: user.name,
        uploadedAt: new Date().toISOString(),
        fileUrl: URL.createObjectURL(file), // In production, upload to server
      };

      // Save attachment
      const currentAttachments = JSON.parse(localStorage.getItem(`leadAttachments_${selectedLead.id}`) || '[]');
      const updatedAttachments = [...currentAttachments, attachment];
      localStorage.setItem(`leadAttachments_${selectedLead.id}`, JSON.stringify(updatedAttachments));
      setAttachedFiles(updatedAttachments);

      // Add to history
      addToHistory(selectedLead.id, 'file_attached', `Arquivo anexado: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    });

    // Clear the input
    event.target.value = '';
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Find the lead being moved
    const leadToMove = leads.find(lead => lead.id === draggableId);
    if (!leadToMove) return;

    // Update the lead's stage
    const updatedLead = {
      ...leadToMove,
      stageId: destination.droppableId,
      updatedAt: new Date().toISOString(),
    };

    // Update leads array
    const updatedLeads = leads.map(lead => 
      lead.id === draggableId ? updatedLead : lead
    );
    setLeads(updatedLeads);

    // Update localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const allUpdatedLeads = allLeads.map((lead: any) => 
      lead.id === draggableId ? updatedLead : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(allUpdatedLeads));

    // Add to history
    const sourceStage = funnel.stages?.find((s: any) => s.id === source.droppableId);
    const destStage = funnel.stages?.find((s: any) => s.id === destination.droppableId);
    if (sourceStage && destStage) {
      addToHistory(
        draggableId, 
        'stage_moved', 
        `Movido de "${sourceStage.name}" para "${destStage.name}"`
      );
    }

    // Update selected lead if it's the one being moved
    if (selectedLead && selectedLead.id === draggableId) {
      setSelectedLead(updatedLead);
    }
  };

  const attachProperty = (propertyId: string) => {
    if (!selectedLead) return;

    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const currentAttached = selectedLead.attachedProperties || [];
    if (currentAttached.includes(propertyId)) return;

    const updatedLead = {
      ...selectedLead,
      attachedProperties: [...currentAttached, propertyId]
    };

    // Update in localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const updatedLeads = allLeads.map((lead: any) => 
      lead.id === selectedLead.id ? updatedLead : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));

    setSelectedLead(updatedLead);
    setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? updatedLead : lead));

    // Add to history
    addToHistory(selectedLead.id, 'property_attached', `Imóvel vinculado: ${property.title}`);
  };

  const attachActivity = (activityId: string) => {
    if (!selectedLead) return;

    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const currentAttached = selectedLead.attachedActivities || [];
    if (currentAttached.includes(activityId)) return;

    const updatedLead = {
      ...selectedLead,
      attachedActivities: [...currentAttached, activityId]
    };

    // Update in localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const updatedLeads = allLeads.map((lead: any) => 
      lead.id === selectedLead.id ? updatedLead : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));

    setSelectedLead(updatedLead);
    setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? updatedLead : lead));

    // Add to history
    addToHistory(selectedLead.id, 'activity_attached', `Atividade vinculada: ${activity.title}`);
  };

  const attachContact = (contactId: string) => {
    if (!selectedLead) return;

    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const currentAttached = selectedLead.attachedContacts || [];
    if (currentAttached.includes(contactId)) return;

    const updatedLead = {
      ...selectedLead,
      attachedContacts: [...currentAttached, contactId]
    };

    // Update in localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const updatedLeads = allLeads.map((lead: any) => 
      lead.id === selectedLead.id ? updatedLead : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));

    setSelectedLead(updatedLead);
    setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? updatedLead : lead));

    // Add to history
    addToHistory(selectedLead.id, 'contact_attached', `Contato vinculado: ${contact.name}`);
  };

  const attachOrganization = (organizationId: string) => {
    if (!selectedLead) return;

    const organization = organizations.find(o => o.id === organizationId);
    if (!organization) return;

    const currentAttached = selectedLead.attachedOrganizations || [];
    if (currentAttached.includes(organizationId)) return;

    const updatedLead = {
      ...selectedLead,
      attachedOrganizations: [...currentAttached, organizationId]
    };

    // Update in localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const updatedLeads = allLeads.map((lead: any) => 
      lead.id === selectedLead.id ? updatedLead : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));

    setSelectedLead(updatedLead);
    setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? updatedLead : lead));

    // Add to history
    addToHistory(selectedLead.id, 'organization_attached', `Empresa vinculada: ${organization.name}`);
  };

  const removeAttachment = (type: string, itemId: string) => {
    if (!selectedLead) return;

    const fieldName = `attached${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    const currentAttached = selectedLead[fieldName] || [];
    const updatedAttached = currentAttached.filter((id: string) => id !== itemId);

    const updatedLead = {
      ...selectedLead,
      [fieldName]: updatedAttached
    };

    // Update in localStorage
    const allLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const updatedLeads = allLeads.map((lead: any) => 
      lead.id === selectedLead.id ? updatedLead : lead
    );
    localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));

    setSelectedLead(updatedLead);
    setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? updatedLead : lead));

    // Add to history
    const item = type === 'property' ? properties.find(p => p.id === itemId) :
                 type === 'activity' ? activities.find(a => a.id === itemId) :
                 type === 'contact' ? contacts.find(c => c.id === itemId) :
                 organizations.find(o => o.id === itemId);
    
    if (item) {
      const itemName = item.title || item.name;
      addToHistory(selectedLead.id, `${type}_detached`, `${type === 'property' ? 'Imóvel' : type === 'activity' ? 'Atividade' : type === 'contact' ? 'Contato' : 'Empresa'} removido: ${itemName}`);
    }
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stageId === stageId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getAttachedItems = (lead: any, type: string) => {
    const fieldName = `attached${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    const attachedIds = lead[fieldName] || [];
    
    switch (type) {
      case 'property':
        return properties.filter(p => attachedIds.includes(p.id));
      case 'activity':
        return activities.filter(a => attachedIds.includes(a.id));
      case 'contact':
        return contacts.filter(c => attachedIds.includes(c.id));
      case 'organization':
        return organizations.filter(o => attachedIds.includes(o.id));
      default:
        return [];
    }
  };

  const getAvailableItems = (type: string) => {
    const attachedIds = selectedLead?.[`attached${type.charAt(0).toUpperCase() + type.slice(1)}s`] || [];
    
    switch (type) {
      case 'property':
        return properties.filter(p => !attachedIds.includes(p.id));
      case 'activity':
        return activities.filter(a => !attachedIds.includes(a.id));
      case 'contact':
        return contacts.filter(c => !attachedIds.includes(c.id));
      case 'organization':
        return organizations.filter(o => !attachedIds.includes(o.id));
      default:
        return [];
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

  if (!funnel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Funil não encontrado</h2>
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
            <Target className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{funnel.name}</h1>
              <p className="text-xs text-muted-foreground">Funil de Vendas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="destructive">Super Admin</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidePanelOpen ? 'mr-96' : ''}`}>
          <div className="p-6">
            {/* Funnel Description */}
            {funnel.description && (
              <div className="mb-6">
                <p className="text-muted-foreground">{funnel.description}</p>
              </div>
            )}

            {/* Kanban Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {funnel.stages?.map((stage: any) => {
                  const stageLeads = getLeadsByStage(stage.id);
                  const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

                  return (
                    <div key={stage.id} className="space-y-4">
                      {/* Stage Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          <h3 className="font-semibold text-foreground">{stage.name}</h3>
                          <Badge variant="secondary">{stageLeads.length}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(stageValue)}
                        </div>
                      </div>

                      {/* Droppable Stage */}
                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                              snapshot.isDraggingOver ? 'bg-muted/50' : ''
                            }`}
                          >
                            {stageLeads.map((lead, index) => (
                              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                                      snapshot.isDragging ? 'rotate-3 shadow-lg' : 'hover:scale-105'
                                    }`}
                                    onClick={(e) => {
                                      // Only open panel if not dragging
                                      if (!snapshot.isDragging) {
                                        handleLeadClick(lead);
                                      }
                                    }}
                                  >
                                    <CardContent className="p-4">
                                      <div className="space-y-3">
                                        {/* Lead Header */}
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-foreground text-sm line-clamp-2">
                                              {lead.title}
                                            </h4>
                                            <Badge variant="outline" className="mt-1 text-xs">
                                              {lead.type}
                                            </Badge>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Handle more options
                                            }}
                                          >
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </div>

                                        {/* Lead Details */}
                                        <div className="space-y-2">
                                          {lead.estimatedValue > 0 && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                              <DollarSign className="h-3 w-3 mr-1" />
                                              {formatCurrency(lead.estimatedValue)}
                                            </div>
                                          )}
                                          
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDate(lead.createdAt)}
                                          </div>

                                          {lead.contactId && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                              <User className="h-3 w-3 mr-1" />
                                              {contacts.find(c => c.id === lead.contactId)?.name}
                                            </div>
                                          )}
                                        </div>

                                        {/* Attachment Indicators */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                          {(lead.attachedProperties?.length || 0) > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              <HomeIcon className="h-3 w-3 mr-1" />
                                              {lead.attachedProperties.length}
                                            </Badge>
                                          )}
                                          {(lead.attachedActivities?.length || 0) > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              <Activity className="h-3 w-3 mr-1" />
                                              {lead.attachedActivities.length}
                                            </Badge>
                                          )}
                                          {(lead.attachedContacts?.length || 0) > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              <User className="h-3 w-3 mr-1" />
                                              {lead.attachedContacts.length}
                                            </Badge>
                                          )}
                                          {(lead.attachedOrganizations?.length || 0) > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                              <Building className="h-3 w-3 mr-1" />
                                              {lead.attachedOrganizations.length}
                                            </Badge>
                                          )}
                                        </div>

                                        {/* Priority Indicator */}
                                        {lead.priority && lead.priority !== 'medium' && (
                                          <div className="flex justify-end">
                                            <Badge 
                                              variant={lead.priority === 'high' || lead.priority === 'urgent' ? 'destructive' : 'secondary'}
                                              className="text-xs"
                                            >
                                              {lead.priority === 'high' ? 'Alta' : 
                                               lead.priority === 'urgent' ? 'Urgente' : 
                                               lead.priority === 'low' ? 'Baixa' : 'Média'}
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        </div>

        {/* Side Panel */}
        {sidePanelOpen && selectedLead && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSidePanelOpen(false)}
            />
            
            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 shadow-xl">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {selectedLead.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{selectedLead.type}</Badge>
                        {selectedLead.category && (
                          <Badge variant="secondary">{selectedLead.category}</Badge>
                        )}
                      </div>
                      {selectedLead.estimatedValue > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Valor: {formatCurrency(selectedLead.estimatedValue)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidePanelOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Panel Content */}
                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-6">
                    {/* Attached Properties */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center">
                          <HomeIcon className="h-4 w-4 mr-2" />
                          Imóveis ({getAttachedItems(selectedLead, 'property').length})
                        </h4>
                        <Select onValueChange={attachProperty}>
                          <SelectTrigger className="w-32 h-8">
                            <Plus className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableItems('property').map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {property.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        {getAttachedItems(selectedLead, 'property').map((property) => (
                          <div key={property.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{property.title}</p>
                              <p className="text-xs text-muted-foreground">{property.location}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment('property', property.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {getAttachedItems(selectedLead, 'property').length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhum imóvel vinculado</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Attached Activities */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Atividades ({getAttachedItems(selectedLead, 'activity').length})
                        </h4>
                        <Select onValueChange={attachActivity}>
                          <SelectTrigger className="w-32 h-8">
                            <Plus className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableItems('activity').map((activity) => (
                              <SelectItem key={activity.id} value={activity.id}>
                                {activity.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        {getAttachedItems(selectedLead, 'activity').map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.type}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment('activity', activity.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {getAttachedItems(selectedLead, 'activity').length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhuma atividade vinculada</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Attached Contacts */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Contatos ({getAttachedItems(selectedLead, 'contact').length})
                        </h4>
                        <Select onValueChange={attachContact}>
                          <SelectTrigger className="w-32 h-8">
                            <Plus className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableItems('contact').map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        {getAttachedItems(selectedLead, 'contact').map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment('contact', contact.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {getAttachedItems(selectedLead, 'contact').length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhum contato vinculado</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Attached Organizations */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          Empresas ({getAttachedItems(selectedLead, 'organization').length})
                        </h4>
                        <Select onValueChange={attachOrganization}>
                          <SelectTrigger className="w-32 h-8">
                            <Plus className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableItems('organization').map((organization) => (
                              <SelectItem key={organization.id} value={organization.id}>
                                {organization.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        {getAttachedItems(selectedLead, 'organization').map((organization) => (
                          <div key={organization.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{organization.name}</p>
                              <p className="text-xs text-muted-foreground">{organization.email}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment('organization', organization.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {getAttachedItems(selectedLead, 'organization').length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhuma empresa vinculada</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* History */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Histórico ({leadHistory.length})
                      </h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {leadHistory.map((entry) => (
                          <div key={entry.id} className="text-xs">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-foreground">{entry.description}</p>
                                <p className="text-muted-foreground">
                                  {entry.author} • {formatDate(entry.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {leadHistory.length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhum histórico disponível</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Attachments */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Anexos ({attachedFiles.length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {attachedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{file.fileName}</p>
                              <p className="text-muted-foreground">
                                {(file.fileSize / 1024 / 1024).toFixed(2)}MB • {formatDate(file.uploadedAt)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Download file
                                const link = document.createElement('a');
                                link.href = file.fileUrl;
                                link.download = file.fileName;
                                link.click();
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {attachedFiles.length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhum arquivo anexado</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comentários ({leadComments.length})
                      </h4>
                      
                      {/* Comments List */}
                      <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                        {leadComments.map((comment) => (
                          <div key={comment.id} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {comment.author.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/50 rounded-lg p-2">
                                  <p className="text-sm text-foreground">{comment.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {comment.author} • {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {leadComments.length === 0 && (
                          <p className="text-xs text-muted-foreground">Nenhum comentário ainda</p>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Adicionar comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={addComment}
                            disabled={!newComment.trim()}
                            className="flex-1"
                          >
                            <Send className="h-3 w-3 mr-2" />
                            Comentar
                          </Button>
                          <div className="relative">
                            <input
                              type="file"
                              id="attachment-upload"
                              multiple
                              accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.doc,.xls"
                              onChange={handleFileAttachment}
                              className="hidden"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('attachment-upload')?.click()}
                            >
                            <Paperclip className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}