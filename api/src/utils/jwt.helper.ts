import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/config";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
}

export const signToken = (payload: JwtPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h"
    })
}
