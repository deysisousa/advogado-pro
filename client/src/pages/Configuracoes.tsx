import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const advogadoQuery = trpc.advogado.me.useQuery();
  const createAdvogadoMutation = trpc.advogado.create.useMutation();
  const updateAdvogadoMutation = trpc.advogado.update.useMutation();

  const [formData, setFormData] = useState({
    oab: "",
    especialidades: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
  });

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (advogadoQuery.data) {
      setFormData({
        oab: advogadoQuery.data.oab || "",
        especialidades: advogadoQuery.data.especialidades || "",
        telefone: advogadoQuery.data.telefone || "",
        endereco: advogadoQuery.data.endereco || "",
        cidade: advogadoQuery.data.cidade || "",
        estado: advogadoQuery.data.estado || "",
      });
      setIsCreating(false);
    } else if (!advogadoQuery.isLoading) {
      setIsCreating(true);
    }
  }, [advogadoQuery.data, advogadoQuery.isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreating) {
        await createAdvogadoMutation.mutateAsync({
          oab: formData.oab,
          especialidades: formData.especialidades || undefined,
          telefone: formData.telefone || undefined,
          endereco: formData.endereco || undefined,
          cidade: formData.cidade || undefined,
          estado: formData.estado || undefined,
        });
        toast.success("Perfil criado com sucesso!");
      } else {
        await updateAdvogadoMutation.mutateAsync({
          especialidades: formData.especialidades || undefined,
          telefone: formData.telefone || undefined,
          endereco: formData.endereco || undefined,
          cidade: formData.cidade || undefined,
          estado: formData.estado || undefined,
        });
        toast.success("Perfil atualizado com sucesso!");
      }
      advogadoQuery.refetch();
    } catch (error) {
      toast.error("Erro ao salvar perfil");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-slate-600">Gerencie seu perfil profissional</p>
        </div>

        {/* Informações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Dados da sua conta Manus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input value={user?.name || ""} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <Button variant="outline" onClick={() => logout()}>
              Fazer Logout
            </Button>
          </CardContent>
        </Card>

        {/* Perfil Profissional */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil Profissional</CardTitle>
            <CardDescription>Informações sobre sua atuação jurídica</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="oab">OAB {isCreating ? "*" : ""}</Label>
                <Input
                  id="oab"
                  value={formData.oab}
                  onChange={(e) => setFormData({ ...formData, oab: e.target.value })}
                  placeholder="Ex: 123456/SP"
                  disabled={!isCreating}
                  required={isCreating}
                />
              </div>

              <div>
                <Label htmlFor="especialidades">Especialidades</Label>
                <Textarea
                  id="especialidades"
                  value={formData.especialidades}
                  onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                  placeholder="Ex: Direito Civil, Direito Trabalhista"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="Ex: (11) 9999-9999"
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    placeholder="Ex: SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {isCreating ? "Criar Perfil" : "Atualizar Perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p><strong>Versão:</strong> 1.0.0</p>
            <p><strong>Integração CNJ:</strong> API DataJud ativa</p>
            <p><strong>Última sincronização:</strong> Hoje</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
