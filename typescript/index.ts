import { App } from "./API/App";

// !environment.production ? Logger.toggleDebug() : () => { };

// Start the API server
let app = new App();
app.run();