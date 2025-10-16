'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  MapPin,
  Star,
  Clock,
  Users,
  Calendar,
  Camera,
  Utensils,
  Waves,
  Mountain,
  Building,
  Coffee,
  Music,
  Palette,
} from 'lucide-react';

const experiences = [
  {
    id: '1',
    title: 'Tour Gastronômico em Ipanema',
    location: 'Ipanema, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    price: 120,
    duration: '3 horas',
    rating: 4.9,
    reviewCount: 156,
    maxGuests: 8,
    category: 'Gastronomia',
    description: 'Descubra os sabores únicos de Ipanema com um chef local.',
    highlights: ['Degustação em 5 restaurantes', 'Chef especializado', 'Bebidas incluídas'],
    icon: Utensils,
  },
  {
    id: '2',
    title: 'Fotografia Urbana no Centro',
    location: 'Centro, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    price: 85,
    duration: '4 horas',
    rating: 4.8,
    reviewCount: 89,
    maxGuests: 6,
    category: 'Arte & Cultura',
    description: 'Capture a essência do Rio histórico com fotógrafo profissional.',
    highlights: ['Equipamento incluído', 'Edição básica', 'Locais exclusivos'],
    icon: Camera,
  },
  {
    id: '3',
    title: 'Surf e Relaxamento na Barra',
    location: 'Barra da Tijuca, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    price: 150,
    duration: '5 horas',
    rating: 4.7,
    reviewCount: 203,
    maxGuests: 4,
    category: 'Esportes',
    description: 'Aula de surf seguida de relaxamento na praia.',
    highlights: ['Instrutor certificado', 'Equipamento completo', 'Lanche na praia'],
    icon: Waves,
  },
  {
    id: '4',
    title: 'Trilha na Tijuca com Vista',
    location: 'Tijuca, Rio de Janeiro',
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    price: 95,
    duration: '6 horas',
    rating: 4.9,
    reviewCount: 127,
    maxGuests: 10,
    category: 'Natureza',
    description: 'Trilha guiada com as melhores vistas do Rio.',
    highlights: ['Guia especializado', 'Transporte incluído', 'Lanche energético'],
    icon: Mountain,
  },
  {
    id: '5',
    title: 'Arquitetura Moderna em SP',
    location: 'Vila Madalena, São Paulo',
    image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    price: 110,
    duration: '3 horas',
    rating: 4.6,
    reviewCount: 78,
    maxGuests: 12,
    category: 'Arquitetura',
    description: 'Explore a arquitetura contemporânea paulistana.',
    highlights: ['Arquiteto especialista', 'Acesso exclusivo', 'Material didático'],
    icon: Building,
  },
  {
    id: '6',
    title: 'Café Especial e Barismo',
    location: 'Vila Madalena, São Paulo',
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    price: 75,
    duration: '2 horas',
    rating: 4.8,
    reviewCount: 145,
    maxGuests: 8,
    category: 'Gastronomia',
    description: 'Aprenda sobre café especial com barista profissional.',
    highlights: ['Degustação de 6 cafés', 'Técnicas de preparo', 'Certificado'],
    icon: Coffee,
  },
];

const categories = [
  { name: 'Todos', value: 'all', icon: Star },
  { name: 'Gastronomia', value: 'gastronomia', icon: Utensils },
  { name: 'Arte & Cultura', value: 'arte', icon: Palette },
  { name: 'Esportes', value: 'esportes', icon: Waves },
  { name: 'Natureza', value: 'natureza', icon: Mountain },
  { name: 'Arquitetura', value: 'arquitetura', icon: Building },
];

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredExperiences = selectedCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category.toLowerCase().includes(selectedCategory));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="mb-4">Experiências Únicas</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Viva <span className="gradient-text">Experiências</span>
                <br />
                <span className="gradient-text">Inesquecíveis</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Descubra atividades exclusivas criadas por locais apaixonados. 
                Cada experiência é uma oportunidade de conhecer a cidade de forma autêntica.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {filteredExperiences.length} experiências encontradas
              </h2>
              <p className="text-muted-foreground">
                Atividades selecionadas por especialistas locais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperiences.map((experience) => (
                <Card key={experience.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <div 
                      className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url('${experience.image}')` }}
                    />
                    <Badge className="absolute top-4 left-4">
                      {experience.category}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-background/90 rounded-lg px-2 py-1">
                      <span className="text-sm font-semibold text-foreground">
                        R$ {experience.price}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {experience.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {experience.location}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {experience.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {experience.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Até {experience.maxGuests}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{experience.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({experience.reviewCount} avaliações)
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Destaques:</h4>
                      <ul className="space-y-1">
                        {experience.highlights.map((highlight, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button variant="outline" className="w-full text-sm">
                        Ver Detalhes
                      </Button>
                      <Button className="w-full text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Reservar
                      </Button>
                    </div>
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
                Quer Criar sua Própria Experiência?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Compartilhe sua paixão e conhecimento local. Torne-se um anfitrião 
                de experiências e ganhe dinheiro fazendo o que ama.
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Tornar-se Anfitrião
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}