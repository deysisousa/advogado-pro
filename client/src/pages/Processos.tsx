import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, RefreshCw, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Processos() {
  const { user } = useAuth();
  const processosQuery = trpc.processo.list.useQuery();
  const createProcessoMutation = trpc.processo.create.useMutation();
  const updateProcessoMutation = trpc.processo.update.useMutation();
  const deleteProcessoMutation = trpc.processo.delete.useMutation();
  const buscarProcessosCNJMutation = trpc.cnj.buscarProcessos.useMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoadingCNJ, setIsLoadingCNJ] = useState(false);
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

  const handleBuscarCNJ = async () => {
    setIsLoadingCNJ(true);
    try {
      const resultado = await buscarProcessosCNJMutation.mutateAsync();
      toast.success(`${resultado.totalProcessos} processos encontrados e sincronizados!`);
      processosQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar processos do CNJ");
    } finally {
      setIsLoadingCNJ(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numero || !formData.cliente) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

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
      closeModal();
      processosQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar processo");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deletar este processo?")) {
      try {
        await deleteProcessoMutation.mutateAsync({ id });
        toast.success("Deletado!");
        processosQuery.refetch();
      } catch (error: any) {
        toast.error(error.message || "Erro ao deletar");
      }
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ numero: "", cliente: "", assunto: "", status: "Em andamento", descricao: "", tribunal: "", juiz: "" });
    setShowModal(true);
  };

  const openEditModal = (processo: any) => {
    setEditingId(processo.id);
    setFormData({
      numero: processo.numero,
      cliente: processo.cliente,
      assunto: processo.assunto || "",
      status: processo.status || "Em andamento",
      descricao: processo.descricao || "",
      tribunal: processo.tribunal || "",
      juiz: processo.juiz || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ numero: "", cliente: "", assunto: "", status: "Em andamento", descricao: "", tribunal: "", juiz: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Processos Jurídicos</h1>
            <p className="text-slate-600">Gerencie todos os seus processos</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleBuscarCNJ}
              disabled={isLoadingCNJ}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              {isLoadingCNJ ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Atualizar do CNJ
                </>
              )}
            </Button>
            <Button onClick={openNewModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              💡 <strong>Dica:</strong> Clique em "Atualizar do CNJ" para sincronizar automaticamente todos os processos vinculados ao seu nome e OAB.
            </p>
          </CardContent>
        </Card>

        {/* Modal - Simple Custom Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold">
                  {editingId ? "Editar Processo" : "Novo Processo"}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número *</Label>
                    <Input
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      placeholder="Ex: 0000001-00.2024.1.01.0000"
                      required
                    />
                  </div>
                  <div>
                    <Label>Cliente *</Label>
                    <Input
                      value={formData.cliente}
                      onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Assunto</Label>
                  <Input
                    value={formData.assunto}
                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                    placeholder="Assunto do processo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                        <SelectItem value="Concluído">Concluído</SelectItem>
                        <SelectItem value="Arquivado">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tribunal</Label>
                    <Input
                      value={formData.tribunal}
                      onChange={(e) => setFormData({ ...formData, tribunal: e.target.value })}
                      placeholder="Nome do tribunal"
                    />
                  </div>
                </div>

                <div>
                  <Label>Juiz</Label>
                  <Input
                    value={formData.juiz}
                    onChange={(e) => setFormData({ ...formData, juiz: e.target.value })}
                    placeholder="Nome do juiz"
                  />
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição detalhada do processo"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingId ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Processos List */}
        {processos.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-500 mb-4">Nenhum processo cadastrado</p>
              <Button onClick={openNewModal}>Criar Primeiro Processo</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {processos.map((processo: any) => (
              <Card key={processo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{processo.numero}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          processo.status === "Em andamento"
                            ? "bg-blue-100 text-blue-700"
                            : processo.status === "Concluído"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}>
                          {processo.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1"><strong>Cliente:</strong> {processo.cliente}</p>
                      {processo.assunto && <p className="text-sm text-slate-600 mb-1"><strong>Assunto:</strong> {processo.assunto}</p>}
                      {processo.tribunal && <p className="text-sm text-slate-600 mb-1"><strong>Tribunal:</strong> {processo.tribunal}</p>}
                      {processo.juiz && <p className="text-sm text-slate-600 mb-1"><strong>Juiz:</strong> {processo.juiz}</p>}
                      {processo.descricao && <p className="text-sm text-slate-600 line-clamp-2"><strong>Descrição:</strong> {processo.descricao}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(processo)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(processo.id)}
                      >
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
