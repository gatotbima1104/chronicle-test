import { NextFunction, Request, Response } from "express";

export class ProductController {
    async createProduct(req: Request, res: Response, next: NextFunction) {}
    async getProduct(req: Request, res: Response, next: NextFunction) {}
    async getListProducts(req: Request, res: Response, next: NextFunction) {}
    async updateProduct(req: Request, res: Response, next: NextFunction) {}
    async deleteProduct(req: Request, res: Response, next: NextFunction) {}
}