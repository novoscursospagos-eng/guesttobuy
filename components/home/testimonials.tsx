'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  property: string;
  location: string;
  type: 'guest' | 'host' | 'buyer';
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Silva',
    role: 'Compradora',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Incrível poder experimentar morar no apartamento antes de comprar! Passei uma semana hospedada e me apaixonei pela vista e pela localização. Hoje é minha nova casa.',
    property: 'Apartamento em Ipanema',
    location: 'Rio de Janeiro, RJ',
    type: 'buyer',
    verified: true,
  },
  {
    id: '2',
    name: 'Carlos Roberto',
    role: 'Proprietário',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Como proprietário, o Guest to Buy revolucionou meu negócio. Consigo gerar renda com hospedagem enquanto procuro o comprador ideal. Já vendi 2 imóveis através da plataforma.',
    property: 'Casa na Barra da Tijuca',
    location: 'Rio de Janeiro, RJ',
    type: 'host',
    verified: true,
  },
  {
    id: '3',
    name: 'Ana Beatriz',
    role: 'Hóspede',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Excelente conceito! Mesmo sem intenção de comprar, a hospedagem foi perfeita. O apartamento era exatamente como nas fotos, e o proprietário foi muito atencioso.',
    property: 'Studio em Copacabana',
    location: 'Rio de Janeiro, RJ',
    type: 'guest',
    verified: true,
  },
  {
    id: '4',
    name: 'Ricardo Oliveira',
    role: 'Comprador',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Processo muito transparente e seguro. A equipe me ajudou em todas as etapas, desde a hospedagem até a finalização da compra. Recomendo para quem quer investir com segurança.',
    property: 'Loft em Vila Madalena',
    location: 'São Paulo, SP',
    type: 'buyer',
    verified: true,
  },
  {
    id: '5',
    name: 'Juliana Santos',
    role: 'Proprietária',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Cadastrei meu apartamento sem esperanças, mas em 3 meses consegui vender para uma hóspede que se apaixonou pelo imóvel. O suporte da equipe foi fundamental.',
    property: 'Apartamento em Moema',
    location: 'São Paulo, SP',
    type: 'host',
    verified: true,
  },
  {
    id: '6',
    name: 'Pedro Henrique',
    role: 'Hóspede',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: 'Interface muito intuitiva e processo de reserva super simples. O chat com o proprietário funcionou perfeitamente. Pretendo usar novamente em minhas próximas viagens.',
    property: 'Casa no Leblon',
    location: 'Rio de Janeiro, RJ',
    type: 'guest',
    verified: true,
  },
];

const typeLabels = {
  guest: 'Hóspede',
  host: 'Proprietário',
  buyer: 'Comprador',
};

const typeColors = {
  guest: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  host: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  buyer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            O que Nossos <span className="gradient-text">Usuários Dizem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Histórias reais de pessoas que transformaram suas vidas através da nossa plataforma. 
            Conheça as experiências de hóspedes, proprietários e compradores.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">4.9/5</div>
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação média</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">98%</div>
              <div className="text-sm text-muted-foreground mb-2">dos usuários</div>
              <div className="text-sm text-muted-foreground">recomendam a plataforma</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">94%</div>
              <div className="text-sm text-muted-foreground mb-2">taxa de conversão</div>
              <div className="text-sm text-muted-foreground">hospedagem para compra</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6 space-y-4">
        {/* Quote Icon */}
        <div className="flex justify-between items-start">
          <Quote className="h-6 w-6 text-primary/40" />
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <blockquote className="text-muted-foreground text-sm leading-relaxed">
          "{testimonial.content}"
        </blockquote>

        {/* Property Info */}
        <div className="pt-4 border-t border-border space-y-2">
          <div className="text-sm font-medium text-foreground">
            {testimonial.property}
          </div>
          <div className="text-xs text-muted-foreground">
            {testimonial.location}
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pt-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>
              {testimonial.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">
                {testimonial.name}
              </p>
              {testimonial.verified && (
                <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={`text-xs ${typeColors[testimonial.type]}`}>
                {typeLabels[testimonial.type]}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}