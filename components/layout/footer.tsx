import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from 'lucide-react';

const footerSections = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Como Funciona', href: '/how-it-works' },
      { label: 'Explorar Imóveis', href: '/properties' },
      { label: 'Para Proprietários', href: '/hosts' },
      { label: 'Leilão de Móveis', href: '/furniture-auction' },
      { label: 'Experiências', href: '/experiences' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de Ajuda', href: '/help' },
      { label: 'Contato', href: '/contact' },
      { label: 'Segurança', href: '/safety' },
      { label: 'Verificação', href: '/verification' },
      { label: 'Status da Plataforma', href: '/status' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre Nós', href: '/about' },
      { label: 'Carreiras', href: '/careers' },
      { label: 'Imprensa', href: '/press' },
      { label: 'Investidores', href: '/investors' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', href: '/terms' },
      { label: 'Política de Privacidade', href: '/privacy' },
      { label: 'Política de Cookies', href: '/cookies' },
      { label: 'Direitos do Usuário', href: '/user-rights' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/guesttobuy/', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const contactInfo = [
  {
    icon: Phone,
    label: 'Telefone',
    value: '(21) 99591-6552',
    href: 'tel:+5521995916552',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'atendimento@guesttobuy.com',
    href: 'mailto:atendimento@guesttobuy.com',
  },
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'Praia de Botafogo, 501 - Botafogo, RJ',
    href: '#',
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Fique por Dentro das Novidades
          </h3>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Receba as melhores ofertas de imóveis, dicas de investimento e novidades da plataforma 
            diretamente no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Seu melhor e-mail"
              className="bg-background text-foreground border-0"
            />
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Inscrever-se
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-4">
            Não enviamos spam. Você pode cancelar a qualquer momento.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <Home className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Guest to Buy</h1>
                <p className="text-xs text-muted-foreground -mt-1">Stay • Experience • Purchase</p>
              </div>
            </Link>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Revolucionando o mercado imobiliário brasileiro com o conceito inovador de "Se Hospede para Comprar". 
              Experiência completa antes da decisão de investimento.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <Link
                  key={index}
                  href={contact.href}
                  className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <contact.icon className="h-4 w-4" />
                  <div>
                    <span>{contact.value}</span>
                    {index === 2 && (
                      <div className="text-xs mt-1">
                        CEP: 22250-040
                        <br />
                        Av. das Américas, 3693 - RJ
                        <br />
                        CEP: 22631-000
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-foreground">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © 2024 Guest to Buy. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>CNPJ: 12.345.678/0001-90</span>
            <span>•</span>
            <span>Versão 2.1.0</span>
            <span>•</span>
            <Link href="/sitemap" className="hover:text-foreground transition-colors">
              Mapa do Site
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://api.whatsapp.com/send/?phone=5521995885999&text=Ol%C3%A1%2C+vim+pelo+site%2C+poderia+me+ajudar+a+saber+mais+sobre+a+Guest+to+Buy%3F&type=phone_number&app_absent=0"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contato via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>
    </footer>
  );
}