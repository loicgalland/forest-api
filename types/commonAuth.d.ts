import {AuthPayload} from "../dto";

declare global {
    namespace Express {
        export interface Request {
            user?: AuthPayload
        }
    }
}