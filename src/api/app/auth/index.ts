import Elysia, { status, t } from "elysia";
import bcrypt from "bcrypt";
import db from "../../../db";
import { tokens, users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import mailchecker from "mailchecker";

export default new Elysia({ prefix: "/auth" })
    .post(
        "/login", 
        async ({ body }) => {
            const { email, password } = body;

            if (!mailchecker.isValid(email)) {
                return status(400, { error: "Invalid email address" });
            }

            const user = await db.select().from(users).where(eq(users.email, email)).execute();

            if (user.length === 0) {
                return status(400, { error: "User with this email does not exist" });
            }

            const isPasswordValid = await bcrypt.compare(password, user[0].password);

            if (!isPasswordValid) {
                return status(400, { error: "Invalid password" });
            }

            const bytes = new Uint8Array(48);
            crypto.getRandomValues(bytes);
            const token = btoa(String.fromCharCode(...bytes));

            await db.insert(tokens).values({
                user_id: user[0].id,
                token,
            }).execute();

            return { token };
        },
        {
            detail: {
                hide: true,
            },
            body: t.Object({
                email: t.String(),
                password: t.String(),
            }),
        }
    )
    .post(
        "/register", 
        async ({ body }) => {
            const { email, password } = body;

            if (!mailchecker.isValid(email)) {
                return status(400, { error: "Invalid email address" });
            }

            let user = await db.select().from(users).where(eq(users.email, email)).execute();

            if (user.length > 0) {
                return status(400, { error: "User with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            user = await db.insert(users).values({
                email,
                password: hashedPassword,
            }).returning().execute();

            const bytes = new Uint8Array(48);
            crypto.getRandomValues(bytes);
            const token = btoa(String.fromCharCode(...bytes));

            await db.insert(tokens).values({
                user_id: user[0].id,
                token,
            }).execute();

            return { token };
        },
        {
            detail: {
                hide: true,
            },
            body: t.Object({
                email: t.String(),
                password: t.String(),
            }),
        }
    )
    .get(
        "/verify",
        async ({ headers, status }) => {
            const user = await verifyRequest(headers);

            if (!user) {
                return status(401, { error: "Unauthorized" });
            }

            return { user: { id: user.id, email: user.email } };
        },
        {
            detail: {
                hide: true,
            },
        }
    )

export async function verifyRequest(headers: Record<string, string>) {
    const token = headers.authorization?.split(" ")[1];

    if (!token) {
        return null;
    }

    const tokenData = await db.select().from(tokens).where(eq(tokens.token, token)).execute();

    if (tokenData.length === 0) {
        return null;
    }

    const user = await db.select().from(users).where(eq(users.id, tokenData[0].user_id)).execute();

    if (user.length === 0) {
        return null;
    }

    return user[0];
}