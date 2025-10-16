'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Building2,
  MessageCircle,
  Settings,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { 
      title: 'Explorar', 
      href: '/properties',
      description: 'Descubra imóveis únicos para hospedagem e compra'
    },
    { 
      title: 'Como Funciona', 
      href: '/how-it-works',
      description: 'Entenda nosso processo inovador'
    },
    { 
      title: 'Para Proprietários', 
      href: '/hosts',
      description: 'Cadastre seu imóvel e maximize seus ganhos'
    },
    { 
      title: 'Leilão de Móveis', 
      href: '/furniture-auction',
      description: 'Encontre móveis perfeitos para seu imóvel'
    },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Home className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">Guest to Buy</h1>
              <p className="text-xs text-muted-foreground -mt-1">Stay • Experience • Purchase</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground/80 hover:text-foreground">
                    Explorar
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <div className="text-sm font-medium">{item.title}</div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link href="/properties" className="text-foreground/80 hover:text-foreground transition-colors">
              Imóveis
            </Link>
            <Link href="/experiences" className="text-foreground/80 hover:text-foreground transition-colors">
              Experiências
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:flex"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">João Silva</p>
                        <p className="text-xs text-muted-foreground">joao@email.com</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages" className="flex items-center">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Mensagens
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/host">
                    <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                      Anuncie seu imóvel
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline">Entrar</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-6">
              <div className="space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border space-y-4">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="block py-2 text-foreground/80">
                      Dashboard
                    </Link>
                    <Link href="/messages" className="block py-2 text-foreground/80">
                      Mensagens
                    </Link>
                    <Link href="/favorites" className="block py-2 text-foreground/80">
                      Favoritos
                    </Link>
                    <Button variant="outline" className="w-full">
                      Sair
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link href="/host" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Anuncie seu imóvel
                      </Button>
                    </Link>
                    <Link href="/login" className="block">
                      <Button variant="outline" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link href="/register" className="block">
                      <Button className="w-full">
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}