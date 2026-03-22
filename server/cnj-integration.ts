import axios from "axios";

const CNJ_API_URL = "https://www.cnj.jus.br/datajud-api/processos";
const CNJ_API_KEY = "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";

interface CNJProcesso {
  numero?: string;
  numeroProcesso?: string;
  assunto?: string;
  descricao?: string;
  status?: string;
  dataAtualizacao?: string;
  tribunal?: string;
  juiz?: string;
  partes?: Array<{
    nome?: string;
    tipo?: string;
  }>;
}

interface ProcessoFormatado {
  numero: string;
  cliente: string;
  assunto: string;
  status: string;
  tribunal: string;
  juiz: string;
  descricao: string;
  origem: string;
  dataImportacao: Date;
}

/**
 * Busca processos na API do CNJ usando nome do advogado e OAB
 */
export async function buscarProcessosCNJ(
  nomeAdvogado: string,
  oab: string
): Promise<ProcessoFormatado[]> {
  try {
    const query = `${nomeAdvogado} ${oab}`;

    const response = await axios.get(CNJ_API_URL, {
      headers: {
        Authorization: `APIKey ${CNJ_API_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        q: query,
        size: 100,
      },
      timeout: 30000,
    });

    const processos: ProcessoFormatado[] = [];

    if (response.data && response.data.hits && response.data.hits.hits) {
      for (const hit of response.data.hits.hits) {
        const processo = hit._source as CNJProcesso;

        if (
          processo.partes &&
          processo.partes.some(
            (parte) =>
              parte.nome?.toUpperCase().includes(nomeAdvogado.toUpperCase()) ||
              parte.nome?.toUpperCase().includes(oab.toUpperCase())
          )
        ) {
          processos.push({
            numero: processo.numeroProcesso || processo.numero || "",
            cliente: processo.partes?.[0]?.nome || "Desconhecido",
            assunto: processo.assunto || "Sem assunto",
            status: processo.status || "Ativo",
            tribunal: processo.tribunal || "Tribunal não informado",
            juiz: processo.juiz || "Juiz não informado",
            descricao: processo.descricao || "",
            origem: "CNJ - DataJud",
            dataImportacao: new Date(),
          });
        }
      }
    }

    return processos;
  } catch (error) {
    console.error("Erro ao buscar processos na API CNJ:", error);
    throw new Error("Falha ao buscar processos na API do CNJ");
  }
}

/**
 * Busca publicações na API do CNJ usando número do processo
 */
export async function buscarPublicacoesCNJ(
  numeroProcesso: string
): Promise<
  Array<{
    diario: string;
    descricao: string;
    data: Date;
    link: string;
    origem: string;
  }>
> {
  try {
    const response = await axios.get(CNJ_API_URL, {
      headers: {
        Authorization: `APIKey ${CNJ_API_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        q: numeroProcesso,
        size: 50,
      },
      timeout: 30000,
    });

    const publicacoes: Array<{
      diario: string;
      descricao: string;
      data: Date;
      link: string;
      origem: string;
    }> = [];

    if (response.data && response.data.hits && response.data.hits.hits) {
      for (const hit of response.data.hits.hits) {
        const doc = hit._source as any;

        if (doc.movimentacoes && Array.isArray(doc.movimentacoes)) {
          for (const mov of doc.movimentacoes) {
            publicacoes.push({
              diario: mov.diario || "Diário Oficial",
              descricao: mov.descricao || "Movimentação processual",
              data: mov.data ? new Date(mov.data) : new Date(),
              link: mov.link || "",
              origem: "CNJ - DataJud",
            });
          }
        }
      }
    }

    return publicacoes;
  } catch (error) {
    console.error("Erro ao buscar publicações na API CNJ:", error);
    throw new Error("Falha ao buscar publicações na API do CNJ");
  }
}

/**
 * Sincroniza processos do CNJ com o banco de dados
 */
export async function sincronizarProcessosCNJ(
  nomeAdvogado: string,
  oab: string,
  advogadoId: number
): Promise<number> {
  try {
    const processos = await buscarProcessosCNJ(nomeAdvogado, oab);
    console.log(
      `Encontrados ${processos.length} processos para ${nomeAdvogado} (OAB: ${oab})`
    );
    return processos.length;
  } catch (error) {
    console.error("Erro ao sincronizar processos:", error);
    throw error;
  }
}
