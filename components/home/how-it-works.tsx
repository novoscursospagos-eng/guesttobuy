'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Search,
  Calendar,
  Home,
  HandHeart,
  MessageCircle,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Encontre o Imóvel Ideal',
    description: 'Pesquise entre milhares de propriedades usando nossos filtros avançados. Cada imóvel oferece hospedagem e opção de compra.',
    details: ['Filtros inteligentes por localização, preço e características', 'Fotos profissionais e tours virtuais', 'Informações detalhadas sobre hospedagem e venda'],
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Reserve sua Estadia',
    description: 'Escolha as datas, converse com o proprietário e faça sua reserva. Experimente viver no imóvel antes de decidir comprar.',
    details: ['Sistema de reservas online seguro', 'Chat direto com proprietários', 'Calendário de disponibilidade em tempo real'],
  },
  {
    id: 3,
    icon: Home,
    title: 'Viva a Experiência',
    description: 'Hospede-se no imóvel e vivencie como seria morar ali. Conheça a vizinhança, teste as comodidades e sinta o ambiente.',
    details: ['Experiência completa de moradia', 'Suporte 24/7 durante a estadia', 'Acesso a informações exclusivas sobre o bairro'],
  },
  {
    id: 4,
    icon: HandHeart,
    title: 'Decida com Segurança',
    description: 'Se você se apaixonou pelo imóvel, inicie o processo de compra diretamente pela plataforma com todas as facilidades.',
    details: ['Assessoria jurídica especializada', 'Financiamento facilitado', 'Documentação digital segura'],
  },
];

const benefits = [
  {
    icon: MessageCircle,
    title: 'Comunicação Direta',
    description: 'Chat integrado para conversar com proprietários, tirar dúvidas e negociar condições.',
  },
  {
    icon: CreditCard,
    title: 'Pagamentos Seguros',
    description: 'Sistema de pagamentos protegido com split automático entre proprietários e imobiliárias.',
  },
  {
    icon: CheckCircle,
    title: 'Verificação Completa',
    description: 'Todos os imóveis e usuários passam por verificação rigorosa para sua segurança.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Como <span className="gradient-text">Funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Um processo simples e seguro para você conhecer o imóvel dos seus sonhos 
            antes de tomar a decisão mais importante da sua vida.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-center">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Por que Escolher o <span className="gradient-text">Guest to Buy</span>?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma oferece vantagens únicas que revolucionam o mercado imobiliário e hoteleiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg text-foreground">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="text-base px-8 py-3">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}