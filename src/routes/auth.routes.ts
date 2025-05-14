
//** ELYSIA IMPORT */
import type Elysia from "elysia";

//** SERVICE IMPORTS */
import AuthService from "../auth.services/auth.services";

//** TYPE IMPORTS */
import type { userLoginResponse } from "../auth.services/auth.interface";

//** SCHEMA IMPORTS */
import { authBearerSchema, loginSchema, registerSchema } from "../auth.services/auth.schema";




const Auth = (app: Elysia) => {
    app.post('/api/register/', async ({ body }): Promise<userLoginResponse> => {
        try {
            const authService = new AuthService();

            const output = await authService.register(body)
            return output;

        } catch (error) {
            console.error(error);
            throw error;
        }
      }, registerSchema
    )
    .post('/api/login/', async ({ body }): Promise<userLoginResponse> => {
        try {
            const authService = new AuthService();

            const output = await authService.login(body)
            return output;

        } catch (error) {
            console.error(error);
            throw error;
        }
      }, loginSchema
    )
}

export default Auth;