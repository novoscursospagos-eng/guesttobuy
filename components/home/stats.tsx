'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  Users,
  Star,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  Shield,
} from 'lucide-react';

interface Stat {
  id: string;
  label: string;
  value: string;
  increase: string;
  icon: React.ComponentType<any>;
  description: string;
}

const stats: Stat[] = [
  {
    id: '1',
    label: 'Imóveis Ativos',
    value: '2,847',
    increase: '+12%',
    icon: Home,
    description: 'Propriedades verificadas disponíveis',
  },
  {
    id: '2',
    label: 'Usuários Cadastrados',
    value: '18,542',
    increase: '+28%',
    icon: Users,
    description: 'Hóspedes e proprietários ativos',
  },
  {
    id: '3',
    label: 'Reservas Realizadas',
    value: '4,321',
    increase: '+45%',
    icon: Calendar,
    description: 'Estadias bem-sucedidas',
  },
  {
    id: '4',
    label: 'Cidades Cobertas',
    value: '127',
    increase: '+8%',
    icon: MapPin,
    description: 'Destinos disponíveis no Brasil',
  },
  {
    id: '5',
    label: 'Avaliação Média',
    value: '4.9',
    increase: '+2%',
    icon: Star,
    description: 'Nota de satisfação dos usuários',
  },
  {
    id: '6',
    label: 'Vendas Concluídas',
    value: '342',
    increase: '+67%',
    icon: TrendingUp,
    description: 'Imóveis vendidos através da plataforma',
  },
  {
    id: '7',
    label: 'Taxa de Sucesso',
    value: '94%',
    increase: '+5%',
    icon: Award,
    description: 'Conversão de hospedagem para venda',
  },
  {
    id: '8',
    label: 'Transações Seguras',
    value: '100%',
    increase: '0%',
    icon: Shield,
    description: 'Pagamentos protegidos e verificados',
  },
];

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Números que <span className="gradient-text">Impressionam</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nossa plataforma está crescendo rapidamente e transformando a forma como as pessoas 
            escolhem onde morar e investir em imóveis.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Crescimento <span className="gradient-text">Exponencial</span>
                  </h3>
                  <p className="text-muted-foreground">
                    Desde nosso lançamento, temos visto um crescimento consistente em todas as métricas. 
                    Nossa comunidade de usuários satisfeitos continua expandindo, e a confiança no 
                    conceito "Se Hospede para Comprar" está revolucionando o mercado imobiliário brasileiro.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-4 w-4 mr-2 text-accent" />
                      Startup do Ano 2024 - PropTech Brasil
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2 text-accent" />
                      Certificação de Segurança Digital
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-2 text-accent" />
                      Melhor Experiência do Usuário - HospitalityTech
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">R$ 2.8B</div>
                    <div className="text-sm text-muted-foreground">Volume Total Negociado</div>
                  </div>
                  <div className="text-center p-6 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary mb-1">15 min</div>
                    <div className="text-sm text-muted-foreground">Tempo Médio de Reserva</div>
                  </div>
                  <div className="text-center p-6 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Suporte Disponível</div>
                  </div>
                  <div className="text-center p-6 bg-orange-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500 mb-1">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime da Plataforma</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function StatCard({ 
  stat, 
  isVisible, 
  delay 
}: { 
  stat: Stat; 
  isVisible: boolean; 
  delay: number; 
}) {
  const [animatedValue, setAnimatedValue] = useState('0');

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedValue(stat.value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, stat.value, delay]);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <stat.icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl font-bold text-foreground">
            {isVisible ? animatedValue : '0'}
          </div>
          <div className="text-sm font-medium text-accent">
            {stat.increase} este mês
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">
            {stat.label}
          </h3>
          <p className="text-xs text-muted-foreground">
            {stat.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}