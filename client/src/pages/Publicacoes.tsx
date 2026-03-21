import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

export default function Publicacoes() {
  const publicacoesQuery = trpc.publicacao.list.useQuery();
  const publicacoes = publicacoesQuery.data || [];

  const sortedPublicacoes = [...publicacoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Publicações do Diário Oficial</h1>
          <p className="text-slate-600">Acompanhe publicações relacionadas aos seus processos</p>
        </div>

        {sortedPublicacoes.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-500 mb-4">Nenhuma publicação encontrada</p>
              <p className="text-sm text-slate-400">As publicações serão sincronizadas automaticamente da API do CNJ</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedPublicacoes.map(pub => (
              <Card key={pub.id} className="hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold">{pub.diario || "Publicação"}</h3>
                      </div>
                      {pub.descricao && <p className="text-sm text-slate-600 mb-2">{pub.descricao}</p>}
                      <p className="text-sm text-slate-500">Data: {new Date(pub.data).toLocaleDateString('pt-BR')}</p>
                      <p className="text-xs text-slate-400 mt-1">Origem: {pub.origem}</p>
                    </div>
                    {pub.link && (
                      <Button size="sm" variant="outline" onClick={() => window.open(pub.link!, '_blank')}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
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
