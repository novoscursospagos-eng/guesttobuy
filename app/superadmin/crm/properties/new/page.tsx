'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Target, Upload, ArrowLeft, Save, CheckCircle, AlertCircle, LogOut, X, Play } from 'lucide-react';
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
  publishToShowcase: boolean;
}

export default function NewCRMPropertyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    publishToShowcase: false,
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const availableAmenities = [
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'parking', label: 'Estacionamento' },
    { id: 'tv', label: 'TV' },
    { id: 'kitchen', label: 'Cozinha' },
    { id: 'pool', label: 'Piscina' },
    { id: 'gym', label: 'Academia' },
    { id: 'balcony', label: 'Varanda' },
    { id: 'garden', label: 'Jardim' },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'superadmin') {
        setUser(parsedUser);
      } else {
        router.push('/superadmin');
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
        
        if (formattedValue.length === 9) {
          handleCEPLookup(formattedValue);
        }
      }
      
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
      
      if (field === 'state') {
        const cities = getCitiesByState(value);
        setAvailableCities(cities);
        setFormData(prev => ({ ...prev, city: '' }));
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

  const addImageUrl = () => {
    if (newImageUrl.trim() && imageUrls.length < 10) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.propertyType || 
          !formData.address || !formData.city || !formData.state ||
          !formData.bedrooms || !formData.bathrooms || !formData.area || 
          !formData.maxGuests || !formData.dailyPrice) {
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (formData.availableForSale && !formData.salePrice) {
        setErrorMessage('Preço de venda é obrigatório quando disponível para venda.');
        return;
      }

      if (imageUrls.length === 0) {
        setErrorMessage('Pelo menos uma imagem é obrigatória.');
        return;
      }

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
        neighborhood: formData.neighborhood,
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
        images: imageUrls,
        image: imageUrls[0], // First image as main image
        videoUrl: videoUrl || null,
        type: formData.propertyType,
        availability: 'Disponível',
        rating: 4.5 + Math.random() * 0.5, // Random rating for demo
        reviewCount: Math.floor(Math.random() * 200) + 50, // Random review count
        status: formData.publishToShowcase ? 'published' : 'draft',
        createdAt: new Date().toISOString(),
        publishedAt: formData.publishToShowcase ? new Date().toISOString() : null,
        ownerName: 'CRM Admin',
        ownerEmail: user.email,
        featured: Math.random() > 0.7, // 30% chance of being featured
        source: 'CRM',
      };

      // Save to CRM properties
      const existingCRMProperties = JSON.parse(localStorage.getItem('crmProperties') || '[]');
      existingCRMProperties.push(propertyData);
      localStorage.setItem('crmProperties', JSON.stringify(existingCRMProperties));

      // If publish to showcase is enabled, also save to published properties
      if (formData.publishToShowcase) {
        const existingPublished = JSON.parse(localStorage.getItem('publishedProperties') || '[]');
        existingPublished.push(propertyData);
        localStorage.setItem('publishedProperties', JSON.stringify(existingPublished));
      }
      
      setSuccessMessage(`Imóvel cadastrado com sucesso no CRM${formData.publishToShowcase ? ' e publicado na vitrine!' : '!'}`);
      setTimeout(() => {
        router.push('/superadmin/crm');
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin/crm')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao CRM
            </Button>
            <Target className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Novo Imóvel - CRM</h1>
              <p className="text-xs text-muted-foreground">Cadastrar imóvel no CRM</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="destructive">Super Admin</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do imóvel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Anúncio *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Apartamento Moderno em Ipanema"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o imóvel de forma atrativa..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
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
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  required
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
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    required
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
                      <Label htmlFor={amenity.id} className="cursor-pointer">
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Preços e Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyPrice">Preço da Diária (R$) *</Label>
                  <Input
                    id="dailyPrice"
                    type="number"
                    placeholder="350"
                    value={formData.dailyPrice}
                    onChange={(e) => handleInputChange('dailyPrice', e.target.value)}
                    required
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

                <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
                  <Switch
                    id="publishToShowcase"
                    checked={formData.publishToShowcase}
                    onCheckedChange={(checked) => handleInputChange('publishToShowcase', checked)}
                  />
                  <div>
                    <Label htmlFor="publishToShowcase" className="font-medium">Publicar na Vitrine</Label>
                    <p className="text-sm text-muted-foreground">
                      Se ativado, o imóvel será publicado automaticamente na vitrine pública
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Imagens</CardTitle>
              <CardDescription>Adicione imagens do imóvel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="URL da imagem (ex: https://exemplo.com/imagem.jpg)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addImageUrl}
                    disabled={!newImageUrl.trim() || imageUrls.length >= 10}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adicione URLs de imagens. Máximo 10 fotos. A primeira será a foto principal.
                </p>
              </div>

              {imageUrls.length > 0 && (
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Imagens Adicionadas ({imageUrls.length}/10)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';
                            }}
                          />
                        </div>
                        <Button
                          type="button"
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
              <div className="pt-6 border-t border-border">
                <Label className="text-base font-medium mb-4 block">Vídeo do Imóvel (Opcional)</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="URL do vídeo (ex: https://exemplo.com/video.mp4)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos suportados: MP4, WebM, OGV. Recomendamos vídeos hospedados no YouTube, Vimeo ou similar.
                  </p>
                </div>

                {videoUrl && (
                  <div className="mt-4 space-y-4">
                    <div className="relative">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-64 rounded-lg"
                        onError={() => {
                          setErrorMessage('URL do vídeo inválida ou inacessível.');
                        }}
                      >
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setVideoUrl('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/superadmin/crm')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Cadastrando...' : 'Cadastrar Imóvel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}