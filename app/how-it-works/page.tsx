'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Search,
  Calendar,
  Home,
  HandHeart,
  MessageCircle,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  Star,
  Clock,
  MapPin,
  Heart,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Encontre o Imóvel Ideal',
    description: 'Pesquise entre milhares de propriedades usando nossos filtros avançados.',
    details: [
      'Filtros inteligentes por localização, preço e características',
      'Fotos profissionais e tours virtuais 360°',
      'Informações detalhadas sobre hospedagem e venda',
      'Avaliações reais de outros hóspedes'
    ],
    color: 'bg-blue-500',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Reserve sua Estadia',
    description: 'Escolha as datas e faça sua reserva de forma segura.',
    details: [
      'Sistema de reservas online protegido',
      'Chat direto com proprietários verificados',
      'Calendário de disponibilidade em tempo real',
      'Pagamento seguro com proteção total'
    ],
    color: 'bg-green-500',
  },
  {
    id: 3,
    icon: Home,
    title: 'Viva a Experiência',
    description: 'Hospede-se e experimente como seria morar no imóvel.',
    details: [
      'Experiência completa de moradia',
      'Suporte 24/7 durante toda a estadia',
      'Acesso a informações exclusivas sobre o bairro',
      'Teste todas as comodidades e facilidades'
    ],
    color: 'bg-purple-500',
  },
  {
    id: 4,
    icon: HandHeart,
    title: 'Decida com Segurança',
    description: 'Se você se apaixonou, inicie o processo de compra.',
    details: [
      'Assessoria jurídica especializada incluída',
      'Financiamento facilitado com parceiros',
      'Documentação digital 100% segura',
      'Suporte completo até a escritura'
    ],
    color: 'bg-orange-500',
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Todos os imóveis e usuários são verificados. Pagamentos protegidos e documentação segura.',
    stats: '100% dos pagamentos protegidos',
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Mais de 15.000 usuários satisfeitos compartilhando experiências reais.',
    stats: '15K+ usuários ativos',
  },
  {
    icon: Star,
    title: 'Qualidade Garantida',
    description: 'Avaliação média de 4.9 estrelas com rigoroso controle de qualidade.',
    stats: '4.9★ avaliação média',
  },
  {
    icon: Clock,
    title: 'Suporte 24/7',
    description: 'Equipe especializada disponível a qualquer hora para ajudar você.',
    stats: '24/7 suporte disponível',
  },
];

const faqs = [
  {
    question: 'Como funciona o processo de hospedagem para compra?',
    answer: 'Você se hospeda no imóvel por alguns dias para conhecer a propriedade, o bairro e decidir se quer comprar. Durante a estadia, você tem acesso completo ao imóvel e pode avaliar se atende suas necessidades.',
  },
  {
    question: 'O valor da hospedagem é descontado do preço de compra?',
    answer: 'Sim! Em muitos casos, proprietários oferecem desconto no valor final de compra baseado no valor gasto com hospedagem. As condições variam por propriedade.',
  },
  {
    question: 'Posso cancelar a reserva se não gostar do imóvel?',
    answer: 'Sim, temos política de cancelamento flexível. Você pode cancelar até 24h antes do check-in com reembolso total, ou durante as primeiras 24h da estadia.',
  },
  {
    question: 'Como é garantida a segurança das transações?',
    answer: 'Utilizamos criptografia de ponta e parceiros financeiros certificados. Todos os pagamentos são processados de forma segura e você tem proteção total.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 mb-16">
              <Badge className="mb-4">Como Funciona</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                <span className="gradient-text">Experimente</span> Antes de
                <br />
                <span className="gradient-text">Comprar</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Um processo revolucionário que permite conhecer completamente o imóvel 
                dos seus sonhos antes de tomar a decisão mais importante da sua vida.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { icon: Search, label: 'Busque', value: '2.5K+', desc: 'Imóveis disponíveis' },
                { icon: Calendar, label: 'Reserve', value: '15min', desc: 'Tempo médio de reserva' },
                { icon: Home, label: 'Experimente', value: '94%', desc: 'Taxa de satisfação' },
                { icon: HandHeart, label: 'Compre', value: '67%', desc: 'Taxa de conversão' },
              ].map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-2">{stat.desc}</div>
                    <div className="text-xs font-medium text-primary">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Processo <span className="gradient-text">Simples</span> em 4 Etapas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Desenvolvemos um processo intuitivo e seguro para você ter a melhor experiência.
              </p>
            </div>

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Etapa {step.id}</Badge>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-lg text-muted-foreground">{step.description}</p>
                    
                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1">
                    <Card className="overflow-hidden">
                      <div className="h-80 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <step.icon className="h-24 w-24 text-muted-foreground/30" />
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Por que Escolher o <span className="gradient-text">Guest to Buy</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Oferecemos vantagens únicas que revolucionam o mercado imobiliário.
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
                    <p className="text-muted-foreground text-sm mb-4">
                      {benefit.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {benefit.stats}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Perguntas <span className="gradient-text">Frequentes</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Esclarecemos as principais dúvidas sobre nosso processo inovador.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
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
                Pronto para Começar sua Jornada?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Junte-se a milhares de pessoas que já descobriram uma nova forma 
                de encontrar o imóvel perfeito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Explorar Imóveis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Anunciar Imóvel
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