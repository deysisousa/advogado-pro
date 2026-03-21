import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Advogados
export const advogados = mysqlTable("advogados", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull().unique(),
  oab: varchar("oab", { length: 20 }).notNull().unique(),
  especialidades: text("especialidades"),
  telefone: varchar("telefone", { length: 20 }),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  fotoPerfil: text("fotoPerfil"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Advogado = typeof advogados.$inferSelect;
export type InsertAdvogado = typeof advogados.$inferInsert;

// Tabela de Processos Jurídicos
export const processos = mysqlTable("processos", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 30 }).notNull(),
  cliente: varchar("cliente", { length: 255 }).notNull(),
  assunto: varchar("assunto", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Em andamento"),
  descricao: text("descricao"),
  tribunal: varchar("tribunal", { length: 255 }),
  juiz: varchar("juiz", { length: 255 }),
  dataCadastro: timestamp("dataCadastro").defaultNow().notNull(),
  advogadoId: int("advogadoId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Processo = typeof processos.$inferSelect;
export type InsertProcesso = typeof processos.$inferInsert;

// Tabela de Prazos
export const prazos = mysqlTable("prazos", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  data: date("data").notNull(),
  prioridade: varchar("prioridade", { length: 20 }).default("média"),
  tipo: varchar("tipo", { length: 100 }),
  processoId: int("processoId").notNull(),
  advogadoId: int("advogadoId").notNull(),
  concluido: boolean("concluido").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prazo = typeof prazos.$inferSelect;
export type InsertPrazo = typeof prazos.$inferInsert;

// Tabela de Publicações (do CNJ)
export const publicacoes = mysqlTable("publicacoes", {
  id: int("id").autoincrement().primaryKey(),
  data: date("data").notNull(),
  diario: varchar("diario", { length: 255 }),
  descricao: text("descricao"),
  link: text("link"),
  processoId: int("processoId"),
  advogadoId: int("advogadoId").notNull(),
  origem: varchar("origem", { length: 50 }).default("cnj"),
  idExterno: varchar("idExterno", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Publicacao = typeof publicacoes.$inferSelect;
export type InsertPublicacao = typeof publicacoes.$inferInsert;

// Tabela de Documentos
export const documentos = mysqlTable("documentos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 100 }),
  data: date("data"),
  link: text("link"),
  tamanho: varchar("tamanho", { length: 50 }),
  processoId: int("processoId").notNull(),
  advogadoId: int("advogadoId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Documento = typeof documentos.$inferSelect;
export type InsertDocumento = typeof documentos.$inferInsert;

// Tabela de Transações Financeiras
export const transacoes = mysqlTable("transacoes", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  data: date("data").notNull(),
  categoria: varchar("categoria", { length: 100 }),
  metodo: varchar("metodo", { length: 100 }),
  processoId: int("processoId"),
  advogadoId: int("advogadoId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transacao = typeof transacoes.$inferSelect;
export type InsertTransacao = typeof transacoes.$inferInsert;