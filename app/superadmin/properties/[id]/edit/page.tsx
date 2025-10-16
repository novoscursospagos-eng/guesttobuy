'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Shield, ArrowLeft, Save, CheckCircle, AlertCircle, LogOut, X, Upload, Play, ExternalLink } from 'lucide-react';

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
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

export default function EditPropertyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [property, setProperty] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

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
        loadProperty();
      } else {
        router.push('/superadmin');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router, params.id]);

  const loadProperty = () => {
    // Load property from all possible sources
    const publishedProperties = JSON.parse(localStorage.getItem('publishedProperties') || '[]');
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    const rejectedProperties = JSON.parse(localStorage.getItem('rejectedProperties') || '[]');
    
    const allProperties = [
      ...publishedProperties.map((p: any) => ({ ...p, status: 'published' })),
      ...pendingProperties.map((p: any) => ({ ...p, status: 'pending' })),
      ...rejectedProperties.map((p: any) => ({ ...p, status: 'rejected' }))
    ];

    const foundProperty = allProperties.find(p => p.id === params.id);
    
    if (foundProperty) {
      setProperty(foundProperty);
      setFormData({
        title: foundProperty.title || '',
        description: foundProperty.description || '',
        propertyType: foundProperty.propertyType || foundProperty.type || '',
        address: foundProperty.address || '',
        city: foundProperty.city || '',
        state: foundProperty.state || '',
        zipCode: foundProperty.zipCode || '',
        bedrooms: foundProperty.bedrooms?.toString() || '',
        bathrooms: foundProperty.bathrooms?.toString() || '',
        area: foundProperty.area?.toString() || '',
        maxGuests: foundProperty.maxGuests?.toString() || '',
        dailyPrice: foundProperty.dailyPrice?.toString() || '',
        salePrice: foundProperty.salePrice?.toString() || '',
        minimumStay: foundProperty.minimumStay?.toString() || '1',
        checkInTime: foundProperty.checkInTime || '15:00',
        checkOutTime: foundProperty.checkOutTime || '11:00',
        furnished: foundProperty.furnished ?? true,
        availableForSale: foundProperty.availableForSale ?? true,
        instantBook: foundProperty.instantBook ?? false,
      });
      setAmenities(foundProperty.amenities || []);
      setImageUrls(foundProperty.images || [foundProperty.image].filter(Boolean));
      setVideoUrl(foundProperty.videoUrl || foundProperty.videoFile || '');
    } else {
      setErrorMessage('Imóvel não encontrado.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update property object
      const updatedProperty = {
        ...property,
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
        images: imageUrls,
        image: imageUrls[0], // First image as main image
        videoUrl: videoUrl || null,
        type: formData.propertyType,
        updatedAt: new Date().toISOString(),
      };

      // Update in the correct localStorage array based on current status
      const statusKey = `${property.status}Properties`;
      const currentArray = JSON.parse(localStorage.getItem(statusKey) || '[]');
      const updatedArray = currentArray.map((p: any) => 
        p.id === property.id ? updatedProperty : p
      );
      localStorage.setItem(statusKey, JSON.stringify(updatedArray));
      
      setSuccessMessage('Imóvel atualizado com sucesso!');
      setTimeout(() => {
        router.push('/superadmin');
      }, 2000);
    } catch (error) {
      setErrorMessage('Erro ao atualizar imóvel. Tente novamente.');
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

  if (!user || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Imóvel não encontrado</h2>
          <p className="text-muted-foreground mb-4">O imóvel que você está tentando editar não foi encontrado.</p>
          <Button onClick={() => router.push('/superadmin')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Shield className="h-8 w-8 text-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Editar Imóvel</h1>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`/properties/${property.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Página
            </Button>
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
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    placeholder="Ex: Rio de Janeiro"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
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
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Imagens</CardTitle>
              <CardDescription>Gerencie as imagens do imóvel</CardDescription>
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
                    Imagens Atuais ({imageUrls.length}/10)
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
            </CardContent>
          </Card>

          {/* Video */}
          <Card>
            <CardHeader>
              <CardTitle>Vídeo do Imóvel</CardTitle>
              <CardDescription>Adicione um vídeo para mostrar melhor o imóvel (opcional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://exemplo.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Formatos suportados: MP4, WebM, OGV. Recomendamos vídeos hospedados no YouTube, Vimeo ou similar.
                </p>
              </div>

              {videoUrl && (
                <div className="space-y-4">
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
                  <p className="text-sm text-muted-foreground">
                    Vídeo carregado com sucesso
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/superadmin')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}