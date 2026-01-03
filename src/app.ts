import express, { NextFunction, Request, Response } from "express";
import { Application } from "express";
import cors from "cors";
import { PORT } from "./configs/config";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.configure();
        this.routes();
        this.handleError();
    }

    public get instance(): Application {
        return this.app;
    }

    private configure() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: "Content-Type,Authorization",
        }))
    }

    private routes() {}

    private handleError() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send("Route not found");
        })

        this.app.use((error: Error,req: Request, res: Response, next: NextFunction) => {
            res.status(500).send({
                message: error.message || "Internal Server Error"
            });
        })
    }

    start() {
        this.app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        })
    }
}