import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Documentos() {
  const documentosQuery = trpc.documento.list.useQuery();
  const processosQuery = trpc.processo.list.useQuery();
  const createDocumentoMutation = trpc.documento.create.useMutation();
  const deleteDocumentoMutation = trpc.documento.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    link: "",
    processoId: "",
  });

  const documentos = documentosQuery.data || [];
  const processos = processosQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDocumentoMutation.mutateAsync({
        nome: formData.nome,
        tipo: formData.tipo || undefined,
        link: formData.link || undefined,
        processoId: parseInt(formData.processoId),
      });
      toast.success("Documento adicionado!");
      setOpen(false);
      setFormData({ nome: "", tipo: "", link: "", processoId: "" });
      documentosQuery.refetch();
    } catch (error) {
      toast.error("Erro ao adicionar documento");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deletar este documento?")) {
      try {
        await deleteDocumentoMutation.mutateAsync({ id });
        toast.success("Deletado!");
        documentosQuery.refetch();
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
            <h1 className="text-3xl font-bold">Documentos</h1>
            <p className="text-slate-600">Organize seus documentos processuais</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Documento</DialogTitle>
                <DialogDescription>Registre um novo documento processual</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nome *</Label>
                  <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger><SelectValue placeholder="Selecione um tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petição">Petição</SelectItem>
                      <SelectItem value="Sentença">Sentença</SelectItem>
                      <SelectItem value="Contrato">Contrato</SelectItem>
                      <SelectItem value="Parecer">Parecer</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Link/URL</Label>
                  <Input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." />
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
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit">Adicionar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {documentos.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-500 mb-4">Nenhum documento cadastrado</p>
              <Button onClick={() => setOpen(true)}>Adicionar Primeiro</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documentos.map(doc => (
              <Card key={doc.id} className="hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold">{doc.nome}</h3>
                      </div>
                      {doc.tipo && <p className="text-sm text-slate-600">Tipo: {doc.tipo}</p>}
                      {doc.data && <p className="text-sm text-slate-600">Data: {new Date(doc.data).toLocaleDateString('pt-BR')}</p>}
                    </div>
                    <div className="flex gap-2">
                      {doc.link && (
                        <Button size="sm" variant="outline" onClick={() => window.open(doc.link!, '_blank')}>
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
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
