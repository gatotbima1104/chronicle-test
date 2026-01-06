import { NextFunction, Request, Response } from "express";
import { CELERY_API, prisma } from "../../configs/config";
import { IOrder } from "../../interfaces/order.interface";
import { queueOrder } from "../../third-party/redis.config";
import axios from "axios";

export class OrderController {
    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const { items } = req.body as { items: [IOrder]}

            //prepare for celery api
            const order = await prisma.order.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    status: "PROCESSING",
                    totalPrice: 0
                }
            })

            for (const item of items) {
                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.id,
                        quantity: item.quantity,
                        price: 0
                    }
                })
            }

            // Hit Celery Api
            await axios.post(CELERY_API, {
                orderId: order.id
            })

            res.status(201).send({
                message: `Order queued for ${order.id}`,
                data: order.id
            })
            
            // const order = await prisma.$transaction(async (trx) => {
            //     let totalPrice = 0

            //     const order = await trx.order.create({
            //         data: {
            //             user: {
            //                 connect: {
            //                     id: userId
            //                 }
            //             },
            //             totalPrice: 0
            //         }
            //     })
                
            //     for (const item of items) {
            //         const product = await trx.product.findUnique({
            //             where: {
            //                 id: item.id
            //             }
            //         })

            //         if (!product || product.isDeleted) {
            //             throw new Error("PRODUCT_NOT_FOUND");
            //         }

            //         // Atomic decrease to avoid race condition
            //         const updated = await trx.product.updateMany({
            //             where: {
            //                 id: product.id,
            //                 stock: {
            //                     gte: item.quantity
            //                 }
            //             },
            //             data: {
            //                 stock: {
            //                     decrement: item.quantity
            //                 }
            //             }
            //         })

            //         if (updated.count == 0) {
            //             throw new Error("INSUFFICIENT_STOCK");
            //         }

            //         // await trx.product.update({
            //         //     where: {
            //         //         id: product.id
            //         //     },
            //         //     data: {
            //         //         stock: {
            //         //             decrement: item.quantity
            //         //         }
            //         //     }
            //         // })

            //         totalPrice += product.price * item.quantity

            //         // Add to join table
            //         await trx.orderItem.create({
            //             data: {
            //                 orderId: order.id,
            //                 productId: product.id,
            //                 quantity: item.quantity,
            //                 price: product.price
            //             }
            //         })
            //     }

            //     // Update total price
            //     return trx.order.update({
            //         where: {
            //             id: order.id
            //         },
            //         data: {
            //             totalPrice,
            //             status: "PROCESSING"
            //         }
            //     })
            // })

            // await queueOrder(order.id)

            // res.status(201).send({
            //     message: "success",
            //     data: order,
            //     status: `Order queued for ${order.id}`
            // })
        } catch (error) {
            next(error)
        }
    }
}