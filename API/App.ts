import express, { Express, NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";

let debug = console.log;

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
    async generateClass(request: Request, response: Response, next: NextFunction) {
        let functionName = "generateClass()";

        let field = request.body;

        debug(`${this.className}::${functionName}`, field);

        response.status(200).send(field);
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
        this.app.post("/", this.generateClass.bind(this));
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


