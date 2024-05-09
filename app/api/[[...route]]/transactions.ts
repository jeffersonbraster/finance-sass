import { Hono } from "hono";
import { z } from 'zod'
import { db } from "@/db/drizzle";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { zValidator } from '@hono/zod-validator'
import { createId } from "@paralleldrive/cuid2"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { accounts, categories, insertCategoriesSchema, insertTransactionsSchema, transactions } from "@/db/schema";
import { parse, subDays } from 'date-fns'


const app = new Hono()
  .get("/",
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)
      const { from, to, accountId } = c.req.valid("query")

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ message: "Sem autorização" }, 401)
        })
      }

      const defaultTo = new Date()
      const defaultFrom = subDays(defaultTo, 30)

      const startDate = from ? parse(from, "dd-MM-yyyy", new Date()) : defaultFrom
      const endDate = to ? parse(to, "dd-MM-yyyy", new Date()) : defaultTo

      const data = await db.select({
        id: transactions.id,
        date: transactions.date,
        category: categories.name,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        account: accounts.name,
        accountId: transactions.accountId,
      })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date))

      return c.json({ data })
    })
  .get('/:id', clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional()
  })), async (c) => {
    const auth = getAuth(c)
    const { id } = c.req.valid("param")

    if (!id) {
      throw new HTTPException(400, {
        res: c.json({ message: "Sem id" }, 400)
      })
    }

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const [data] = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        account: accounts.name,
        accountId: transactions.accountId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        )
      )

    if (!data) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem dados" }, 404)
      })
    }

    return c.json({ data })
  })
  .post("/", clerkMiddleware(), zValidator("json", insertTransactionsSchema.omit({
    id: true,
  })), async (c) => {
    const auth = getAuth(c)
    const values = c.req.valid("json")

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const [data] = await db.insert(transactions).values({
      id: createId(),
      ...values,
    }).returning()

    return c.json({ data })
  })
  .post("/bulk-create", clerkMiddleware(), zValidator("json", z.array(insertTransactionsSchema.omit({
    id: true
  }))), async (c) => {
    const auth = getAuth(c)
    const values = c.req.valid("json")

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const data = await db
      .insert(transactions)
      .values(
        values.map((value) => ({
          id: createId(),
          ...value
        }))
      )
      .returning()

    return c.json({ data })
  })
  .post("/bulk-delete", clerkMiddleware(), zValidator("json", z.object({
    ids: z.array(z.string())
  })), async (c) => {
    const auth = getAuth(c)
    const values = c.req.valid("json")

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            inArray(transactions.id, values.ids),
            eq(accounts.userId, auth.userId)
          )
        )
    )

    const data = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
      )
      .returning({
        id: transactions.id
      })

    return c.json({ data })
  })
  .patch('/:id', clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional()
  })), zValidator("json", insertTransactionsSchema.omit({
    id: true
  })), async (c) => {
    const auth = getAuth(c)
    const { id } = c.req.valid("param")
    const values = c.req.valid("json")

    if (!id) {
      throw new HTTPException(400, {
        res: c.json({ message: "Sem id" }, 400)
      })
    }

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const transactionsToUpdate = db.$with("transactions_to_update").as(
      db.select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId)
          )
        )
    )

    const [data] = await db
      .with(transactionsToUpdate)
      .update(transactions)
      .set(values)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
      )
      .returning()

    if (!data) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem dados" }, 404)
      })
    }

    return c.json({ data })
  })
  .delete('/:id', clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional()
  })), async (c) => {
    const auth = getAuth(c)
    const { id } = c.req.valid("param")

    if (!id) {
      throw new HTTPException(400, {
        res: c.json({ message: "Sem id" }, 400)
      })
    }

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db.select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId)
          )
        )
    )

    const [data] = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
      )
      .returning({
        id: transactions.id
      })

    if (!data) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem dados" }, 404)
      })
    }

    return c.json({ data })
  })

export default app