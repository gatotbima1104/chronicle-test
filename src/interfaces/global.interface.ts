import { IUserLogin } from "./auth.interface";

declare global {
    namespace Express {
        export interface Request {
            user?: IUserLogin
        }
    }
}