import { Elysia, redirect } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { configDotenv } from "dotenv"; configDotenv();

import api from "./api";

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: "PlenAPI",
        version: "1.0.0-dev",
        description: "A free and open-source aviation API for developers",
      },
    }
  }))
  .get("/", () => {
    return redirect("/swagger");
  }, { detail: { hide: true } })
  .use(api)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
