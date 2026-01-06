import { Router } from "express";
import { AuthController } from "./controller";

export const authRouter = () => {
  const router = Router();
  const authController = new AuthController();

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  return router;
};
