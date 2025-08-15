import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { v1 } from "./api/v1";

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
  .use(v1)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
