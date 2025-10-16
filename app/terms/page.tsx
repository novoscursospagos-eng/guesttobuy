'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <Badge className="mb-4">Termos de Uso</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Termos de <span className="gradient-text">Uso</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Última atualização: 15 de janeiro de 2025
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Termos e Condições de Uso da Plataforma Guest to Buy</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
                      <p className="text-muted-foreground mb-4">
                        Ao acessar e usar a plataforma Guest to Buy, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                        Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                      </p>
                      <p className="text-muted-foreground">
                        Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam o serviço.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
                      <p className="text-muted-foreground mb-4">
                        A Guest to Buy é uma plataforma digital que conecta proprietários de imóveis com potenciais compradores 
                        através de um sistema inovador de "hospedagem para compra", permitindo que interessados experimentem 
                        viver no imóvel antes de decidir pela aquisição.
                      </p>
                      <p className="text-muted-foreground">
                        Nossos serviços incluem, mas não se limitam a:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Listagem de imóveis para hospedagem e venda</li>
                        <li>Sistema de reservas online</li>
                        <li>Processamento de pagamentos</li>
                        <li>Sistema de avaliações e comentários</li>
                        <li>Suporte ao cliente</li>
                        <li>Leilão de móveis</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cadastro e Conta do Usuário</h2>
                      <p className="text-muted-foreground mb-4">
                        Para usar determinados recursos da plataforma, você deve criar uma conta fornecendo informações 
                        precisas, atuais e completas. Você é responsável por manter a confidencialidade de sua conta 
                        e senha.
                      </p>
                      <p className="text-muted-foreground mb-4">
                        Você concorda em:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Fornecer informações verdadeiras, precisas, atuais e completas</li>
                        <li>Manter e atualizar prontamente suas informações</li>
                        <li>Manter a segurança de sua senha</li>
                        <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">4. Responsabilidades dos Usuários</h2>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">4.1 Hóspedes</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Tratar a propriedade com respeito e cuidado</li>
                        <li>Cumprir as regras da casa estabelecidas pelo proprietário</li>
                        <li>Comunicar-se de forma respeitosa</li>
                        <li>Pagar todas as taxas aplicáveis</li>
                        <li>Deixar avaliações honestas e construtivas</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">4.2 Proprietários</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Fornecer descrições precisas e fotos atuais do imóvel</li>
                        <li>Manter o imóvel em condições adequadas para hospedagem</li>
                        <li>Responder prontamente às consultas dos hóspedes</li>
                        <li>Cumprir todas as leis locais aplicáveis</li>
                        <li>Honrar reservas confirmadas</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">5. Pagamentos e Taxas</h2>
                      <p className="text-muted-foreground mb-4">
                        A Guest to Buy cobra taxas de serviço sobre as transações realizadas através da plataforma:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Taxa de serviço para hóspedes: 5% sobre o valor da reserva</li>
                        <li>Taxa de serviço para proprietários: 3% sobre o valor recebido</li>
                        <li>Taxa sobre vendas de imóveis: 2% sobre o valor da transação</li>
                        <li>Taxas de processamento de pagamento conforme aplicável</li>
                      </ul>
                      <p className="text-muted-foreground">
                        Todas as taxas são claramente informadas antes da confirmação da transação.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">6. Política de Cancelamento</h2>
                      <p className="text-muted-foreground mb-4">
                        As políticas de cancelamento variam por propriedade e são definidas pelo proprietário. 
                        As opções incluem:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><strong>Flexível:</strong> Cancelamento gratuito até 24h antes do check-in</li>
                        <li><strong>Moderada:</strong> Cancelamento gratuito até 5 dias antes do check-in</li>
                        <li><strong>Rígida:</strong> Cancelamento gratuito até 14 dias antes do check-in</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">7. Propriedade Intelectual</h2>
                      <p className="text-muted-foreground mb-4">
                        O conteúdo da plataforma Guest to Buy, incluindo textos, gráficos, logotipos, ícones, imagens, 
                        clipes de áudio, downloads digitais e software, é propriedade da Guest to Buy ou de seus 
                        fornecedores de conteúdo.
                      </p>
                      <p className="text-muted-foreground">
                        Você não pode reproduzir, distribuir, modificar, criar trabalhos derivados, exibir publicamente, 
                        executar publicamente, republicar, baixar, armazenar ou transmitir qualquer material em nosso site.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitação de Responsabilidade</h2>
                      <p className="text-muted-foreground mb-4">
                        A Guest to Buy atua como intermediária entre proprietários e hóspedes. Não somos proprietários 
                        dos imóveis listados e não somos responsáveis por:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>A precisão das descrições dos imóveis</li>
                        <li>A qualidade ou condição dos imóveis</li>
                        <li>O comportamento dos usuários</li>
                        <li>Danos ou perdas durante a estadia</li>
                        <li>Disputas entre usuários</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modificações dos Termos</h2>
                      <p className="text-muted-foreground mb-4">
                        Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                        em vigor imediatamente após a publicação na plataforma.
                      </p>
                      <p className="text-muted-foreground">
                        É sua responsabilidade revisar periodicamente estes termos. O uso continuado da plataforma 
                        após as alterações constitui aceitação dos novos termos.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">10. Lei Aplicável</h2>
                      <p className="text-muted-foreground mb-4">
                        Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa 
                        será resolvida nos tribunais competentes de São Paulo, SP.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contato</h2>
                      <p className="text-muted-foreground mb-4">
                        Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                      </p>
                      <ul className="list-none text-muted-foreground space-y-1">
                        <li><strong>Email:</strong> legal@guesttobuy.com.br</li>
                        <li><strong>Telefone:</strong> (11) 4000-0000</li>
                        <li><strong>Endereço:</strong> Av. Paulista, 1000 - Bela Vista, São Paulo, SP</li>
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}