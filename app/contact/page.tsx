'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Building,
  Users,
  HeadphonesIcon,
  Globe,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: '',
    });
    
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Ligue para nossa central de atendimento',
      value: '(11) 4000-0000',
      availability: 'Seg-Sex: 8h às 18h',
      action: 'Ligar Agora',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Envie sua mensagem por email',
      value: 'contato@guesttobuy.com.br',
      availability: 'Resposta em até 2h',
      action: 'Enviar Email',
    },
    {
      icon: MessageCircle,
      title: 'Chat Online',
      description: 'Converse conosco em tempo real',
      value: 'Chat disponível',
      availability: '24/7 disponível',
      action: 'Iniciar Chat',
    },
    {
      icon: MapPin,
      title: 'Escritório',
      description: 'Visite nosso escritório principal',
      value: 'São Paulo, SP - Brasil',
      availability: 'Seg-Sex: 9h às 17h',
      action: 'Ver Localização',
    },
  ];

  const departments = [
    {
      icon: Users,
      title: 'Suporte ao Cliente',
      description: 'Dúvidas gerais, reservas e conta',
      email: 'suporte@guesttobuy.com.br',
    },
    {
      icon: Building,
      title: 'Proprietários',
      description: 'Suporte para anunciantes',
      email: 'proprietarios@guesttobuy.com.br',
    },
    {
      icon: HeadphonesIcon,
      title: 'Suporte Técnico',
      description: 'Problemas técnicos da plataforma',
      email: 'tecnico@guesttobuy.com.br',
    },
    {
      icon: Globe,
      title: 'Parcerias',
      description: 'Oportunidades de negócio',
      email: 'parcerias@guesttobuy.com.br',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="mb-4">Contato</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Entre em <span className="gradient-text">Contato</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Estamos aqui para ajudar você. Entre em contato conosco através 
                dos canais abaixo ou envie uma mensagem diretamente.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {method.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {method.description}
                    </p>
                    <p className="font-medium text-foreground mb-2">
                      {method.value}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      {method.availability}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Departments */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Envie uma <span className="gradient-text">Mensagem</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoria *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="support">Suporte Geral</SelectItem>
                              <SelectItem value="booking">Reservas</SelectItem>
                              <SelectItem value="hosting">Para Proprietários</SelectItem>
                              <SelectItem value="technical">Problema Técnico</SelectItem>
                              <SelectItem value="partnership">Parcerias</SelectItem>
                              <SelectItem value="other">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensagem *</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Departments */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Departamentos <span className="gradient-text">Especializados</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Entre em contato diretamente com o departamento mais adequado para sua necessidade.
                  </p>
                </div>

                <div className="space-y-6">
                  {departments.map((dept, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <dept.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground mb-1">
                              {dept.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              {dept.description}
                            </p>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              {dept.email}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Office Info */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Nosso Escritório
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Endereço</p>
                          <p className="text-muted-foreground text-sm">
                            Av. Paulista, 1000 - Bela Vista<br />
                            São Paulo, SP - 01310-100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Horário de Funcionamento</p>
                          <p className="text-muted-foreground text-sm">
                            Segunda a Sexta: 9h às 17h<br />
                            Sábado: 9h às 13h<br />
                            Domingo: Fechado
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Precisa de Ajuda <span className="gradient-text">Rápida</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Confira nossa central de ajuda com respostas para as perguntas mais frequentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Visitar Central de Ajuda
                </Button>
                <Button size="lg" variant="outline">
                  Ver Perguntas Frequentes
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}