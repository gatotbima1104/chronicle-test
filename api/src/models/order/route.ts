import { Router } from "express";
import { OrderController } from "./controller";
import { verifyToken } from "../../middlewares/auth.middleware";

export const orderRouter = () => {
  const router = Router();
  const orderController = new OrderController();

  router.post("/", verifyToken, orderController.createOrder)
  
  return router;
};
