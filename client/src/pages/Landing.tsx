import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check, Zap, Brain, TrendingUp, Shield, Smartphone, BarChart3 } from 'lucide-react';
import { getLoginUrl } from '@/const';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1 },
  viewport: { once: true }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🐂</span>
            </div>
            <span className="font-bold text-lg gradient-text">BOVISION AI</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <a href="#beneficios" className="text-sm hover:text-accent transition">Benefícios</a>
            <a href="#planos" className="text-sm hover:text-accent transition">Planos</a>
            <a href="#faq" className="text-sm hover:text-accent transition">FAQ</a>
            <Button 
              size="sm" 
              className="bg-accent hover:bg-accent/90 text-background"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-20" />
        
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Visão Inteligente para a Nova Pecuária
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plataforma AgroTech com IA avançada para gestão completa do rebanho, pesagem inteligente por câmera e análises preditivas em tempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-background"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Começar Grátis por 30 Dias <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                Ver Demonstração
              </Button>
            </div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-lg overflow-hidden neon-glow"
            >
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/hero-landing-hgdwUg9UZsKxtXFFuSiLTj.webp"
                alt="BOVISION AI Hero"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4 bg-card/50">
        <div className="container">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Funcionalidades Poderosas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para otimizar a produtividade do seu rebanho
            </p>
          </motion.div>

          <motion.div 
            {...staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Brain, title: 'IA Avançada', desc: 'Assistente especializado em pecuária' },
              { icon: Smartphone, title: 'App Nativo', desc: 'Experiência premium em qualquer dispositivo' },
              { icon: Zap, title: 'Pesagem IA', desc: 'Câmera inteligente com análise 3D' },
              { icon: TrendingUp, title: 'Previsões', desc: 'IA preditiva para otimizar ganho' },
              { icon: BarChart3, title: 'Analytics', desc: 'Dashboards em tempo real' },
              { icon: Shield, title: 'Seguro', desc: 'Autenticação PIN com Device ID' },
              { icon: Check, title: 'Relatórios', desc: 'Exportação em PDF, Excel e CSV' },
              { icon: TrendingUp, title: 'Financeiro', desc: 'Controle completo de custos' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-background border-border hover:border-accent transition neon-glow">
                  <feature.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4">
        <div className="container">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Dashboard Inteligente</h2>
            <p className="text-muted-foreground">Métricas em tempo real do seu rebanho</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden neon-glow"
          >
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/dashboard-preview-jKAWZMgT4sE8SJ4AxmS5UQ.webp"
              alt="Dashboard Preview"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container">
          <motion.div 
            {...staggerContainer}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '1.250+', label: 'Fazendas Conectadas' },
              { number: '98.7%', label: 'Precisão IA' },
              { number: '24/7', label: 'Suporte Técnico' },
              { number: '30 dias', label: 'Trial Gratuito' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-4">
        <div className="container">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Planos Simples e Transparentes</h2>
            <p className="text-muted-foreground">30 dias gratuitos, sem cartão de crédito</p>
          </motion.div>

          <motion.div 
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: 'Trial',
                price: 'Grátis',
                duration: '30 dias',
                features: ['Acesso completo', 'Todas funcionalidades', 'Suporte por email']
              },
              {
                name: 'Mensal',
                price: 'R$ 199',
                duration: '/mês',
                features: ['Acesso completo', 'Suporte prioritário', 'Relatórios avançados', 'IA preditiva'],
                highlighted: true
              },
              {
                name: 'Anual',
                price: 'R$ 1.990',
                duration: '/ano',
                features: ['Tudo do mensal', 'Desconto 17%', 'Consultoria incluída', 'Prioridade máxima']
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-8 ${plan.highlighted ? 'border-accent neon-glow-strong' : 'border-border'} relative`}>
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-accent text-background px-4 py-1 rounded-full text-sm font-bold">
                        Mais Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.duration}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.highlighted ? 'bg-accent hover:bg-accent/90 text-background' : 'border-accent text-accent hover:bg-accent/10'}`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    Começar Agora
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-card/50">
        <div className="container max-w-3xl">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Perguntas Frequentes</h2>
          </motion.div>

          <motion.div 
            {...staggerContainer}
            className="space-y-4"
          >
            {[
              {
                q: 'Preciso de cartão de crédito para o trial?',
                a: 'Não! Os 30 dias gratuitos não requerem cartão de crédito. Você só paga após o período de trial.'
              },
              {
                q: 'Como funciona a pesagem por IA?',
                a: 'Basta apontar a câmera para o animal. A IA analisa altura, largura e volume corporal para estimar o peso com até 98.7% de precisão.'
              },
              {
                q: 'Posso usar em múltiplos dispositivos?',
                a: 'Sim! Sua conta sincroniza automaticamente entre celular, tablet e desktop. Cada dispositivo tem seu próprio Device ID.'
              },
              {
                q: 'Quais métodos de pagamento são aceitos?',
                a: 'Aceitamos PIX e boleto para máxima conveniência.'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-background border-border hover:border-accent transition">
                  <h3 className="font-bold mb-2 text-accent">{item.q}</h3>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold mb-6 gradient-text">Pronto para Revolucionar sua Pecuária?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a mais de 1.250 fazendas que já confiam em BOVISION AI
          </p>
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-background"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Começar Grátis Agora <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">🐂</span>
                </div>
                <span className="font-bold gradient-text">BOVISION AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Visão inteligente para a nova pecuária</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-accent transition">Preços</a></li>
                <li><a href="#" className="hover:text-accent transition">Segurança</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Sobre</a></li>
                <li><a href="#" className="hover:text-accent transition">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-accent transition">Termos</a></li>
                <li><a href="#" className="hover:text-accent transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 BOVISION AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
