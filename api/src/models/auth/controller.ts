import { NextFunction, Request, Response } from "express";
import { prisma } from "../../configs/config";
import bcrypt from "bcrypt"
import { signToken } from "../../utils/jwt.helper";

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {

            const { email, password, role } = req.body;
            const existEmail = await prisma.user.findUnique({
                where: { email }
            })

            if (existEmail) {
                return res.status(409).send({
                    message: "Email already registered"
                })
            }

            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role
                }
            })

            res.status(201).send({
                message: "success",
                data: newUser
            })
            
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {

            const { email, password } = req.body;
            const existUser = await prisma.user.findUnique({
                where: { email }
            })
            if (!existUser) {
                return res.status(401).send({
                    message: `Email or Password is wrong!`
                })
            }

            const isValidPassword = await bcrypt.compare(password, existUser.password)
            if (!isValidPassword) {
                res.status(401).send({
                    message: "Email or Password is wrong!"
                })
            }

            const token = signToken({
                id: existUser.id,
                email: existUser.email,
                role: existUser.role
            })

            res.status(200).send({
                message: "success",
                token
            })
            
        } catch (error) {
            next(error)
        }
    }
}