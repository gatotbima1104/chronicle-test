import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../configs/config";
import { IUserLogin } from "../interfaces/auth.interface";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { authorization } = req.headers
        const token = authorization?.split("Bearer ")[1]

        const decodedToken = verify(token as string, JWT_SECRET) as {
            id: string
            email: string
            role: string
        }

        if (!decodedToken) throw new Error("Unauthorized")
        req.user = decodedToken as IUserLogin
        next()
        
    } catch (error) {
        next(error)
    }
}

export const verifyRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    const { authorization } = req.headers
    const token = authorization?.split("Bearer ")[1]

    const decodedToken = verify(token as string, JWT_SECRET) as { role: string }        
    if (decodedToken.role === "USER") {
        throw new Error ("The resources are not allowed!")
    }
    next()

    } catch (error) {
        next(error)
    }
}