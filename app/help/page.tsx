'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Book,
  Users,
  Shield,
  CreditCard,
  Home,
  Calendar,
  HelpCircle,
} from 'lucide-react';

const categories = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    icon: Book,
    description: 'Como começar a usar a plataforma',
    articleCount: 12,
  },
  {
    id: 'booking',
    title: 'Reservas',
    icon: Calendar,
    description: 'Tudo sobre fazer e gerenciar reservas',
    articleCount: 18,
  },
  {
    id: 'hosting',
    title: 'Para Proprietários',
    icon: Home,
    description: 'Guias para quem quer anunciar imóveis',
    articleCount: 15,
  },
  {
    id: 'payments',
    title: 'Pagamentos',
    icon: CreditCard,
    description: 'Informações sobre pagamentos e reembolsos',
    articleCount: 10,
  },
  {
    id: 'safety',
    title: 'Segurança',
    icon: Shield,
    description: 'Dicas de segurança e verificação',
    articleCount: 8,
  },
  {
    id: 'community',
    title: 'Comunidade',
    icon: Users,
    description: 'Diretrizes da comunidade e suporte',
    articleCount: 6,
  },
];

const faqs = [
  {
    id: 1,
    question: 'Como funciona o conceito "Se Hospede para Comprar"?',
    answer: 'Você pode se hospedar em imóveis que estão à venda para conhecê-los antes de decidir comprar. Durante a estadia, você experimenta como seria morar no local, conhece a vizinhança e pode negociar a compra diretamente com o proprietário.',
    category: 'getting-started',
  },
  {
    id: 2,
    question: 'Como faço uma reserva?',
    answer: 'Para fazer uma reserva, escolha o imóvel, selecione as datas desejadas, informe o número de hóspedes e clique em "Reservar". Você será direcionado para o pagamento seguro. Após a confirmação, receberá todas as informações por email.',
    category: 'booking',
  },
  {
    id: 3,
    question: 'Posso cancelar minha reserva?',
    answer: 'Sim, você pode cancelar sua reserva de acordo com a política de cancelamento do imóvel. Geralmente oferecemos cancelamento gratuito até 24h antes do check-in. Verifique os termos específicos na página do imóvel.',
    category: 'booking',
  },
  {
    id: 4,
    question: 'Como cadastro meu imóvel na plataforma?',
    answer: 'Para cadastrar seu imóvel, clique em "Anuncie seu imóvel" no menu principal. Você precisará fornecer informações detalhadas, fotos de qualidade e definir preços para hospedagem e venda. Nossa equipe verificará o anúncio antes da publicação.',
    category: 'hosting',
  },
  {
    id: 5,
    question: 'Quais são as taxas cobradas?',
    answer: 'Cobramos uma taxa de serviço de 5% sobre o valor da reserva para hóspedes e 3% para proprietários. Para vendas de imóveis, a taxa é de 2% sobre o valor da transação. Todas as taxas são transparentes e informadas antes da confirmação.',
    category: 'payments',
  },
  {
    id: 6,
    question: 'Como garantir minha segurança durante a estadia?',
    answer: 'Todos os proprietários são verificados, os imóveis são inspecionados e oferecemos suporte 24/7. Recomendamos sempre comunicar-se através da plataforma e seguir nossas diretrizes de segurança.',
    category: 'safety',
  },
  {
    id: 7,
    question: 'O que acontece se eu quiser comprar o imóvel após a hospedagem?',
    answer: 'Se você decidir comprar após a hospedagem, entre em contato com o proprietário através da plataforma. Oferecemos suporte jurídico e facilitamos todo o processo de compra, incluindo documentação e financiamento.',
    category: 'getting-started',
  },
  {
    id: 8,
    question: 'Como funciona o sistema de avaliações?',
    answer: 'Após cada estadia, hóspedes e proprietários podem avaliar uns aos outros. As avaliações são públicas e ajudam a manter a qualidade da plataforma. Só é possível avaliar após uma reserva confirmada.',
    category: 'community',
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="mb-4">Central de Ajuda</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Como Podemos <span className="gradient-text">Ajudar</span>?
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Encontre respostas para suas dúvidas ou entre em contato com nossa equipe de suporte.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mt-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Busque por palavras-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          {category.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {category.articleCount} artigos
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Perguntas <span className="gradient-text">Frequentes</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Respostas para as dúvidas mais comuns dos nossos usuários
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                Todas
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  {category.title}
                </Button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left text-lg font-medium">
                        {faq.question}
                      </CardTitle>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedFaq === faq.id && (
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-muted-foreground">
                  Tente usar outros termos de busca ou entre em contato conosco.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Ainda Precisa de <span className="gradient-text">Ajuda</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nossa equipe está sempre pronta para ajudar você
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-4">
                    Chat Online
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Converse com nossa equipe em tempo real
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    24/7 disponível
                  </div>
                  <Button className="w-full">
                    Iniciar Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-4">
                    Telefone
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Ligue para nossa central de atendimento
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    Seg-Sex: 8h às 18h
                  </div>
                  <Button variant="outline" className="w-full">
                    (11) 4000-0000
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-4">
                    Email
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Envie sua dúvida por email
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    Resposta em até 2h
                  </div>
                  <Button variant="outline" className="w-full">
                    ajuda@guesttobuy.com.br
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}