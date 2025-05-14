//* ELYSIA
import Elysia from "elysia";
import routes from "./routes";



// Initialize Elysia app
const app = new Elysia({
  serve: {
    idleTimeout: 60
  }
})

//@ts-ignore
routes(app)
export default app