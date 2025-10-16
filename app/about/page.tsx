'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  Building,
  Calendar,
  MapPin,
  Linkedin,
} from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Transparência',
    description: 'Acreditamos em relacionamentos baseados na confiança e honestidade total.',
  },
  {
    icon: Lightbulb,
    title: 'Inovação',
    description: 'Revolucionamos o mercado imobiliário com soluções tecnológicas avançadas.',
  },
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Priorizamos a proteção e segurança de todos os nossos usuários.',
  },
  {
    icon: Users,
    title: 'Comunidade',
    description: 'Construímos uma comunidade forte de proprietários e hóspedes satisfeitos.',
  },
];

const team = [
  {
    name: 'Rafael Silva',
    role: 'CEO & Fundador',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Empreendedor serial com 15 anos de experiência em tecnologia e mercado imobiliário.',
    linkedin: '#',
  },
  {
    name: 'Marina Costa',
    role: 'CTO',
    image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Especialista em arquitetura de software e inteligência artificial aplicada ao mercado imobiliário.',
    linkedin: '#',
  },
  {
    name: 'Carlos Mendes',
    role: 'Head de Produto',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Product Manager com vasta experiência em plataformas de marketplace e UX design.',
    linkedin: '#',
  },
  {
    name: 'Ana Beatriz',
    role: 'Head de Marketing',
    image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
    bio: 'Especialista em marketing digital e growth hacking para startups de tecnologia.',
    linkedin: '#',
  },
];

const milestones = [
  {
    year: '2022',
    title: 'Fundação',
    description: 'Guest to Buy é fundada com a missão de revolucionar o mercado imobiliário.',
  },
  {
    year: '2023',
    title: 'Primeiro Milhão',
    description: 'Atingimos R$ 1 milhão em transações e 1.000 usuários cadastrados.',
  },
  {
    year: '2024',
    title: 'Expansão Nacional',
    description: 'Expandimos para 50 cidades brasileiras com mais de 2.500 imóveis.',
  },
  {
    year: '2025',
    title: 'Liderança de Mercado',
    description: 'Nos tornamos a maior plataforma de "hospedagem para compra" do Brasil.',
  },
];

const stats = [
  { icon: Users, label: 'Usuários Ativos', value: '15.000+' },
  { icon: Building, label: 'Imóveis Cadastrados', value: '2.500+' },
  { icon: Globe, label: 'Cidades Atendidas', value: '127' },
  { icon: Award, label: 'Satisfação', value: '4.9★' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="mb-4">Sobre Nós</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Revolucionando o <span className="gradient-text">Mercado Imobiliário</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Somos uma startup brasileira que criou o conceito inovador de "Se Hospede para Comprar", 
                transformando a forma como as pessoas escolhem onde morar e investir.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">Nossa Missão</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Democratizar o acesso ao mercado imobiliário através da tecnologia, 
                    permitindo que as pessoas experimentem completamente um imóvel antes 
                    de tomar a decisão de compra mais importante de suas vidas.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">Nossa Visão</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Ser a principal plataforma de experiência imobiliária do Brasil, 
                    conectando milhões de pessoas aos seus lares ideais através de 
                    uma experiência única e transformadora.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Nossos <span className="gradient-text">Valores</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os princípios que guiam todas as nossas decisões e ações
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl text-foreground mb-4">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Nossa <span className="gradient-text">Jornada</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Principais marcos da nossa trajetória de crescimento
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="outline" className="text-sm">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-foreground">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Nosso <span className="gradient-text">Time</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça as pessoas por trás da revolução no mercado imobiliário
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {member.bio}
                    </p>
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Onde <span className="gradient-text">Estamos</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        Sede Principal
                      </h3>
                      <p className="text-muted-foreground">
                        Av. Paulista, 1000 - Bela Vista<br />
                        São Paulo, SP - 01310-100<br />
                        Brasil
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Globe className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        Cobertura Nacional
                      </h3>
                      <p className="text-muted-foreground">
                        Atendemos 127 cidades em todo o Brasil, com foco nas 
                        principais capitais e regiões metropolitanas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="h-80 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Mapa Interativo</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Quer Fazer Parte da Nossa História?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Estamos sempre em busca de talentos excepcionais para se juntar 
                à nossa missão de revolucionar o mercado imobiliário.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Ver Vagas Abertas
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Entre em Contato
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