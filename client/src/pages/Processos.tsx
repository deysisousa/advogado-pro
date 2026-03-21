import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Processos() {
  const processosQuery = trpc.processo.list.useQuery();
  const createProcessoMutation = trpc.processo.create.useMutation();
  const updateProcessoMutation = trpc.processo.update.useMutation();
  const deleteProcessoMutation = trpc.processo.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    assunto: "",
    status: "Em andamento",
    descricao: "",
    tribunal: "",
    juiz: "",
  });

  const processos = processosQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProcessoMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Processo atualizado!");
      } else {
        await createProcessoMutation.mutateAsync(formData);
        toast.success("Processo criado!");
      }
      setOpen(false);
      setFormData({ numero: "", cliente: "", assunto: "", status: "Em andamento", descricao: "", tribunal: "", juiz: "" });
      setEditingId(null);
      processosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao salvar processo");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deletar este processo?")) {
      try {
        await deleteProcessoMutation.mutateAsync({ id });
        toast.success("Deletado!");
        processosQuery.refetch();
      } catch (error) {
        toast.error("Erro ao deletar");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Processos Jurídicos</h1>
            <p className="text-slate-600">Gerencie todos os seus processos</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Processo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar" : "Novo"} Processo</DialogTitle>
                <DialogDescription>Preencha os dados do processo</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número *</Label>
                    <Input value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Cliente *</Label>
                    <Input value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label>Assunto *</Label>
                  <Input value={formData.assunto} onChange={(e) => setFormData({ ...formData, assunto: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                        <SelectItem value="Concluído">Concluído</SelectItem>
                        <SelectItem value="Arquivado">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tribunal</Label>
                    <Input value={formData.tribunal} onChange={(e) => setFormData({ ...formData, tribunal: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Juiz</Label>
                  <Input value={formData.juiz} onChange={(e) => setFormData({ ...formData, juiz: e.target.value })} />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">{editingId ? "Atualizar" : "Criar"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {processos.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-500 mb-4">Nenhum processo</p>
              <Button onClick={() => setOpen(true)}>Criar Primeiro</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {processos.map(processo => (
              <Card key={processo.id} className="hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold">{processo.numero}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{processo.status}</span>
                      </div>
                      <p className="text-sm text-slate-600">Cliente: {processo.cliente}</p>
                      <p className="text-sm text-slate-600">Assunto: {processo.assunto}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setFormData({ numero: processo.numero, cliente: processo.cliente, assunto: processo.assunto, status: processo.status || "Em andamento", descricao: processo.descricao || "", tribunal: processo.tribunal || "", juiz: processo.juiz || "" }); setEditingId(processo.id); setOpen(true); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(processo.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
