'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Upload, MapPin, DollarSign, Calendar, Users, Bed, Bath, Square, Wifi, Car, Tv, Coffee, ArrowLeft, Save, Eye, Plus, X, CheckCircle, AlertCircle, LogOut, CookingPot as SwimmingPool, Dumbbell, Building, Leaf } from 'lucide-react';
import { Play } from 'lucide-react';
import { brazilianStates, getCitiesByState, formatCEP, fetchAddressByCEP } from '@/lib/brazilian-locations';

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  maxGuests: string;
  dailyPrice: string;
  salePrice: string;
  minimumStay: string;
  checkInTime: string;
  checkOutTime: string;
  furnished: boolean;
  availableForSale: boolean;
  instantBook: boolean;
}

export default function NewPropertyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    maxGuests: '',
    dailyPrice: '',
    salePrice: '',
    minimumStay: '1',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    furnished: true,
    availableForSale: true,
    instantBook: false,
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const availableAmenities = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'parking', label: 'Estacionamento', icon: Car },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'kitchen', label: 'Cozinha', icon: Coffee },
    { id: 'pool', label: 'Piscina', icon: Home },
    { id: 'gym', label: 'Academia', icon: Home },
    { id: 'balcony', label: 'Varanda', icon: Home },
    { id: 'garden', label: 'Jardim', icon: Home },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'host' || parsedUser.role === 'realtor') {
        setUser(parsedUser);
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    if (typeof value === 'string') {
      let formattedValue = value;
      
      if (field === 'zipCode') {
        formattedValue = formatCEP(value);
        
        // Auto-fill address when CEP is complete
        if (formattedValue.length === 9) {
          handleCEPLookup(formattedValue);
        }
      }
      
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
      
      // Update available cities when state changes
      if (field === 'state') {
        const cities = getCitiesByState(value);
        setAvailableCities(cities);
        setFormData(prev => ({ ...prev, city: '' })); // Reset city when state changes
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCEPLookup = async (cep: string) => {
    setIsLoadingCEP(true);
    try {
      const addressData = await fetchAddressByCEP(cep);
      setFormData(prev => ({
        ...prev,
        address: addressData.address,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
      }));
      
      // Update available cities for the found state
      const cities = getCitiesByState(addressData.state);
      setAvailableCities(cities);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 10)); // Limit to 10 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setErrorMessage('O vídeo deve ter no máximo 100MB.');
        return;
      }
      setVideoFile(file);
      setErrorMessage('');
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.propertyType);
      case 2:
        return !!(formData.address && formData.city && formData.state);
      case 3:
        return !!(formData.bedrooms && formData.bathrooms && formData.area && formData.maxGuests);
      case 4:
        return !!(formData.dailyPrice && (formData.availableForSale ? formData.salePrice : true));
      case 5:
        return images.length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      setErrorMessage('');
    } else {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create property object
      const propertyData = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        location: `${formData.city}, ${formData.state}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        maxGuests: parseInt(formData.maxGuests),
        dailyPrice: parseInt(formData.dailyPrice),
        salePrice: formData.availableForSale ? parseInt(formData.salePrice) : 0,
        minimumStay: parseInt(formData.minimumStay),
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        furnished: formData.furnished,
        availableForSale: formData.availableForSale,
        instantBook: formData.instantBook,
        amenities,
        images: images.map(img => URL.createObjectURL(img)), // In real app, upload to server
        videoFile: videoFile ? URL.createObjectURL(videoFile) : null,
        type: formData.propertyType,
        availability: 'Disponível',
        rating: 0,
        reviewCount: 0,
        status: 'pending', // Properties need approval
        createdAt: new Date().toISOString(),
        ownerName: user.name,
        ownerEmail: user.email,
      };

      // Save to pending properties
      const existingPending = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
      existingPending.push(propertyData);
      localStorage.setItem('pendingProperties', JSON.stringify(existingPending));
      
      setSuccessMessage('Imóvel cadastrado com sucesso! Aguardando aprovação da equipe.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setErrorMessage('Erro ao cadastrar imóvel. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Informações Básicas', description: 'Título, descrição e tipo' },
    { number: 2, title: 'Localização', description: 'Endereço completo' },
    { number: 3, title: 'Detalhes', description: 'Quartos, banheiros, área' },
    { number: 4, title: 'Preços', description: 'Diária e venda' },
    { number: 5, title: 'Fotos', description: 'Imagens do imóvel' },
    { number: 6, title: 'Revisão', description: 'Confirmar dados' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Home className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Cadastrar Imóvel</h1>
              <p className="text-xs text-muted-foreground">Guest to Buy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              {user.name}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Form Steps */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Anúncio *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Apartamento Moderno em Ipanema"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva seu imóvel de forma atrativa..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Tipo de Imóvel *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartamento</SelectItem>
                      <SelectItem value="house">Casa</SelectItem>
                      <SelectItem value="condo">Condomínio</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <div className="relative">
                    <Input
                      id="zipCode"
                      placeholder="00000-000"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={isLoadingCEP ? 'pr-10' : ''}
                      maxLength={9}
                    />
                    {isLoadingCEP && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, complemento"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    placeholder="Nome do bairro"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => handleInputChange('city', value)}
                      disabled={!formData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.state ? "Selecione a cidade" : "Selecione o estado primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos *</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Studio</SelectItem>
                        <SelectItem value="1">1 quarto</SelectItem>
                        <SelectItem value="2">2 quartos</SelectItem>
                        <SelectItem value="3">3 quartos</SelectItem>
                        <SelectItem value="4">4 quartos</SelectItem>
                        <SelectItem value="5+">5+ quartos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Banheiros *</Label>
                    <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 banheiro</SelectItem>
                        <SelectItem value="2">2 banheiros</SelectItem>
                        <SelectItem value="3">3 banheiros</SelectItem>
                        <SelectItem value="4">4 banheiros</SelectItem>
                        <SelectItem value="5+">5+ banheiros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área (m²) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="85"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxGuests">Hóspedes *</Label>
                    <Select value={formData.maxGuests} onValueChange={(value) => handleInputChange('maxGuests', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="2" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hóspede</SelectItem>
                        <SelectItem value="2">2 hóspedes</SelectItem>
                        <SelectItem value="3">3 hóspedes</SelectItem>
                        <SelectItem value="4">4 hóspedes</SelectItem>
                        <SelectItem value="5">5 hóspedes</SelectItem>
                        <SelectItem value="6">6 hóspedes</SelectItem>
                        <SelectItem value="8">8 hóspedes</SelectItem>
                        <SelectItem value="10+">10+ hóspedes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Comodidades</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={amenities.includes(amenity.id)}
                          onCheckedChange={() => handleAmenityToggle(amenity.id)}
                        />
                        <Label htmlFor={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                          <amenity.icon className="h-4 w-4" />
                          <span>{amenity.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dailyPrice">Preço da Diária (R$) *</Label>
                    <Input
                      id="dailyPrice"
                      type="number"
                      placeholder="350"
                      value={formData.dailyPrice}
                      onChange={(e) => handleInputChange('dailyPrice', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumStay">Estadia Mínima (noites)</Label>
                    <Select value={formData.minimumStay} onValueChange={(value) => handleInputChange('minimumStay', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 noite</SelectItem>
                        <SelectItem value="2">2 noites</SelectItem>
                        <SelectItem value="3">3 noites</SelectItem>
                        <SelectItem value="7">1 semana</SelectItem>
                        <SelectItem value="30">1 mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="availableForSale"
                    checked={formData.availableForSale}
                    onCheckedChange={(checked) => handleInputChange('availableForSale', checked)}
                  />
                  <Label htmlFor="availableForSale">Disponível para venda</Label>
                </div>

                {formData.availableForSale && (
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      placeholder="1200000"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInTime">Horário Check-in</Label>
                    <Input
                      id="checkInTime"
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOutTime">Horário Check-out</Label>
                    <Input
                      id="checkOutTime"
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="furnished"
                      checked={formData.furnished}
                      onCheckedChange={(checked) => handleInputChange('furnished', checked)}
                    />
                    <Label htmlFor="furnished">Imóvel mobiliado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="instantBook"
                      checked={formData.instantBook}
                      onCheckedChange={(checked) => handleInputChange('instantBook', checked)}
                    />
                    <Label htmlFor="instantBook">Reserva instantânea</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Photos */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Images Section */}
                <div>
                  <Label className="text-base font-medium mb-4 block">Fotos do Imóvel *</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione pelo menos 5 fotos de alta qualidade. A primeira foto será a capa do anúncio.
                  </p>
                  
                  <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-primary hover:underline">Clique para fazer upload</span>
                        <span className="text-muted-foreground"> ou arraste as imagens aqui</span>
                      </Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF até 5MB cada. Máximo 10 fotos.
                      </p>
                    </div>
                  </div>
                </div>

                {images.length > 0 && (
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Fotos Selecionadas ({images.length}/10)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2">
                              Foto Principal
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Section */}
                <div>
                  <Label className="text-base font-medium mb-4 block">Vídeo do Imóvel (Opcional)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione um vídeo para mostrar melhor o imóvel. Formatos aceitos: MP4, MOV, AVI.
                  </p>
                  
                  {!videoFile ? (
                    <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center">
                      <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="video" className="cursor-pointer">
                          <span className="text-primary hover:underline">Clique para fazer upload do vídeo</span>
                        </Label>
                        <Input
                          id="video"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground">
                          MP4, MOV, AVI até 100MB.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <video
                          src={URL.createObjectURL(videoFile)}
                          controls
                          className="w-full max-h-64 rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeVideo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vídeo: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Revisão dos Dados</h3>
                  <p className="text-muted-foreground mb-6">
                    Revise todas as informações antes de publicar seu anúncio.
                  </p>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Título:</strong> {formData.title}</p>
                      <p><strong>Tipo:</strong> {formData.propertyType}</p>
                      <p><strong>Descrição:</strong> {formData.description.substring(0, 100)}...</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Localização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Endereço:</strong> {formData.address}</p>
                      <p><strong>Cidade:</strong> {formData.city}, {formData.state}</p>
                      <p><strong>CEP:</strong> {formData.zipCode}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detalhes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Quartos:</strong> {formData.bedrooms}</p>
                      <p><strong>Banheiros:</strong> {formData.bathrooms}</p>
                      <p><strong>Área:</strong> {formData.area}m²</p>
                      <p><strong>Hóspedes:</strong> {formData.maxGuests}</p>
                      <p><strong>Comodidades:</strong> {amenities.length} selecionadas</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Preços</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Diária:</strong> R$ {formData.dailyPrice}</p>
                      {formData.availableForSale && (
                        <p><strong>Venda:</strong> R$ {formData.salePrice}</p>
                      )}
                      <p><strong>Estadia mínima:</strong> {formData.minimumStay} noite(s)</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Mídia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{images.length} foto(s) carregada(s)</p>
                      {videoFile && (
                        <p className="text-sm text-muted-foreground">
                          Vídeo: {videoFile.name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          <div className="flex space-x-4">
            {currentStep < 6 ? (
              <Button onClick={handleNextStep}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Publicando...' : 'Publicar Anúncio'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}