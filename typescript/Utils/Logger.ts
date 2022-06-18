const chalk = require("chalk");

export class Logger {
    // Whether to show 'INFO'
    private static showInfo: boolean = true;

    // Whether to show 'WARNING'
    private static showWarning: boolean = true;

    // Whether to show 'ERROR'
    private static showError: boolean = true;

    // Whether to show params
    private static showParams: boolean = true;

    // Whether to enable all 
    private static enableAll: boolean = true;

    // Method Decorator
    public static call() {
        // This function will be executed just once
        return (
            target: any,
            propertyKey: string,
            propertyDescripter: PropertyDescriptor
        ) => {
            // Preserve the original function definition
            const originalMethod: Function = propertyDescripter.value;

            // Modify the old function now
            // Give a new function that accepts any argument
            // and print those arguments
            propertyDescripter.value = function (...varargs: any[]) {
                let newArguments: any[] = [];

                // If the varargs have a function, simply capture its name 
                varargs.forEach(param => {
                    typeof param == 'function' ? (param.name == '' ? newArguments.push('anonymous()') : newArguments.push(`${param.name}()`)) : (newArguments.push(param))
                });

                // This is the new thing that the original function will execute first
                Logger.info(`${target.constructor.name}::${propertyKey}()`, newArguments);

                // Now call original function definition
                return originalMethod.apply(this, varargs);
            }

            // Return the propertyDescriptor
            return propertyDescripter;
        }
    }

    // Class Decorator
    public static log(targetClassConstructor: Function) {
        Logger.info(`${targetClassConstructor.name}:: constructor()`, []);
    }

    // Decides whether to print info
    public static info(message: string, parameters: any[]) {
        // If the enableAll and showInfo is true
        Logger.enableAll && Logger.showInfo && Logger.message(`${chalk.green.bold('[INFO] ')} ${Logger.time()} ${chalk.blue(message)} ${parameters.length > 0 ? Logger.params(parameters) : ''}`);
    }

    // Prints the given message
    public static message(messageToPrint: string) {
        console.log(messageToPrint);
    }

    // Decides whether to print params
    private static params(parameters: any[]): string {
        return Logger.enableAll ? Logger.showParams ? `Params[${[...parameters]}]` : `` : ``;
    }

    // Returns the time
    private static time(): string {
        const pad = (num: number) => num.toString().padStart(2, "0");

        // Current Date
        let dO: Date = new Date();

        return `[${pad(dO.getHours())}: ${pad(dO.getMinutes())}: ${pad(dO.getMilliseconds())}]`
    }

    // Decides whether to print warning
    public static warn(message: string) {
        // If enableAll and showWarning are true
        if (Logger.enableAll && Logger.showWarning)
            Logger.message(`${chalk.yellowBright.bold('[WARN] ')} ${Logger.time()} ${chalk.yellowBright(message)} `);

        else
            Logger.message(`${chalk.yellowBright('Warning messages are not ON!')} ${chalk.yellowBright.bold('-> Call toggleWarn() method to enable them.')} `);
    }

    // Decides whether to print error
    public static error(message: string, parameters: any[]) {
        if (Logger.enableAll && Logger.showError) {
            Logger.message(`${chalk.redBright.bold('[ERROR]')} ${Logger.time()} ${chalk.redBright(message)} : ${[...parameters]} `);

            // Throw a new error
            throw new Error("");
        }

        else
            Logger.message(`${chalk.redBright('Error messages are not ON!')} ${chalk.redBright.bold('-> Call toggleError() method to enable them.')} `)
    }

    // Toggles showWarning
    public static toggleWarning() {
        Logger.showWarning = !Logger.showWarning;
    }

    // Toggles showError
    public static toggleError() {
        Logger.showError = !Logger.showError;
    }

    // Toggles showParams
    public static toggleParams() {
        Logger.showParams = !Logger.showParams;
    }

    // Toggles showInfo
    public static toggleInfo() {
        Logger.showInfo = !Logger.showInfo;
    }

    // Toggles enableAll
    public static toggleAll() {
        Logger.enableAll = !Logger.enableAll;
    }

}

