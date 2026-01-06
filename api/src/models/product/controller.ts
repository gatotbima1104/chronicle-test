import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../configs/config";
import { IProduct } from "../../interfaces/product.interface";
import { redisClient } from "../../third-party/redis.config";

export class ProductController {
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, price, stock } = req.body
            const userId = req.user?.id
            
            const productExist = await prisma.product.findUnique({
                where: { 
                    name, 
                    userId, 
                    isDeleted: false
                }
            })
            if (productExist) {
                return res.status(400).send({
                    message: "Product with this name already exists"
                })
            }

            const data: Prisma.ProductCreateInput = {
                name,
                price,
                stock,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
            const newProduct: IProduct = await prisma.product.create({
                data
            })
            res.status(201).send({
                message: "success",
                data: newProduct
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getListProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const role = req.user?.role
            const data = await prisma.product.findMany({where: { 
                isDeleted: false,
                ...(role !== "USER" && userId ? { userId } : {})
            }})
            res.status(200).send({
                message: "success",
                data
            })
        } catch (error) {
            next(error)
        }
    }
    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const userId = req.user?.id

            // Redisc caching 
            const key = `product:${userId}:${id}`
            const cachedProduct = await redisClient.get(key)
            if (cachedProduct) {
                return res.status(200).send({
                    message: "success (from redis)",
                    data: JSON.parse(cachedProduct)
                })
            }

            // Database working
            const productExist = await prisma.product.findUnique({
                where: { 
                    id,
                    // userId,
                    isDeleted: false
                }
            })
            if (!productExist) {
                return res.status(404).send({
                    message: "Product not found"
                })
            }

            // Set to redis for first time
            await redisClient.set(
                key,
                JSON.stringify(productExist),
                "EX",
                120
            )
            
            res.status(200).send({
                message: "success",
                data: productExist
            })
        } catch (error) {
            next(error)
        }
    }
    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const { name, price, stock } = req.body
            const userId = req.user?.id

            const productExist = await prisma.product.findUnique({
                where: { 
                    id,
                    userId,
                    isDeleted: false
                }
            })
            if (!productExist) {
                return res.status(404).send({
                    message: "Product not found"
                })
            }
            
            const data: Prisma.ProductUpdateInput = {
                name,
                price,
                stock
            }

            const updatedProduct = await prisma.product.update({ data, where: { id } })
            res.status(200).send({
                message: "success",
                data: updatedProduct
            })
        } catch (error) {
            next(error)
        }
    }
    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const userId = req.user?.id
            const productExist = await prisma.product.findUnique({
                where: { 
                    id,
                    userId,
                    isDeleted: false
                }
            })
            if (!productExist) {
                return res.status(404).send({
                    message: "Product not found"
                })
            }
            
            await prisma.product.update({
                where: { id },
                data: { isDeleted: true}
            })

            res.status(200).send({
                message: "product deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}