import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, Clock, FileText, Scale } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Advogado Pro
            </span>
          </div>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Gestão Jurídica Inteligente
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Para Advogados Modernos
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Organize processos, prazos e publicações do CNJ em um único lugar. Acompanhe sua carreira jurídica com precisão e elegância.
          </p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 group"
          >
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Gestão de Processos"
            description="Organize todos os seus processos jurídicos em um dashboard intuitivo"
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="Controle de Prazos"
            description="Alertas automáticos para prazos próximos com prioridades"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Análise Financeira"
            description="Acompanhe receitas e despesas vinculadas aos processos"
          />
          <FeatureCard
            icon={<Scale className="w-8 h-8" />}
            title="Integração CNJ"
            description="Sincronize publicações do Diário Oficial automaticamente"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-800/50 border-t border-slate-700/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Por que escolher Advogado Pro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitItem
              title="Interface Elegante"
              description="Design moderno e intuitivo que facilita o trabalho do dia a dia"
            />
            <BenefitItem
              title="Segurança Total"
              description="Seus dados protegidos com autenticação segura e criptografia"
            />
            <BenefitItem
              title="Suporte Completo"
              description="Equipe dedicada para ajudar no que você precisar"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Pronto para transformar sua prática jurídica?</h2>
        <p className="text-slate-300 mb-8 text-lg">
          Junte-se a advogados que já estão gerenciando seus casos com eficiência
        </p>
        <Button
          onClick={() => window.location.href = getLoginUrl()}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
        >
          Acessar Plataforma
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2026 Advogado Pro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
