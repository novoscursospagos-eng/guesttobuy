'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function NewActivityPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const router = useRouter();

  const [activityData, setActivityData] = useState({
    title: '',
    type: '',
    description: '',
    leadId: '',
    contactId: '',
    dueDate: undefined as Date | undefined,
    dueTime: '',
    priority: 'medium',
    status: 'pending',
    location: '',
    duration: '',
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

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
  }, [router]);

  const loadData = () => {
    const leadsData = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    const contactsData = JSON.parse(localStorage.getItem('crmContacts') || '[]');
    setLeads(leadsData);
    setContacts(contactsData);
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false,
    };
    
    setChecklist(prev => [...prev, newItem]);
    setNewChecklistItem('');
  };

  const removeChecklistItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!activityData.title || !activityData.type) {
        setError('Título e tipo são obrigatórios.');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newActivity = {
        id: Date.now().toString(),
        title: activityData.title,
        type: activityData.type,
        description: activityData.description,
        leadId: activityData.leadId,
        contactId: activityData.contactId,
        dueDate: activityData.dueDate?.toISOString(),
        dueTime: activityData.dueTime,
        priority: activityData.priority,
        status: activityData.status,
        location: activityData.location,
        duration: activityData.duration,
        checklist: checklist,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        assignedTo: user.id,
        completedAt: null,
      };

      const existingActivities = JSON.parse(localStorage.getItem('crmActivities') || '[]');
      existingActivities.push(newActivity);
      localStorage.setItem('crmActivities', JSON.stringify(existingActivities));

      setSuccess('Atividade criada com sucesso!');
      setTimeout(() => {
        router.push('/superadmin/crm');
      }, 1500);
    } catch (err) {
      setError('Erro ao criar atividade. Tente novamente.');
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
            <Activity className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Nova Atividade</h1>
              <p className="text-xs text-muted-foreground">Criar nova atividade no CRM</p>
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
              <CardTitle>Informações da Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Atividade *</Label>
                <Input
                  id="title"
                  value={activityData.title}
                  onChange={(e) => setActivityData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Ligar para cliente sobre proposta"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Atividade *</Label>
                  <Select value={activityData.type} onValueChange={(value) => setActivityData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Ligação</SelectItem>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="task">Tarefa</SelectItem>
                      <SelectItem value="visit">Visita</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="presentation">Apresentação</SelectItem>
                      <SelectItem value="negotiation">Negociação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={activityData.priority} onValueChange={(value) => setActivityData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={activityData.description}
                  onChange={(e) => setActivityData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os detalhes da atividade..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Associations */}
          <Card>
            <CardHeader>
              <CardTitle>Vinculações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lead Relacionado</Label>
                  <Select value={activityData.leadId} onValueChange={(value) => setActivityData(prev => ({ ...prev, leadId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lead (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Contato Relacionado</Label>
                  <Select value={activityData.contactId} onValueChange={(value) => setActivityData(prev => ({ ...prev, contactId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um contato (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} - {contact.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data de Vencimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !activityData.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {activityData.dueDate ? format(activityData.dueDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={activityData.dueDate}
                        onSelect={(date) => setActivityData(prev => ({ ...prev, dueDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={activityData.dueTime}
                    onChange={(e) => setActivityData(prev => ({ ...prev, dueTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duração (minutos)</Label>
                  <Input
                    type="number"
                    value={activityData.duration}
                    onChange={(e) => setActivityData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Local</Label>
                <Input
                  value={activityData.location}
                  onChange={(e) => setActivityData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: Escritório, Online, Endereço do cliente..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Adicionar item ao checklist..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                />
                <Button type="button" onClick={addChecklistItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {checklist.length > 0 && (
                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                      />
                      <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.text}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChecklistItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/superadmin/crm')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Criando...' : 'Criar Atividade'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}