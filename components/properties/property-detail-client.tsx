'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageGallery } from './ImageGallery';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Bed,
  Bath,
  Square,
  Users,
  Calendar,
  MessageCircle,
  Shield,
  CheckCircle,
  ArrowLeft,
  Home as HomeIcon,
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
    dailyPrice: number;
    salePrice: number;
    rating: number;
    reviewCount: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    maxGuests: number;
    type: string;
    description: string;
    amenities: string[];
    host: {
      name: string;
      avatar: string;
      rating: number;
      reviewCount: number;
      verified: boolean;
    };
    checkIn: string;
    checkOut: string;
    minimumStay: number;
    instantBook: boolean;
    videoUrl?: string;
  };
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleReserve = () => {
    // Redirect to external booking page with property data
    const searchParams = new URLSearchParams({
      propertyId: property.id,
      title: property.title,
      location: property.location,
      image: property.images[0],
      dailyPrice: property.dailyPrice.toString(),
      maxGuests: property.maxGuests.toString()
    });
    window.location.href = `/reserva/${property.id}/revisao?${searchParams.toString()}`;
  };

  const handleContact = () => {
    router.push('/dashboard/messages');
  };

  return (
    <>
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Property Images */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <ImageGallery 
          images={property.images} 
          title={property.title}
          videoUrl={property.videoUrl}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
        />
      </section>

      {/* Property Info */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Location */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{property.type}</Badge>
                {property.instantBook && (
                  <Badge variant="secondary">Reserva Instantânea</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium ml-1">{property.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({property.reviewCount} avaliações)
              </span>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-4 gap-4 py-4 border-y border-border">
              <div className="text-center">
                <Bed className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm font-medium">{property.bedrooms}</div>
                <div className="text-xs text-muted-foreground">Quartos</div>
              </div>
              <div className="text-center">
                <Bath className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm font-medium">{property.bathrooms}</div>
                <div className="text-xs text-muted-foreground">Banheiros</div>
              </div>
              <div className="text-center">
                <Square className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm font-medium">{property.area}m²</div>
                <div className="text-xs text-muted-foreground">Área</div>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm font-medium">{property.maxGuests}</div>
                <div className="text-xs text-muted-foreground">Hóspedes</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Sobre este imóvel</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={property.host.avatar} />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{property.host.name}</h3>
                      {property.host.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {property.host.rating} ({property.host.reviewCount} avaliações)
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={handleContact} className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Conversar com o anfitrião
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* Pricing */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Hospedagem</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        R$ {property.dailyPrice.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-sm text-muted-foreground">/noite</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <HomeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Compra</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">
                        R$ {(property.salePrice / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>

                {/* Check-in/out times */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Check-in:</span>
                    <div className="font-medium">{property.checkIn}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Check-out:</span>
                    <div className="font-medium">{property.checkOut}</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Estadia mínima: {property.minimumStay} noites
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button onClick={handleReserve} className="w-full" size="lg">
                    Reservar Agora
                  </Button>
                  <Button variant="outline" className="w-full">
                    Solicitar Informações de Compra
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Você não será cobrado ainda
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}