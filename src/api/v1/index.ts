import Elysia from "elysia";

export const v1 = new Elysia({ prefix: "/api/v1" })
    .group("", (app) => {
        return app
            .get("", () => "OK", { detail: { tags: ["General"] } })
    });