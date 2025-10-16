'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  Bed,
  Bath,
  Square,
  Users,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const properties = [
  {
    id: '1',
    title: 'Apartamento Moderno em Ipanema',
    location: 'Ipanema, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    dailyPrice: 350,
    salePrice: 1200000,
    rating: 4.9,
    reviewCount: 127,
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    maxGuests: 4,
    type: 'Apartamento',
    amenities: ['Wi-Fi', 'Piscina', 'Academia'],
  },
  {
    id: '2',
    title: 'Casa de Luxo na Barra da Tijuca',
    location: 'Barra da Tijuca, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    dailyPrice: 580,
    salePrice: 2500000,
    rating: 4.8,
    reviewCount: 89,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    maxGuests: 8,
    type: 'Casa',
    amenities: ['Wi-Fi', 'Piscina', 'Jardim', 'Churrasqueira'],
  },
  {
    id: '3',
    title: 'Studio Charmoso em Copacabana',
    location: 'Copacabana, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    dailyPrice: 220,
    salePrice: 780000,
    rating: 4.7,
    reviewCount: 203,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    maxGuests: 2,
    type: 'Studio',
    amenities: ['Wi-Fi', 'TV', 'Cozinha'],
  },
  {
    id: '4',
    title: 'Penthouse com Vista Mar',
    location: 'Leblon, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    dailyPrice: 950,
    salePrice: 4200000,
    rating: 5.0,
    reviewCount: 76,
    bedrooms: 3,
    bathrooms: 4,
    area: 180,
    maxGuests: 6,
    type: 'Penthouse',
    amenities: ['Wi-Fi', 'Piscina', 'Academia', 'Varanda', 'Vista Mar'],
  },
  {
    id: '5',
    title: 'Loft Industrial em Vila Madalena',
    location: 'Vila Madalena, São Paulo',
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    dailyPrice: 420,
    salePrice: 1800000,
    rating: 4.6,
    reviewCount: 154,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    maxGuests: 4,
    type: 'Loft',
    amenities: ['Wi-Fi', 'TV', 'Cozinha', 'Varanda'],
  },
  {
    id: '6',
    title: 'Apartamento Familiar em Moema',
    location: 'Moema, São Paulo',
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    dailyPrice: 380,
    salePrice: 1650000,
    rating: 4.8,
    reviewCount: 98,
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    maxGuests: 6,
    type: 'Apartamento',
    amenities: ['Wi-Fi', 'Piscina', 'Playground', 'Portaria 24h'],
  },
];

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dailyPriceRange, setDailyPriceRange] = useState([0, 1000]);
  const [salePriceRange, setSalePriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [displayedProperties, setDisplayedProperties] = useState(6);
  const [allProperties, setAllProperties] = useState(properties);
  const router = useRouter();

  const loadMoreProperties = () => {
    setDisplayedProperties(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                Explore <span className="gradient-text">Imóveis Únicos</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubra propriedades incríveis para hospedagem e compra. Experimente antes de investir.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por cidade, bairro ou região..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:w-auto"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                  <Button className="lg:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label>Tipo de Imóvel</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="apartment">Apartamento</SelectItem>
                            <SelectItem value="house">Casa</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="loft">Loft</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Quartos</Label>
                        <Select value={bedrooms} onValueChange={setBedrooms}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Qualquer</SelectItem>
                            <SelectItem value="1">1 quarto</SelectItem>
                            <SelectItem value="2">2 quartos</SelectItem>
                            <SelectItem value="3">3 quartos</SelectItem>
                            <SelectItem value="4+">4+ quartos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Valor de Hospedagem (R$/noite)</Label>
                        <div className="px-2">
                          <Slider
                            value={dailyPriceRange}
                            onValueChange={setDailyPriceRange}
                            max={1000}
                            step={50}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>R$ {dailyPriceRange[0]}</span>
                            <span>R$ {dailyPriceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Valor do Imóvel</Label>
                        <Select value={salePriceRange} onValueChange={setSalePriceRange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Qualquer valor</SelectItem>
                            <SelectItem value="300-500k">R$ 300K - R$ 500K</SelectItem>
                            <SelectItem value="500k-1m">R$ 500K - R$ 1M</SelectItem>
                            <SelectItem value="1m-5m">R$ 1M - R$ 5M</SelectItem>
                            <SelectItem value="5m+">Mais de R$ 5M</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Comodidades</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="wifi" />
                            <Label htmlFor="wifi" className="text-sm">Wi-Fi</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="pool" />
                            <Label htmlFor="pool" className="text-sm">Piscina</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="gym" />
                            <Label htmlFor="gym" className="text-sm">Academia</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {properties.length} imóveis encontrados
              </h2>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Mais relevantes</SelectItem>
                  <SelectItem value="price-low">Menor preço</SelectItem>
                  <SelectItem value="price-high">Maior preço</SelectItem>
                  <SelectItem value="rating">Melhor avaliação</SelectItem>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProperties.slice(0, displayedProperties).map((property) => (
                <Card key={property.id} className="overflow-hidden property-card group cursor-pointer">
                  <div className="relative">
                    <div 
                      className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url('${property.image}')` }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-4 left-4">
                      {property.type}
                    </Badge>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{property.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({property.reviewCount} avaliações)
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 py-2 border-t border-border">
                      <div className="text-center">
                        <Bed className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{property.bedrooms}</span>
                      </div>
                      <div className="text-center">
                        <Bath className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{property.bathrooms}</span>
                      </div>
                      <div className="text-center">
                        <Square className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{property.area}m²</span>
                      </div>
                      <div className="text-center">
                        <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{property.maxGuests}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Hospedagem</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-lg text-foreground">
                            R$ {property.dailyPrice.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-sm text-muted-foreground">/noite</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Compra</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-lg text-primary">
                            R$ {(property.salePrice / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Link href={`/properties/${property.id}`}>
                        <Button variant="outline" className="w-full text-sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Button 
                        className="w-full text-sm"
                        onClick={() => {
                          // Redirect to external booking page with property data
                          const params = new URLSearchParams({
                            propertyId: property.id,
                            title: property.title,
                            location: property.location,
                            image: property.image,
                            dailyPrice: property.dailyPrice.toString(),
                            maxGuests: property.maxGuests.toString()
                          });
                          window.location.href = `/reserva/${property.id}/revisao?${params.toString()}`;
                        }}
                      >
                        Reservar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {displayedProperties < allProperties.length && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" onClick={loadMoreProperties}>
                  Carregar Mais Imóveis
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}