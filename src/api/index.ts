import Elysia from "elysia";
import v1 from "./v1";
import app from "./app";

export default new Elysia({ prefix: "/api" })
    .use(app)
    .use(v1)