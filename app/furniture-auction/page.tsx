'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Clock,
  Gavel,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Timer,
  DollarSign,
  Package,
  Truck,
  Shield,
  Award,
} from 'lucide-react';

const auctions = [
  {
    id: '1',
    title: 'Sofá de Couro Italiano Premium',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    currentBid: 2500,
    startingBid: 1200,
    timeLeft: '2h 15m',
    bidCount: 23,
    watchers: 156,
    condition: 'Excelente',
    category: 'Sala de Estar',
    seller: 'Casa Moderna Ipanema',
    location: 'Rio de Janeiro, RJ',
    status: 'active',
  },
  {
    id: '2',
    title: 'Mesa de Jantar Madeira Maciça',
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    currentBid: 1800,
    startingBid: 800,
    timeLeft: '5h 42m',
    bidCount: 18,
    watchers: 89,
    condition: 'Muito Bom',
    category: 'Sala de Jantar',
    seller: 'Loft Vila Madalena',
    location: 'São Paulo, SP',
    status: 'active',
  },
  {
    id: '3',
    title: 'Cama King Size com Cabeceira',
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    currentBid: 3200,
    startingBid: 1500,
    timeLeft: '1d 3h',
    bidCount: 31,
    watchers: 203,
    condition: 'Excelente',
    category: 'Quarto',
    seller: 'Penthouse Leblon',
    location: 'Rio de Janeiro, RJ',
    status: 'active',
  },
  {
    id: '4',
    title: 'Conjunto de Poltronas Design',
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    currentBid: 1200,
    startingBid: 600,
    timeLeft: 'Finalizado',
    bidCount: 15,
    watchers: 67,
    condition: 'Bom',
    category: 'Sala de Estar',
    seller: 'Apartamento Moema',
    location: 'São Paulo, SP',
    status: 'ended',
  },
  {
    id: '5',
    title: 'Estante Modular Planejada',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    currentBid: 950,
    startingBid: 400,
    timeLeft: '12h 28m',
    bidCount: 12,
    watchers: 45,
    condition: 'Muito Bom',
    category: 'Escritório',
    seller: 'Studio Copacabana',
    location: 'Rio de Janeiro, RJ',
    status: 'active',
  },
  {
    id: '6',
    title: 'Mesa de Centro Vidro Temperado',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    currentBid: 680,
    startingBid: 300,
    timeLeft: '8h 15m',
    bidCount: 9,
    watchers: 34,
    condition: 'Excelente',
    category: 'Sala de Estar',
    seller: 'Casa Barra da Tijuca',
    location: 'Rio de Janeiro, RJ',
    status: 'active',
  },
];

const categories = [
  'Todos',
  'Sala de Estar',
  'Sala de Jantar',
  'Quarto',
  'Escritório',
  'Cozinha',
  'Banheiro',
  'Área Externa',
];

export default function FurnitureAuctionPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [bidAmount, setBidAmount] = useState<{ [key: string]: string }>({});

  const filteredAuctions = selectedCategory === 'Todos' 
    ? auctions 
    : auctions.filter(auction => auction.category === selectedCategory);

  const handleBid = (auctionId: string) => {
    const amount = bidAmount[auctionId];
    if (amount) {
      console.log(`Bid placed: R$ ${amount} for auction ${auctionId}`);
      // Here you would handle the bid submission
    }
  };

  const setBidAmountForAuction = (auctionId: string, amount: string) => {
    setBidAmount(prev => ({ ...prev, [auctionId]: amount }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="mb-4">Leilão de Móveis</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                <span className="gradient-text">Móveis Únicos</span>
                <br />
                em <span className="gradient-text">Leilão</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Encontre móveis de qualidade de imóveis vendidos na plataforma. 
                Peças exclusivas com preços incríveis através de leilões online.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
              {[
                { icon: Gavel, label: 'Leilões Ativos', value: '47' },
                { icon: Package, label: 'Móveis Disponíveis', value: '234' },
                { icon: Users, label: 'Participantes', value: '1.2K+' },
                { icon: Award, label: 'Economia Média', value: '65%' },
              ].map((stat, index) => (
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
        </section>

        {/* Categories */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Auctions Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {filteredAuctions.length} leilões encontrados
              </h2>
              <p className="text-muted-foreground">
                Móveis de qualidade com preços imperdíveis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAuctions.map((auction) => (
                <Card key={auction.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div 
                      className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url('${auction.image}')` }}
                    />
                    <Badge 
                      className={`absolute top-4 left-4 ${
                        auction.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      {auction.status === 'active' ? 'Ativo' : 'Finalizado'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg px-3 py-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-foreground">
                          {auction.timeLeft}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {auction.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {auction.seller} • {auction.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{auction.category}</Badge>
                      <Badge variant="secondary">{auction.condition}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Lance atual:</span>
                        <span className="text-lg font-bold text-foreground">
                          R$ {auction.currentBid.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Lance inicial: R$ {auction.startingBid.toLocaleString('pt-BR')}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Gavel className="h-4 w-4" />
                            {auction.bidCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {auction.watchers}
                          </div>
                        </div>
                      </div>
                    </div>

                    {auction.status === 'active' && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder={`Min: R$ ${auction.currentBid + 50}`}
                            value={bidAmount[auction.id] || ''}
                            onChange={(e) => setBidAmountForAuction(auction.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleBid(auction.id)}
                            disabled={!bidAmount[auction.id] || parseInt(bidAmount[auction.id]) <= auction.currentBid}
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            Dar Lance
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full text-sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    )}

                    {auction.status === 'ended' && (
                      <div className="pt-4 border-t border-border">
                        <Button variant="outline" className="w-full" disabled>
                          Leilão Finalizado
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Como Funciona o <span className="gradient-text">Leilão</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Processo simples e seguro para adquirir móveis de qualidade
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: Eye,
                  title: 'Explore',
                  description: 'Navegue pelos móveis disponíveis e encontre peças que combinam com seu estilo.',
                },
                {
                  icon: Gavel,
                  title: 'Dê Lances',
                  description: 'Participe dos leilões dando lances nos móveis que deseja adquirir.',
                },
                {
                  icon: DollarSign,
                  title: 'Ganhe',
                  description: 'Se seu lance for o maior, você ganha o móvel pelo preço final do leilão.',
                },
                {
                  icon: Truck,
                  title: 'Receba',
                  description: 'Organizamos a entrega segura do móvel diretamente na sua casa.',
                },
              ].map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Vantagens do <span className="gradient-text">Leilão de Móveis</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: 'Preços Incríveis',
                  description: 'Economia média de 65% comparado ao preço de varejo. Móveis de qualidade por preços justos.',
                },
                {
                  icon: Shield,
                  title: 'Garantia de Qualidade',
                  description: 'Todos os móveis são inspecionados e vêm com garantia. Compre com total segurança.',
                },
                {
                  icon: Truck,
                  title: 'Entrega Segura',
                  description: 'Entrega profissional e montagem incluída. Receba seus móveis prontos para usar.',
                },
              ].map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl text-foreground mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
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
                Pronto para Encontrar Móveis Únicos?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Cadastre-se gratuitamente e comece a participar dos leilões. 
                Móveis de qualidade esperando por você.
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Começar a Participar
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}