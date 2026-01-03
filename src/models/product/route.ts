
import { Router } from "express"
import { ProductController } from "./controller"

export const productRouter = () => {
    const router = Router()
    const productController = new ProductController()
}