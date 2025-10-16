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
  Target,
} from 'lucide-react';

export default function EditLeadPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lead, setLead] = useState<any>(null);
  const [funnels, setFunnels] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const router = useRouter();
  const params = useParams();

  const [leadData, setLeadData] = useState({
    title: '',
    type: '',
    category: '',
    estimatedValue: '',
    funnelId: '',
    stageId: '',
    contactId: '',
    notes: '',
    source: '',
    priority: 'medium',
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
    setLoading(false);
  }, [router, params.id]);

  const loadData = () => {
    const funnelsData = JSON.parse(localStorage.getItem('crmFunnels') || '[]');
    const contactsData = JSON.parse(localStorage.getItem('crmContacts') || '[]');
    const leadsData = JSON.parse(localStorage.getItem('crmLeads') || '[]');
    
    setFunnels(funnelsData);
    setContacts(contactsData);
    
    const foundLead = leadsData.find((l: any) => l.id === params.id);
    if (foundLead) {
      setLead(foundLead);
      setLeadData({
        title: foundLead.title,
        type: foundLead.type,
        category: foundLead.category,
        estimatedValue: foundLead.estimatedValue.toString(),
        funnelId: foundLead.funnelId,
        stageId: foundLead.stageId,
        contactId: foundLead.contactId || '',
        notes: foundLead.notes || '',
        source: foundLead.source || '',
        priority: foundLead.priority || 'medium',
      });
    }
  };

  const handleFunnelChange = (funnelId: string) => {
    setLeadData(prev => ({ ...prev, funnelId, stageId: '' }));
  };

  const getSelectedFunnel = () => {
    return funnels.find(f => f.id === leadData.funnelId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!leadData.title || !leadData.type || !leadData.funnelId || !leadData.stageId) {
        setError('Preencha todos os campos obrigatórios.');
        return;
      }

      const updatedLead = {
        ...lead,
        title: leadData.title,
        type: leadData.type,
        category: leadData.category,
        estimatedValue: parseInt(leadData.estimatedValue) || 0,
        funnelId: leadData.funnelId,
        stageId: leadData.stageId,
        contactId: leadData.contactId,
        source: leadData.source,
        priority: leadData.priority,
        notes: leadData.notes,
        updatedAt: new Date().toISOString(),
      };

      const existingLeads = JSON.parse(localStorage.getItem('crmLeads') || '[]');
      const updatedLeads = existingLeads.map((l: any) => 
        l.id === lead.id ? updatedLead : l
      );
      localStorage.setItem('crmLeads', JSON.stringify(updatedLeads));

      setSuccess('Lead atualizado com sucesso!');
      setTimeout(() => {
        router.push('/superadmin/crm');
      }, 1500);
    } catch (err) {
      setError('Erro ao atualizar lead. Tente novamente.');
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Lead não encontrado</h2>
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
              <h1 className="text-xl font-bold text-foreground">Editar Lead</h1>
              <p className="text-xs text-muted-foreground">Atualizar informações do lead</p>
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
              <CardTitle>Informações do Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Lead *</Label>
                <Input
                  id="title"
                  value={leadData.title}
                  onChange={(e) => setLeadData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: João Silva - Apartamento Ipanema"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select value={leadData.type} onValueChange={(value) => setLeadData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compra">Compra</SelectItem>
                      <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="Venda">Venda</SelectItem>
                      <SelectItem value="Locação">Locação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={leadData.category} onValueChange={(value) => setLeadData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Loft">Loft</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Condomínio">Condomínio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={leadData.priority} onValueChange={(value) => setLeadData(prev => ({ ...prev, priority: value }))}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Estimado (R$)</Label>
                  <Input
                    type="number"
                    value={leadData.estimatedValue}
                    onChange={(e) => setLeadData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                    placeholder="1200000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Origem</Label>
                  <Select value={leadData.source} onValueChange={(value) => setLeadData(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Telefone">Telefone</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funnel Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Funil e Etapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Funil *</Label>
                  <Select value={leadData.funnelId} onValueChange={handleFunnelChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funil" />
                    </SelectTrigger>
                    <SelectContent>
                      {funnels.map((funnel) => (
                        <SelectItem key={funnel.id} value={funnel.id}>
                          {funnel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Etapa *</Label>
                  <Select 
                    value={leadData.stageId} 
                    onValueChange={(value) => setLeadData(prev => ({ ...prev, stageId: value }))}
                    disabled={!leadData.funnelId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSelectedFunnel()?.stages.map((stage: any) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            {stage.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contato</Label>
                <Select value={leadData.contactId} onValueChange={(value) => setLeadData(prev => ({ ...prev, contactId: value }))}>
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
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={leadData.notes}
                  onChange={(e) => setLeadData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informações importantes sobre este lead..."
                  rows={4}
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