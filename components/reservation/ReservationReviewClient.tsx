'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Star,
  Home,
  CheckCircle,
  AlertCircle,
  Tag,
  MessageSquare,
} from 'lucide-react';

interface ReservationReviewClientProps {
  propertyId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ReservationReviewClient({ 
  propertyId, 
  searchParams 
}: ReservationReviewClientProps) {
  const router = useRouter();
  
  // Get property data from URL params
  const [propertyData, setPropertyData] = useState({
    id: propertyId,
    title: (searchParams.title as string) || '',
    location: (searchParams.location as string) || '',
    image: (searchParams.image as string) || '',
    dailyPrice: parseInt((searchParams.dailyPrice as string) || '0'),
    maxGuests: parseInt((searchParams.maxGuests as string) || '2'),
  });

  // Booking form state
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [couponCode, setCouponCode] = useState('');
  const [observations, setObservations] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Get dates from URL params if available
  useEffect(() => {
    const checkinParam = searchParams.checkin as string;
    const checkoutParam = searchParams.checkout as string;
    const guestsParam = searchParams.hospedes as string;

    if (checkinParam) setCheckIn(new Date(checkinParam));
    if (checkoutParam) setCheckOut(new Date(checkoutParam));
    if (guestsParam) setGuests(guestsParam);
  }, [searchParams]);

  // Blocked dates (simulate unavailable dates)
  const blockedDates = [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 11, 31), // New Year's Eve
    addDays(new Date(), 5),  // 5 days from now
    addDays(new Date(), 12), // 12 days from now
  ];

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => 
      date.toDateString() === blockedDate.toDateString()
    );
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      setError('Por favor, selecione as datas de check-in e check-out.');
      return false;
    }

    if (checkIn >= checkOut) {
      setError('A data de check-out deve ser posterior ao check-in.');
      return false;
    }

    if (isDateBlocked(checkIn) || isDateBlocked(checkOut)) {
      setError('Uma ou ambas as datas selecionadas não estão disponíveis.');
      return false;
    }

    // Check if any date in the range is blocked
    const nights = differenceInDays(checkOut, checkIn);
    for (let i = 0; i < nights; i++) {
      const currentDate = addDays(checkIn, i);
      if (isDateBlocked(currentDate)) {
        setError('Há datas indisponíveis no período selecionado.');
        return false;
      }
    }

    return true;
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const subtotal = nights * propertyData.dailyPrice;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const cleaningFee = 50;
    const discount = couponDiscount;
    const total = subtotal + serviceFee + cleaningFee - discount;
    
    return {
      nights,
      subtotal,
      serviceFee,
      cleaningFee,
      discount,
      total: Math.max(total, 0),
    };
  };

  const applyCoupon = () => {
    // Simulate coupon validation
    const validCoupons = {
      'DESCONTO10': 0.1,
      'PRIMEIRAVIAGEM': 0.15,
      'FIDELIDADE': 0.05,
    };

    const couponUpper = couponCode.toUpperCase();
    if (validCoupons[couponUpper as keyof typeof validCoupons]) {
      const discountPercent = validCoupons[couponUpper as keyof typeof validCoupons];
      const subtotal = calculateNights() * propertyData.dailyPrice;
      setCouponDiscount(subtotal * discountPercent);
      setError('');
    } else if (couponCode) {
      setError('Cupom inválido.');
      setCouponDiscount(0);
    } else {
      setCouponDiscount(0);
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate dates and availability
      if (!validateDates()) {
        return;
      }

      if (!acceptTerms) {
        setError('Você deve aceitar os termos e condições.');
        return;
      }

      if (parseInt(guests) > propertyData.maxGuests) {
        setError(`Número máximo de hóspedes: ${propertyData.maxGuests}`);
        return;
      }

      // Generate booking ID
      const bookingId = `GTB${Date.now()}`;
      const pricing = calculateTotal();

      // Create booking data
      const bookingData = {
        id: bookingId,
        propertyId: propertyData.id,
        propertyTitle: propertyData.title,
        propertyLocation: propertyData.location,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        nights: pricing.nights,
        guests: parseInt(guests),
        dailyPrice: propertyData.dailyPrice,
        subtotal: pricing.subtotal,
        serviceFee: pricing.serviceFee,
        cleaningFee: pricing.cleaningFee,
        discount: pricing.discount,
        total: pricing.total,
        couponCode: couponCode || null,
        observations: observations || null,
        status: 'Pendente',
        createdAt: new Date().toISOString(),
        channel: 'Website',
        guestName: 'Usuário Logado', // Would come from auth context
        hostName: 'João Silva', // Would come from property data
      };

      // Simulate API call to create booking
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to localStorage (simulate database)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      // Prepare WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `Olá! Acabei de fazer uma RESERVA via GUEST to BUY.\n` +
        `• Reserva: ${bookingId}\n` +
        `• Imóvel: ${propertyData.title}\n` +
        `• Datas: ${checkIn ? format(checkIn, 'dd/MM/yyyy') : ''} → ${checkOut ? format(checkOut, 'dd/MM/yyyy') : ''} (${pricing.nights} noites)\n` +
        `• Hóspedes: ${guests}\n` +
        `• Total: R$ ${pricing.total.toLocaleString('pt-BR')}\n` +
        `• Link: ${window.location.origin}/reserva/${bookingId}`
      );

      // Redirect to WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=5521995885999&text=${whatsappMessage}&type=phone_number&app_absent=0`;
      window.open(whatsappUrl, '_blank');

      // Redirect to confirmation or dashboard
      router.push('/dashboard');

    } catch (err) {
      setError('Erro ao processar reserva. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => router.push(`/properties/${propertyData.id}`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao imóvel
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Revisão da Reserva
            </h1>
            <p className="text-muted-foreground">
              Confirme os detalhes da sua reserva
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={propertyData.image}
                    alt={propertyData.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {propertyData.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {propertyData.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">4.9</span>
                      <span className="text-sm text-muted-foreground ml-1">(127 avaliações)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Datas da Estadia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check-in</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
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
                          disabled={(date) => date < new Date() || isDateBlocked(date)}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
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
                          disabled={(date) => date <= (checkIn || new Date()) || isDateBlocked(date)}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Número de Hóspedes</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: propertyData.maxGuests }, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Cupom de Desconto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite seu cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Aplicar
                  </Button>
                </div>
                {couponDiscount > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Desconto aplicado: R$ {couponDiscount.toLocaleString('pt-BR')}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Alguma solicitação especial ou observação?"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricing.nights > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span>R$ {propertyData.dailyPrice.toLocaleString('pt-BR')} x {pricing.nights} noites</span>
                      <span>R$ {pricing.subtotal.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de serviço</span>
                      <span>R$ {pricing.serviceFee.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de limpeza</span>
                      <span>R$ {pricing.cleaningFee.toLocaleString('pt-BR')}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto do cupom</span>
                        <span>-R$ {pricing.discount.toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>R$ {pricing.total.toLocaleString('pt-BR')}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Selecione as datas para ver o preço total
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Aceito os termos e condições
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Ao confirmar, você concorda com nossos{' '}
                      <a href="/terms" className="underline hover:text-foreground">
                        termos de uso
                      </a>{' '}
                      e{' '}
                      <a href="/privacy" className="underline hover:text-foreground">
                        política de privacidade
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleConfirmBooking}
                disabled={isLoading || pricing.nights === 0 || !acceptTerms}
                className="w-full" 
                size="lg"
              >
                {isLoading ? 'Processando...' : 'Confirmar Reserva'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push(`/properties/${propertyData.id}`)}
                className="w-full"
              >
                Voltar ao Imóvel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Após confirmar, você será redirecionado para o WhatsApp para finalizar o processo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}