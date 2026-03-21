import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, advogados, processos, prazos, publicacoes, documentos, transacoes } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Advogado queries
export async function getAdvogadoByUserId(usuarioId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(advogados).where(eq(advogados.usuarioId, usuarioId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAdvogado(data: typeof advogados.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(advogados).values(data);
  return result;
}

export async function updateAdvogado(id: number, data: Partial<typeof advogados.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(advogados).set(data).where(eq(advogados.id, id));
}

// Processo queries
export async function getProcessosByAdvogado(advogadoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(processos).where(eq(processos.advogadoId, advogadoId));
}

export async function createProcesso(data: typeof processos.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(processos).values(data);
  return result;
}

export async function updateProcesso(id: number, data: Partial<typeof processos.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(processos).set(data).where(eq(processos.id, id));
}

export async function deleteProcesso(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(processos).where(eq(processos.id, id));
}

// Prazo queries
export async function getPrazosByAdvogado(advogadoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(prazos).where(eq(prazos.advogadoId, advogadoId));
}

export async function createPrazo(data: typeof prazos.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(prazos).values(data);
  return result;
}

export async function updatePrazo(id: number, data: Partial<typeof prazos.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(prazos).set(data).where(eq(prazos.id, id));
}

// Publicacao queries
export async function getPublicacoesByAdvogado(advogadoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(publicacoes).where(eq(publicacoes.advogadoId, advogadoId));
}

export async function createPublicacao(data: typeof publicacoes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(publicacoes).values(data);
  return result;
}

// Documento queries
export async function getDocumentosByAdvogado(advogadoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documentos).where(eq(documentos.advogadoId, advogadoId));
}

export async function createDocumento(data: typeof documentos.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(documentos).values(data);
  return result;
}

export async function deleteDocumento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(documentos).where(eq(documentos.id, id));
}

// Transacao queries
export async function getTransacoesByAdvogado(advogadoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(transacoes).where(eq(transacoes.advogadoId, advogadoId));
}

export async function createTransacao(data: typeof transacoes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(transacoes).values(data);
  return result;
}

export async function updateTransacao(id: number, data: Partial<typeof transacoes.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(transacoes).set(data).where(eq(transacoes.id, id));
}

export async function deleteTransacao(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(transacoes).where(eq(transacoes.id, id));
}
