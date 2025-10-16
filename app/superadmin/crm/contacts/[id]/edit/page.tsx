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
  User,
  Building,
} from 'lucide-react';

export default function EditContactPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contact, setContact] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'person',
    company: '',
    position: '',
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
        loadContact();
      } else {
        router.push('/superadmin');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router, params.id]);

  const loadContact = () => {
    const contactsData = JSON.parse(localStorage.getItem('crmContacts') || '[]');
    const foundContact = contactsData.find((c: any) => c.id === params.id);
    
    if (foundContact) {
      setContact(foundContact);
      setContactData({
        name: foundContact.name,
        email: foundContact.email,
        phone: foundContact.phone || '',
        type: foundContact.type || 'person',
        company: foundContact.company || '',
        position: foundContact.position || '',
        address: foundContact.address || '',
        neighborhood: foundContact.neighborhood || '',
        city: foundContact.city || '',
        state: foundContact.state || '',
        zipCode: foundContact.zipCode || '',
        notes: foundContact.notes || '',
        source: foundContact.source || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!contactData.name || !contactData.email) {
        setError('Nome e email são obrigatórios.');
        return;
      }

      // Check for duplicate email (excluding current contact)
      const existingContacts = JSON.parse(localStorage.getItem('crmContacts') || '[]');
      if (existingContacts.some((c: any) => c.email === contactData.email && c.id !== contact.id)) {
        setError('Já existe outro contato com este email.');
        return;
      }

      const updatedContact = {
        ...contact,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        type: contactData.type,
        company: contactData.company,
        position: contactData.position,
        address: contactData.address,
        neighborhood: contactData.neighborhood,
        city: contactData.city,
        state: contactData.state,
        zipCode: contactData.zipCode,
        notes: contactData.notes,
        source: contactData.source,
        updatedAt: new Date().toISOString(),
      };

      const updatedContacts = existingContacts.map((c: any) => 
        c.id === contact.id ? updatedContact : c
      );
      localStorage.setItem('crmContacts', JSON.stringify(updatedContacts));

      setSuccess('Contato atualizado com sucesso!');
      setTimeout(() => {
        router.push('/superadmin/crm');
      }, 1500);
    } catch (err) {
      setError('Erro ao atualizar contato. Tente novamente.');
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

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Contato não encontrado</h2>
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
            <User className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Editar Contato</h1>
              <p className="text-xs text-muted-foreground">Atualizar informações do contato</p>
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
          {/* Contact Type */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={contactData.type === 'person' ? 'default' : 'outline'}
                  onClick={() => setContactData(prev => ({ ...prev, type: 'person' }))}
                  className="h-20 flex-col"
                >
                  <User className="h-6 w-6 mb-2" />
                  Pessoa Física
                </Button>
                <Button
                  type="button"
                  variant={contactData.type === 'company' ? 'default' : 'outline'}
                  onClick={() => setContactData(prev => ({ ...prev, type: 'company' }))}
                  className="h-20 flex-col"
                >
                  <Building className="h-6 w-6 mb-2" />
                  Pessoa Jurídica
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {contactData.type === 'person' ? 'Nome Completo' : 'Razão Social'} *
                </Label>
                <Input
                  id="name"
                  value={contactData.name}
                  onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={contactData.type === 'person' ? 'João Silva' : 'Empresa LTDA'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {contactData.type === 'person' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      value={contactData.company}
                      onChange={(e) => setContactData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input
                      value={contactData.position}
                      onChange={(e) => setContactData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Cargo na empresa"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={contactData.address}
                  onChange={(e) => setContactData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua, número, complemento"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input
                  value={contactData.neighborhood}
                  onChange={(e) => setContactData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  placeholder="Nome do bairro"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={contactData.city}
                    onChange={(e) => setContactData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={contactData.state} onValueChange={(value) => setContactData(prev => ({ ...prev, state: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input
                    value={contactData.zipCode}
                    onChange={(e) => setContactData(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="00000-000"
                  />
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
                <Select value={contactData.source} onValueChange={(value) => setContactData(prev => ({ ...prev, source: value }))}>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={contactData.notes}
                  onChange={(e) => setContactData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informações importantes sobre este contato..."
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