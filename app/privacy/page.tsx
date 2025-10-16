'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <Badge className="mb-4">Política de Privacidade</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Política de <span className="gradient-text">Privacidade</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Última atualização: 15 de janeiro de 2025
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Política de Privacidade da Guest to Buy</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
                      <p className="text-muted-foreground mb-4">
                        A Guest to Buy ("nós", "nosso" ou "empresa") está comprometida em proteger e respeitar sua privacidade. 
                        Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações 
                        quando você usa nossa plataforma.
                      </p>
                      <p className="text-muted-foreground">
                        Esta política se aplica a todos os usuários da plataforma Guest to Buy, incluindo visitantes, 
                        hóspedes, proprietários e outros usuários registrados.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">2. Informações que Coletamos</h2>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">2.1 Informações Fornecidas por Você</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Informações de cadastro (nome, email, telefone, endereço)</li>
                        <li>Informações de perfil (foto, biografia, preferências)</li>
                        <li>Informações de pagamento (dados do cartão, informações bancárias)</li>
                        <li>Comunicações conosco (mensagens, avaliações, comentários)</li>
                        <li>Informações de verificação (documentos de identidade)</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">2.2 Informações Coletadas Automaticamente</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Dados de uso da plataforma (páginas visitadas, tempo de permanência)</li>
                        <li>Informações do dispositivo (tipo, sistema operacional, navegador)</li>
                        <li>Dados de localização (quando permitido)</li>
                        <li>Cookies e tecnologias similares</li>
                        <li>Logs de servidor e dados de performance</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">2.3 Informações de Terceiros</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Informações de redes sociais (quando você conecta sua conta)</li>
                        <li>Dados de parceiros de pagamento</li>
                        <li>Informações de verificação de terceiros</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">3. Como Usamos suas Informações</h2>
                      <p className="text-muted-foreground mb-4">
                        Utilizamos suas informações para os seguintes propósitos:
                      </p>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">3.1 Prestação de Serviços</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Criar e gerenciar sua conta</li>
                        <li>Processar reservas e pagamentos</li>
                        <li>Facilitar comunicação entre usuários</li>
                        <li>Fornecer suporte ao cliente</li>
                        <li>Verificar identidade e prevenir fraudes</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">3.2 Melhoria dos Serviços</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Analisar uso da plataforma</li>
                        <li>Desenvolver novos recursos</li>
                        <li>Personalizar experiência do usuário</li>
                        <li>Realizar pesquisas e análises</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">3.3 Comunicação</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Enviar notificações sobre reservas</li>
                        <li>Comunicar atualizações de serviço</li>
                        <li>Enviar newsletters (com seu consentimento)</li>
                        <li>Responder a suas consultas</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Informações</h2>
                      <p className="text-muted-foreground mb-4">
                        Podemos compartilhar suas informações nas seguintes circunstâncias:
                      </p>

                      <h3 className="text-lg font-semibold text-foreground mb-2">4.1 Com Outros Usuários</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Informações de perfil público</li>
                        <li>Avaliações e comentários</li>
                        <li>Informações necessárias para reservas</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">4.2 Com Prestadores de Serviços</h3>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Processadores de pagamento</li>
                        <li>Serviços de verificação de identidade</li>
                        <li>Provedores de hospedagem e tecnologia</li>
                        <li>Serviços de análise e marketing</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-foreground mb-2">4.3 Por Exigência Legal</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Cumprimento de leis e regulamentos</li>
                        <li>Resposta a processos legais</li>
                        <li>Proteção de direitos e segurança</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies e Tecnologias Similares</h2>
                      <p className="text-muted-foreground mb-4">
                        Utilizamos cookies e tecnologias similares para:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Manter você logado na plataforma</li>
                        <li>Lembrar suas preferências</li>
                        <li>Analisar uso da plataforma</li>
                        <li>Personalizar conteúdo e anúncios</li>
                        <li>Melhorar segurança</li>
                      </ul>
                      <p className="text-muted-foreground">
                        Você pode controlar cookies através das configurações do seu navegador, mas isso pode afetar 
                        a funcionalidade da plataforma.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">6. Segurança dos Dados</h2>
                      <p className="text-muted-foreground mb-4">
                        Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Criptografia de dados em trânsito e em repouso</li>
                        <li>Controles de acesso rigorosos</li>
                        <li>Monitoramento contínuo de segurança</li>
                        <li>Auditorias regulares de segurança</li>
                        <li>Treinamento de funcionários em privacidade</li>
                      </ul>
                      <p className="text-muted-foreground">
                        Embora nos esforcemos para proteger suas informações, nenhum sistema é 100% seguro. 
                        Recomendamos que você também tome precauções para proteger suas informações.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">7. Seus Direitos</h2>
                      <p className="text-muted-foreground mb-4">
                        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><strong>Acesso:</strong> Solicitar informações sobre o tratamento de seus dados</li>
                        <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
                        <li><strong>Exclusão:</strong> Solicitar exclusão de dados desnecessários</li>
                        <li><strong>Portabilidade:</strong> Solicitar transferência de dados para outro fornecedor</li>
                        <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
                        <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
                        <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">8. Retenção de Dados</h2>
                      <p className="text-muted-foreground mb-4">
                        Mantemos suas informações pelo tempo necessário para:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Fornecer nossos serviços</li>
                        <li>Cumprir obrigações legais</li>
                        <li>Resolver disputas</li>
                        <li>Fazer cumprir nossos acordos</li>
                      </ul>
                      <p className="text-muted-foreground">
                        Quando não precisarmos mais de suas informações, as excluiremos ou anonimizaremos de forma segura.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">9. Transferências Internacionais</h2>
                      <p className="text-muted-foreground mb-4">
                        Suas informações podem ser transferidas e processadas em países fora do Brasil. 
                        Quando isso ocorrer, garantimos que:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>O país de destino oferece nível adequado de proteção</li>
                        <li>Implementamos salvaguardas contratuais apropriadas</li>
                        <li>Obtemos seu consentimento quando necessário</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">10. Alterações nesta Política</h2>
                      <p className="text-muted-foreground mb-4">
                        Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações 
                        significativas, notificaremos você através de:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Email para o endereço cadastrado</li>
                        <li>Notificação na plataforma</li>
                        <li>Atualização da data de "última modificação"</li>
                      </ul>
                      <p className="text-muted-foreground">
                        Recomendamos que você revise esta política regularmente para se manter informado sobre 
                        como protegemos suas informações.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contato</h2>
                      <p className="text-muted-foreground mb-4">
                        Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                        entre em contato conosco:
                      </p>
                      <ul className="list-none text-muted-foreground space-y-1">
                        <li><strong>Encarregado de Dados:</strong> privacy@guesttobuy.com.br</li>
                        <li><strong>Email Geral:</strong> contato@guesttobuy.com.br</li>
                        <li><strong>Telefone:</strong> (11) 4000-0000</li>
                        <li><strong>Endereço:</strong> Av. Paulista, 1000 - Bela Vista, São Paulo, SP - 01310-100</li>
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