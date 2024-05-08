import { Hono } from "hono";
import { z } from 'zod'
import { db } from "@/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from '@hono/zod-validator'
import { createId } from "@paralleldrive/cuid2"
import { categories, insertCategoriesSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";


const app = new Hono()
  .get("/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c)

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ message: "Sem autorização" }, 401)
        })
      }

      const data = await db.select({
        id: categories.id,
        name: categories.name,
      })
        .from(categories)
        .where(eq(categories.userId, auth.userId))

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
        id: categories.id,
        name: categories.name
      })
      .from(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id)
        )
      )

    if (!data) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem dados" }, 404)
      })
    }

    return c.json({ data })
  })
  .post("/", clerkMiddleware(), zValidator("json", insertCategoriesSchema.pick({
    name: true,
  })), async (c) => {
    const auth = getAuth(c)
    const values = c.req.valid("json")

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem autorização" }, 401)
      })
    }

    const [data] = await db.insert(categories).values({
      id: createId(),
      userId: auth.userId,
      ...values,
    }).returning()

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

    const data = await db.delete(categories).where(
      and(
        eq(categories.userId, auth.userId),
        inArray(categories.id, values.ids)
      )
    )
      .returning({
        id: categories.id,
      })

    return c.json({ data })
  })
  .patch('/:id', clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional()
  })), zValidator("json", insertCategoriesSchema.pick({
    name: true
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

    const [data] = await db
      .update(categories)
      .set(values)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id)
        )
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

    const [data] = await db
      .delete(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id)
        )
      )
      .returning({
        id: categories.id
      })

    if (!data) {
      throw new HTTPException(401, {
        res: c.json({ message: "Sem dados" }, 404)
      })
    }

    return c.json({ data })
  })

export default app