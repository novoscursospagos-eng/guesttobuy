'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MapPin,
  Star,
  Bed,
  Bath,
  Square,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react';

// Get published properties from localStorage
const getPublishedProperties = () => {
  if (typeof window !== 'undefined') {
    const storedProperties = localStorage.getItem('publishedProperties');
    if (storedProperties) {
      return JSON.parse(storedProperties).filter((property: Property) => 
        property.status === 'published'
      );
    }
  }
  return [];
};


interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  images?: string[];
  dailyPrice: number;
  salePrice: number;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  maxGuests: number;
  availability: string;
  type: string;
  createdAt?: string;
  featured?: boolean;
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  publishedAt?: string;
}

const featuredProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Moderno em Ipanema',
    location: 'Ipanema, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ],
    dailyPrice: 350,
    salePrice: 1200000,
    rating: 4.9,
    reviewCount: 127,
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    maxGuests: 4,
    availability: 'Disponível',
    type: 'Apartamento',
    featured: true,
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Casa de Luxo na Barra da Tijuca',
    location: 'Barra da Tijuca, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ],
    dailyPrice: 580,
    salePrice: 2500000,
    rating: 4.8,
    reviewCount: 89,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    maxGuests: 8,
    availability: 'Disponível',
    type: 'Casa',
    featured: true,
    status: 'published',
    publishedAt: '2024-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: 'Studio Charmoso em Copacabana',
    location: 'Copacabana, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ],
    dailyPrice: 220,
    salePrice: 780000,
    rating: 4.7,
    reviewCount: 203,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    maxGuests: 2,
    availability: 'Disponível',
    type: 'Studio',
    status: 'published',
    publishedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    title: 'Penthouse com Vista Mar',
    location: 'Leblon, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ],
    dailyPrice: 950,
    salePrice: 4200000,
    rating: 5.0,
    reviewCount: 76,
    bedrooms: 3,
    bathrooms: 4,
    area: 180,
    maxGuests: 6,
    availability: 'Disponível',
    type: 'Penthouse',
    featured: true,
    status: 'published',
    publishedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '5',
    title: 'Loft Industrial em Vila Madalena',
    location: 'Vila Madalena, São Paulo',
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ],
    dailyPrice: 420,
    salePrice: 1800000,
    rating: 4.6,
    reviewCount: 154,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    maxGuests: 4,
    availability: 'Disponível',
    type: 'Loft',
    status: 'published',
    publishedAt: '2024-01-11T11:45:00Z',
  },
  {
    id: '6',
    title: 'Apartamento Familiar em Moema',
    location: 'Moema, São Paulo',
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ],
    dailyPrice: 380,
    salePrice: 1650000,
    rating: 4.8,
    reviewCount: 98,
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    maxGuests: 6,
    availability: 'Disponível',
    type: 'Apartamento',
    status: 'published',
    publishedAt: '2024-01-10T16:30:00Z',
  },
];

// Initialize published properties in localStorage if not exists
const initializePublishedProperties = () => {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('publishedProperties');
    if (!existing) {
      localStorage.setItem('publishedProperties', JSON.stringify(featuredProperties));
    }
  }
};

export function FeaturedProperties() {
  const [displayProperties, setDisplayProperties] = useState<Property[]>(featuredProperties);

  useEffect(() => {
    // Initialize published properties
    initializePublishedProperties();
    
    // Get published properties from localStorage
    const publishedProperties = getPublishedProperties();
    const allProperties = publishedProperties.length > 0 ? publishedProperties : featuredProperties;
    
    // Sort by creation date (most recent first) and take first 6
    const sortedProperties = allProperties
      .sort((a: Property, b: Property) => new Date(b.publishedAt || b.createdAt || '2024-01-01').getTime() - new Date(a.publishedAt || a.createdAt || '2024-01-01').getTime())
      .slice(0, 6);
    
    setDisplayProperties(sortedProperties);
  }, []);
  
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Imóveis em <span className="gradient-text">Destaque</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Descubra propriedades únicas que você pode conhecer hospedando-se e depois adquirir. 
            Cada imóvel oferece uma experiência completa de moradia.
          </p>
        </div>

        {/* Featured Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/properties">
            <Button size="lg" className="text-base px-8 py-3">
              Ver Todos os Imóveis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden property-card group cursor-pointer">
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url('${property.images?.[0] || property.image}')` }}
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.featured && (
            <Badge className="bg-accent text-accent-foreground">Destaque</Badge>
          )}
          <Badge variant={property.availability === 'Disponível' ? 'default' : 'secondary'}>
            {property.availability}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title and Location */}
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{property.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({property.reviewCount} avaliações)
          </span>
        </div>

        {/* Property Details */}
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

        {/* Pricing */}
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

        {/* CTA Buttons */}
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
                image: property.images?.[0] || property.image || '',
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
  );
}