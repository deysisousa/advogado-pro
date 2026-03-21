import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Financeiro() {
  const transacoesQuery = trpc.transacao.list.useQuery();
  const processosQuery = trpc.processo.list.useQuery();
  const createTransacaoMutation = trpc.transacao.create.useMutation();
  const deleteTransacaoMutation = trpc.transacao.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    categoria: "",
    metodo: "",
    data: "",
    processoId: "",
  });

  const transacoes = transacoesQuery.data || [];
  const processos = processosQuery.data || [];

  const totalReceitas = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((sum, t) => sum + parseFloat(t.valor), 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((sum, t) => sum + parseFloat(t.valor), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransacaoMutation.mutateAsync({
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        tipo,
        data: formData.data,
        categoria: formData.categoria || undefined,
        metodo: formData.metodo || undefined,
        processoId: formData.processoId ? parseInt(formData.processoId) : undefined,
      });
      toast.success("Transação registrada!");
      setOpen(false);
      setFormData({ descricao: "", valor: "", categoria: "", metodo: "", data: "", processoId: "" });
      transacoesQuery.refetch();
    } catch (error) {
      toast.error("Erro ao registrar transação");
    }
  };

  const sortedTransacoes = [...transacoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Controle Financeiro</h1>
            <p className="text-slate-600">Gerencie receitas e despesas</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Transação</DialogTitle>
                <DialogDescription>Adicione uma receita ou despesa</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={tipo} onValueChange={(value: any) => setTipo(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Descrição *</Label>
                  <Input value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} required />
                </div>
                <div>
                  <Label>Valor *</Label>
                  <Input type="number" step="0.01" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} required />
                </div>
                <div>
                  <Label>Data *</Label>
                  <Input type="date" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Input value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} />
                </div>
                <div>
                  <Label>Processo</Label>
                  <Select value={formData.processoId} onValueChange={(value) => setFormData({ ...formData, processoId: value })}>
                    <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                    <SelectContent>
                      {processos.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.numero}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">Registrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Receitas</p>
                  <p className="text-2xl font-bold text-green-600">R$ {totalReceitas.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Despesas</p>
                  <p className="text-2xl font-bold text-red-600">R$ {totalDespesas.toFixed(2)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-slate-600">Saldo</p>
                <p className={`text-2xl font-bold ${totalReceitas - totalDespesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {(totalReceitas - totalDespesas).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transações */}
        {sortedTransacoes.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-500 mb-4">Nenhuma transação registrada</p>
              <Button onClick={() => setOpen(true)}>Registrar Primeira</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2">Data</th>
                      <th className="text-left py-2 px-2">Descrição</th>
                      <th className="text-left py-2 px-2">Categoria</th>
                      <th className="text-right py-2 px-2">Valor</th>
                      <th className="text-center py-2 px-2">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransacoes.slice(0, 20).map(t => (
                      <tr key={t.id} className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2">{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                        <td className="py-2 px-2">{t.descricao}</td>
                        <td className="py-2 px-2 text-slate-600">{t.categoria || "-"}</td>
                        <td className={`py-2 px-2 text-right font-semibold ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.tipo === 'receita' ? '+' : '-'} R$ {parseFloat(t.valor).toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <Button size="sm" variant="ghost" onClick={() => { deleteTransacaoMutation.mutate({ id: t.id }); transacoesQuery.refetch(); }}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
