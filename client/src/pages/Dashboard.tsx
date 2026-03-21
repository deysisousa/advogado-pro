import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { AlertCircle, Calendar, FileText, TrendingUp, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const advogadoQuery = trpc.advogado.me.useQuery();
  const processosQuery = trpc.processo.list.useQuery();
  const prazosQuery = trpc.prazo.list.useQuery();
  const publicacoesQuery = trpc.publicacao.list.useQuery();
  const transacoesQuery = trpc.transacao.list.useQuery();

  const processos = processosQuery.data || [];
  const prazos = prazosQuery.data || [];
  const publicacoes = publicacoesQuery.data || [];
  const transacoes = transacoesQuery.data || [];

  // Calcular estatísticas
  const processosAtivos = processos.filter(p => p.status === "Em andamento").length;
  const prazosProximos = prazos.filter(p => {
    const diasRestantes = Math.ceil((new Date(p.data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 7 && diasRestantes > 0 && !p.concluido;
  }).length;

  const totalReceitas = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((sum, t) => sum + parseFloat(t.valor), 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((sum, t) => sum + parseFloat(t.valor), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Bem-vindo, {user?.name}!</h1>
            <p className="text-slate-600 mt-2">
              {advogadoQuery.data?.oab && `OAB: ${advogadoQuery.data.oab}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/processos")} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Processos Ativos"
            value={processosAtivos}
            icon={<FileText className="w-6 h-6 text-blue-500" />}
            onClick={() => navigate("/processos")}
          />
          <StatCard
            title="Prazos Próximos"
            value={prazosProximos}
            icon={<AlertCircle className="w-6 h-6 text-red-500" />}
            onClick={() => navigate("/prazos")}
            highlight={prazosProximos > 0}
          />
          <StatCard
            title="Publicações"
            value={publicacoes.length}
            icon={<FileText className="w-6 h-6 text-green-500" />}
            onClick={() => navigate("/publicacoes")}
          />
          <StatCard
            title="Saldo"
            value={`R$ ${(totalReceitas - totalDespesas).toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
            onClick={() => navigate("/financeiro")}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prazos Próximos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Prazos Próximos
              </CardTitle>
              <CardDescription>Próximos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {prazos.filter(p => {
                const diasRestantes = Math.ceil((new Date(p.data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return diasRestantes <= 7 && diasRestantes > 0 && !p.concluido;
              }).length === 0 ? (
                <p className="text-slate-500 text-center py-8">Nenhum prazo próximo</p>
              ) : (
                <div className="space-y-3">
                  {prazos
                    .filter(p => {
                      const diasRestantes = Math.ceil((new Date(p.data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return diasRestantes <= 7 && diasRestantes > 0 && !p.concluido;
                    })
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .slice(0, 5)
                    .map(prazo => (
                      <div key={prazo.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">{prazo.descricao}</p>
                          <p className="text-sm text-slate-600">{new Date(prazo.data).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          prazo.prioridade === "alta" ? "bg-red-100 text-red-700" :
                          prazo.prioridade === "média" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {prazo.prioridade}
                        </span>
                      </div>
                    ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/prazos")}>
                Ver Todos os Prazos
              </Button>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Resumo Financeiro
              </CardTitle>
              <CardDescription>Este mês</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Receitas</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalReceitas.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Despesas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalDespesas.toFixed(2)}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600">Saldo</p>
                <p className={`text-2xl font-bold ${totalReceitas - totalDespesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {(totalReceitas - totalDespesas).toFixed(2)}
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/financeiro")}>
                Detalhes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Processos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Processos Recentes</CardTitle>
            <CardDescription>Últimos processos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            {processos.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum processo cadastrado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2">Número</th>
                      <th className="text-left py-2 px-2">Cliente</th>
                      <th className="text-left py-2 px-2">Assunto</th>
                      <th className="text-left py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processos.slice(0, 5).map(processo => (
                      <tr key={processo.id} className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2 font-mono text-xs">{processo.numero}</td>
                        <td className="py-2 px-2">{processo.cliente}</td>
                        <td className="py-2 px-2">{processo.assunto}</td>
                        <td className="py-2 px-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {processo.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/processos")}>
              Ver Todos os Processos
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, onClick, highlight }: { title: string; value: string | number; icon: React.ReactNode; onClick: () => void; highlight?: boolean }) {
  return (
    <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${highlight ? 'border-red-200 bg-red-50' : ''}`} onClick={onClick}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
