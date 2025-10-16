'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  DollarSign,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Shield,
  Headphones,
  CheckCircle,
  ArrowRight,
  Plus,
  Camera,
  MapPin,
  Heart,
} from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Dupla Receita',
    description: 'Ganhe com hospedagem enquanto procura o comprador ideal para seu imóvel.',
  },
  {
    icon: Users,
    title: 'Hóspedes Qualificados',
    description: 'Receba apenas pessoas interessadas em conhecer e potencialmente comprar seu imóvel.',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Todos os hóspedes são verificados e o pagamento é garantido pela plataforma.',
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Nossa equipe está sempre disponível para ajudar você e seus hóspedes.',
  },
];

const steps = [
  {
    number: 1,
    title: 'Cadastre seu Imóvel',
    description: 'Adicione fotos, descrição e defina os preços de hospedagem e venda.',
  },
  {
    number: 2,
    title: 'Receba Reservas',
    description: 'Hóspedes interessados fazem reservas para conhecer seu imóvel.',
  },
  {
    number: 3,
    title: 'Hospede e Venda',
    description: 'Ganhe com hospedagem e negocie a venda diretamente na plataforma.',
  },
];

const testimonials = [
  {
    name: 'Carlos Roberto',
    location: 'Rio de Janeiro, RJ',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment: 'Vendi meu apartamento em 3 meses e ainda ganhei R$ 15.000 com hospedagem. Incrível!',
    earnings: 'R$ 15.000',
    bookings: 12,
  },
  {
    name: 'Maria Santos',
    location: 'São Paulo, SP',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment: 'A plataforma me ajudou a encontrar o comprador perfeito. Ele se hospedou 5 vezes antes de comprar.',
    earnings: 'R$ 8.500',
    bookings: 8,
  },
];

export default function HostPage() {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    // Redirect to registration with host type pre-selected
    window.location.href = '/register?type=host';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Home className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Guest to Buy</h1>
                <p className="text-xs text-muted-foreground -mt-1">Stay • Experience • Purchase</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Button onClick={handleGetStarted}>Começar Agora</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="mb-4">Para Proprietários</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Transforme seu Imóvel em uma
                <br />
                <span className="gradient-text">Máquina de Ganhar Dinheiro</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Ganhe dinheiro com hospedagem enquanto encontra o comprador ideal. 
                Nossos proprietários faturam em média R$ 12.000 por mês antes de vender.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGetStarted} className="px-8">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Cadastro gratuito • Sem taxas de adesão • Suporte 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">R$ 12K</div>
              <div className="text-sm text-muted-foreground">Receita média mensal</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">94%</div>
              <div className="text-sm text-muted-foreground">Taxa de ocupação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">3.2x</div>
              <div className="text-sm text-muted-foreground">Mais rápido para vender</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">Satisfação dos hosts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Por que Escolher o <span className="gradient-text">Guest to Buy</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos vantagens únicas que nenhuma outra plataforma possui.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Como <span className="gradient-text">Funciona</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Processo simples em 3 passos para começar a ganhar dinheiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8" />
                  )}
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={handleGetStarted}>
              <Plus className="mr-2 h-5 w-5" />
              Cadastrar Meu Imóvel
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Histórias de <span className="gradient-text">Sucesso</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja como outros proprietários estão transformando seus imóveis em negócios lucrativos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="ml-auto flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-muted-foreground mb-4">
                    "{testimonial.comment}"
                  </blockquote>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">{testimonial.earnings}</span>
                      <span className="text-muted-foreground ml-1">ganhos</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-semibold">{testimonial.bookings}</span>
                      <span className="text-muted-foreground ml-1">reservas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pronto para Começar a Ganhar Dinheiro?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Junte-se a centenas de proprietários que já estão faturando com seus imóveis. 
              Cadastro gratuito e sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background text-foreground"
              />
              <Button 
                onClick={handleGetStarted}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm opacity-75">
              ✓ Sem taxas de adesão ✓ Suporte gratuito ✓ Pagamentos garantidos
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">Guest to Buy</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                A plataforma que revoluciona o mercado imobiliário brasileiro.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Para Proprietários</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/host" className="hover:text-foreground">Como Funciona</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Cadastrar Imóvel</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Central de Ajuda</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground">Contato</Link></li>
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Termos de Uso</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 host@guesttobuy.com.br</p>
                <p>📱 (11) 4000-0000</p>
                <p>🕒 Seg-Sex: 8h às 18h</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Guest to Buy. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}