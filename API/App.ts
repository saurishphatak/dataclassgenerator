import express, { Express, NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { CsharpAPIMainV1 } from "../typescript/CsharpAPIMainV1";
import { Logger } from "../typescript/Utils/Logger";
import { environment } from "../typescript/environment";

let debug = !environment.production ? console.log : () => { };

@Logger.log
export class App {
    protected className = "App";

    public app = express();
    public port = process.env.PORT ?? 3000;

    public constructor() {
        debug(`${this.className}::constructor()`);
    }

    // Dummy get endpoint
    async dummyGet(request: Request, response: Response, next: NextFunction) {
        let functionName = "dummyGet()";

        debug(`${this.className}::${functionName}`);

        response.status(200).json({ name: "Dummy Node" });
    }

    // Gets the class description object
    @Logger.call()
    async generateCsharpClass(request: Request, response: Response, next: NextFunction) {
        let functionName = "generateCsharpClass()";

        let dataClassDescription = request.body;

        debug(`${this.className}::${functionName}`, { dataClassDescription });

        try {
            let main = new CsharpAPIMainV1();

            main.classDescriptions = [dataClassDescription];

            let result = (await main.generate()).result;

            debug(`${this.className}::${functionName}`, { result });

            response.json(result);
        }
        catch (e: any) {
            Logger.error(`${this.className}::${functionName}`, [{ message: e?.message }])

            response.status(500).send(undefined);
        }
    }

    // Sets up app middleware
    setupAppMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    // Sets up router middleware
    setupRouterMiddleware() {
        // this.app.get("/", this.dummyGet.bind(this));
        this.app.post("/csharp", this.generateCsharpClass.bind(this));
    }

    // Starts the web server
    public run() {
        this.setupAppMiddleware();

        this.setupRouterMiddleware();

        this.app.listen(this.port, () => {
            debug(`${this.className} running on PORT : ${this.port}`);
        });

        return this.app;
    }
}

let app = new App();
app.run();


