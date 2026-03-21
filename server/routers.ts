import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { buscarProcessosCNJ, buscarPublicacoesCNJ } from "./cnj-integration";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Advogado procedures
  advogado: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      const advogado = await db.getAdvogadoByUserId(ctx.user.id);
      return advogado || null;
    }),

    create: protectedProcedure
      .input(z.object({
        oab: z.string().min(1, "OAB é obrigatório"),
        especialidades: z.string().optional(),
        telefone: z.string().optional(),
        endereco: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getAdvogadoByUserId(ctx.user.id);
        if (existing) {
          throw new Error("Advogado já cadastrado para este usuário");
        }
        await db.createAdvogado({
          usuarioId: ctx.user.id,
          oab: input.oab,
          especialidades: input.especialidades || null,
          telefone: input.telefone || null,
          endereco: input.endereco || null,
          cidade: input.cidade || null,
          estado: input.estado || null,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        especialidades: z.string().optional(),
        telefone: z.string().optional(),
        endereco: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        fotoPerfil: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.updateAdvogado(advogado.id, input);
        return { success: true };
      }),
  }),

  // Processo procedures
  processo: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const advogado = await db.getAdvogadoByUserId(ctx.user.id);
      if (!advogado) return [];
      return await db.getProcessosByAdvogado(advogado.id);
    }),

    create: protectedProcedure
      .input(z.object({
        numero: z.string().min(1, "Número do processo é obrigatório"),
        cliente: z.string().min(1, "Cliente é obrigatório"),
        assunto: z.string().min(1, "Assunto é obrigatório"),
        status: z.string().optional(),
        descricao: z.string().optional(),
        tribunal: z.string().optional(),
        juiz: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.createProcesso({
          numero: input.numero,
          cliente: input.cliente,
          assunto: input.assunto,
          status: input.status || "Em andamento",
          descricao: input.descricao || null,
          tribunal: input.tribunal || null,
          juiz: input.juiz || null,
          advogadoId: advogado.id,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        numero: z.string().optional(),
        cliente: z.string().optional(),
        assunto: z.string().optional(),
        status: z.string().optional(),
        descricao: z.string().optional(),
        tribunal: z.string().optional(),
        juiz: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        const { id, ...updateData } = input;
        await db.updateProcesso(id, updateData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.deleteProcesso(input.id);
        return { success: true };
      }),
  }),

  // Prazo procedures
  prazo: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const advogado = await db.getAdvogadoByUserId(ctx.user.id);
      if (!advogado) return [];
      return await db.getPrazosByAdvogado(advogado.id);
    }),

    create: protectedProcedure
      .input(z.object({
        descricao: z.string().min(1, "Descrição é obrigatória"),
        data: z.string().transform(s => new Date(s)),
        prioridade: z.enum(["baixa", "média", "alta"]).optional(),
        tipo: z.string().optional(),
        processoId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.createPrazo({
          descricao: input.descricao,
          data: input.data,
          prioridade: input.prioridade || "média",
          tipo: input.tipo || null,
          processoId: input.processoId,
          advogadoId: advogado.id,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        descricao: z.string().optional(),
        data: z.string().optional(),
        prioridade: z.enum(["baixa", "média", "alta"]).optional(),
        concluido: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        const { id, data, ...updateData } = input;
        const finalData = data ? { ...updateData, data: new Date(data) } : updateData;
        await db.updatePrazo(id, finalData);
        return { success: true };
      }),
  }),

  // Publicacao procedures
  publicacao: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const advogado = await db.getAdvogadoByUserId(ctx.user.id);
      if (!advogado) return [];
      return await db.getPublicacoesByAdvogado(advogado.id);
    }),

    create: protectedProcedure
      .input(z.object({
        data: z.string().transform(s => new Date(s)),
        diario: z.string().optional(),
        descricao: z.string().optional(),
        link: z.string().optional(),
        processoId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.createPublicacao({
          data: input.data,
          diario: input.diario || null,
          descricao: input.descricao || null,
          link: input.link || null,
          processoId: input.processoId || null,
          advogadoId: advogado.id,
        });
        return { success: true };
      }),
  }),

  // Documento procedures
  documento: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const advogado = await db.getAdvogadoByUserId(ctx.user.id);
      if (!advogado) return [];
      return await db.getDocumentosByAdvogado(advogado.id);
    }),

    create: protectedProcedure
      .input(z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        tipo: z.string().optional(),
        data: z.string().optional(),
        link: z.string().optional(),
        tamanho: z.string().optional(),
        processoId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.createDocumento({
          nome: input.nome,
          tipo: input.tipo || null,
          data: input.data ? new Date(input.data) : null,
          link: input.link || null,
          tamanho: input.tamanho || null,
          processoId: input.processoId,
          advogadoId: advogado.id,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.deleteDocumento(input.id);
        return { success: true };
      }),
  }),

  // Transacao procedures
  transacao: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const advogado = await db.getAdvogadoByUserId(ctx.user.id);
      if (!advogado) return [];
      return await db.getTransacoesByAdvogado(advogado.id);
    }),

    create: protectedProcedure
      .input(z.object({
        descricao: z.string().min(1, "Descrição é obrigatória"),
        valor: z.number().positive("Valor deve ser positivo"),
        tipo: z.enum(["receita", "despesa"]),
        data: z.string().transform(s => new Date(s)),
        categoria: z.string().optional(),
        metodo: z.string().optional(),
        processoId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.createTransacao({
          descricao: input.descricao,
          valor: input.valor.toString(),
          tipo: input.tipo,
          data: input.data,
          categoria: input.categoria || null,
          metodo: input.metodo || null,
          processoId: input.processoId || null,
          advogadoId: advogado.id,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        descricao: z.string().optional(),
        valor: z.number().optional(),
        tipo: z.enum(["receita", "despesa"]).optional(),
        data: z.string().optional(),
        categoria: z.string().optional(),
        metodo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        const { id, data, valor, ...updateData } = input;
        const finalData = {
          ...updateData,
          ...(data && { data: new Date(data) }),
          ...(valor !== undefined && { valor: valor.toString() }),
        };
        await db.updateTransacao(id, finalData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        await db.deleteTransacao(input.id);
        return { success: true };
      }),
  }),

  // CNJ Integration procedures
  cnj: router({
    buscarProcessos: protectedProcedure
      .mutation(async ({ ctx }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }
        if (!advogado.oab || !ctx.user.name) {
          throw new Error("OAB e nome do advogado são obrigatórios");
        }

        try {
          const processos = await buscarProcessosCNJ(ctx.user.name, advogado.oab);
          
          // Salvar processos encontrados no banco de dados
          for (const processo of processos) {
            await db.createProcesso({
              numero: processo.numero,
              cliente: processo.cliente,
              assunto: processo.assunto,
              status: processo.status,
              tribunal: processo.tribunal,
              juiz: processo.juiz,
              descricao: processo.descricao,
              advogadoId: advogado.id,
            });
          }

          return {
            sucesso: true,
            totalProcessos: processos.length,
            processos: processos,
          };
        } catch (error) {
          console.error("Erro ao buscar processos CNJ:", error);
          throw new Error("Erro ao buscar processos na API do CNJ");
        }
      }),

    buscarPublicacoes: protectedProcedure
      .input(z.object({ numeroProcesso: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const advogado = await db.getAdvogadoByUserId(ctx.user.id);
        if (!advogado) {
          throw new Error("Advogado não encontrado");
        }

        try {
          const publicacoes = await buscarPublicacoesCNJ(input.numeroProcesso);
          
          // Salvar publicações no banco de dados
          for (const pub of publicacoes) {
            await db.createPublicacao({
              diario: pub.diario,
              descricao: pub.descricao,
              data: pub.data,
              link: pub.link,
              origem: pub.origem,
              advogadoId: advogado.id,
            });
          }

          return {
            sucesso: true,
            totalPublicacoes: publicacoes.length,
            publicacoes: publicacoes,
          };
        } catch (error) {
          console.error("Erro ao buscar publicações CNJ:", error);
          throw new Error("Erro ao buscar publicações na API do CNJ");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
Sistema para Advogados com GitHub e API do CNJ - Manus
