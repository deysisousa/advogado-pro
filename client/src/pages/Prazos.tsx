import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Prazos() {
  const prazosQuery = trpc.prazo.list.useQuery();
  const processosQuery = trpc.processo.list.useQuery();
  const createPrazoMutation = trpc.prazo.create.useMutation();
  const updatePrazoMutation = trpc.prazo.update.useMutation();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    data: "",
    prioridade: "média",
    tipo: "",
    processoId: "",
  });

  const prazos = prazosQuery.data || [];
  const processos = processosQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPrazoMutation.mutateAsync({
        descricao: formData.descricao,
        data: formData.data,
        prioridade: formData.prioridade as any,
        tipo: formData.tipo || undefined,
        processoId: parseInt(formData.processoId),
      });
      toast.success("Prazo criado!");
      setOpen(false);
      setFormData({ descricao: "", data: "", prioridade: "média", tipo: "", processoId: "" });
      prazosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao criar prazo");
    }
  };

  const handleConcluir = async (id: number, concluido: boolean) => {
    try {
      await updatePrazoMutation.mutateAsync({ id, concluido: !concluido });
      toast.success(concluido ? "Prazo reaberto" : "Prazo concluído!");
      prazosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao atualizar");
    }
  };

  const sortedPrazos = [...prazos].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Prazos</h1>
            <p className="text-slate-600">Controle seus prazos processuais</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Prazo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Prazo</DialogTitle>
                <DialogDescription>Adicione um novo prazo processual</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Descrição *</Label>
                  <Input value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} required />
                </div>
                <div>
                  <Label>Data *</Label>
                  <Input type="date" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
                </div>
                <div>
                  <Label>Processo *</Label>
                  <Select value={formData.processoId} onValueChange={(value) => setFormData({ ...formData, processoId: value })}>
                    <SelectTrigger><SelectValue placeholder="Selecione um processo" /></SelectTrigger>
                    <SelectContent>
                      {processos.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.numero} - {p.cliente}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(value) => setFormData({ ...formData, prioridade: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="média">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">Criar Prazo</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {sortedPrazos.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-500 mb-4">Nenhum prazo cadastrado</p>
              <Button onClick={() => setOpen(true)}>Criar Primeiro</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedPrazos.map(prazo => {
              const diasRestantes = Math.ceil((new Date(prazo.data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <Card key={prazo.id} className={`hover:shadow-md ${prazo.concluido ? 'opacity-60' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-bold ${prazo.concluido ? 'line-through' : ''}`}>{prazo.descricao}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            prazo.prioridade === "alta" ? "bg-red-100 text-red-700" :
                            prazo.prioridade === "média" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {prazo.prioridade}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">Data: {new Date(prazo.data).toLocaleDateString('pt-BR')}</p>
                        <p className={`text-sm font-semibold ${diasRestantes <= 3 ? 'text-red-600' : 'text-slate-600'}`}>
                          {diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'Vencido'}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleConcluir(prazo.id, prazo.concluido || false)}>
                        <Check className={`w-4 h-4 ${prazo.concluido ? 'text-green-600' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
