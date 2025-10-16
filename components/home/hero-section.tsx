'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Home,
  Heart,
  Star,
  ArrowRight,
} from 'lucide-react';

export function HeroSection() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [propertyType, setPropertyType] = useState('all');

  const handleSearch = () => {
    console.log({ location, checkIn, checkOut, guests, propertyType });
  };

  const stats = [
    { label: 'Imóveis Disponíveis', value: '2.5K+', icon: Home },
    { label: 'Clientes Satisfeitos', value: '15K+', icon: Heart },
    { label: 'Avaliação Média', value: '4.9★', icon: Star },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              <span className="text-white">Se Hospede</span>
              <br />
              <span className="text-white">para</span>{' '}
              <span className="text-white">Comprar</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Experimente antes de comprar. Conheça o imóvel dos seus sonhos hospedando-se nele 
              e tome a melhor decisão de investimento da sua vida.
            </p>
          </div>

          {/* Search Card */}
          <Card className="max-w-6xl mx-auto p-6 sm:p-8 bg-white/95 backdrop-blur-md border-white/20 animate-slide-up">
            <div className="grid gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
              {/* Location */}
              <div className="lg:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-900 mb-2 block">
                  Onde?
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="Cidade, bairro ou região"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Check-in
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Check-out
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Hóspedes
                </Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="h-12">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hóspede</SelectItem>
                    <SelectItem value="2">2 hóspedes</SelectItem>
                    <SelectItem value="3">3 hóspedes</SelectItem>
                    <SelectItem value="4">4 hóspedes</SelectItem>
                    <SelectItem value="5">5+ hóspedes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div>
                <Button onClick={handleSearch} className="w-full h-12 text-base font-medium">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="condo">Condomínio</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Faixa de preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer preço</SelectItem>
                    <SelectItem value="0-200">R$ 0 - R$ 200</SelectItem>
                    <SelectItem value="200-500">R$ 200 - R$ 500</SelectItem>
                    <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                    <SelectItem value="1000+">R$ 1.000+</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Quartos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer quantidade</SelectItem>
                    <SelectItem value="1">1 quarto</SelectItem>
                    <SelectItem value="2">2 quartos</SelectItem>
                    <SelectItem value="3">3 quartos</SelectItem>
                    <SelectItem value="4+">4+ quartos</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  Mais filtros
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}