import { Router } from "express";
import { ProductController } from "./controller";
import { verifyRole, verifyToken } from "../../middlewares/auth.middleware";

export const productRouter = () => {
  const router = Router();
  const productController = new ProductController();

  router.post("/", verifyToken, verifyRole, productController.createProduct);
  router.get("/", verifyToken, productController.getListProducts);
  router.get("/:id", verifyToken, productController.getProduct);
  router.patch("/:id", verifyToken, verifyRole, productController.updateProduct);
  router.delete("/:id", verifyToken, verifyRole, productController.deleteProduct);
  return router;
};
