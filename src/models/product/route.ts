import { Router } from "express";
import { ProductController } from "./controller";

export const productRouter = () => {
  const router = Router();
  const productController = new ProductController();

  router.post("/", productController.createProduct);
  router.get("/", productController.getListProducts);
  router.get("/:id", productController.getProduct);
  router.patch("/:id", productController.updateProduct);
  router.delete("/:id", productController.deleteProduct);
  return router;
};
