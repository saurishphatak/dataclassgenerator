import express, { Express, NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { CsharpAPIMainV1 } from "../CsharpAPIMainV1";
import { Logger } from "../Utils/Logger";
import { environment } from "../environment";

// let debug = !environment.production ? console.log : () => { };
// environment.production ? Logger.toggleDebug() : () => { };

@Logger.log
export class App {
    protected className = "App";

    public app = express();
    public port = process.env.PORT || 3000;

    public constructor() {
    }

    // Dummy get endpoint
    async dummyGet(request: Request, response: Response, next: NextFunction) {
        let functionName = "dummyGet()";

        Logger.debug(`${this.className}::${functionName}`);

        response.status(200).json({ name: "Dummy Node" });
    }

    // Gets the class description object
    @Logger.call()
    async generateCsharpClass(request: Request, response: Response, next: NextFunction) {
        let functionName = "generateCsharpClass()";

        let dataClassDescription = request.body;

        Logger.debug(`${this.className}::${functionName}`, { dataClassDescription });

        try {
            let main = new CsharpAPIMainV1();

            main.classDescriptions = [dataClassDescription];

            let result = (await main.generate()).result;

            Logger.debug(`${this.className}::${functionName}`, { result });

            response.json(result);
        }
        catch (e: any) {
            // Logger.error(`${this.className}::${functionName}`, [{ e }])
            console.log(e);

            response.status(500).send(undefined);
        }
    }

    // Sets up app middleware
    @Logger.call()
    setupAppMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    // Sets up router middleware
    @Logger.call()
    setupRouterMiddleware() {
        this.app.get("/", this.dummyGet.bind(this));
        this.app.post("/csharp", this.generateCsharpClass.bind(this));
    }

    // Starts the web server
    @Logger.call()
    public run() {
        Logger.debug(`${this.className}::run()`);

        this.setupAppMiddleware();

        this.setupRouterMiddleware();

        this.app.listen(this.port, () => {
            Logger.info(`${this.className} running on PORT `, [this.port]);
        });

        return this.app;
    }
}

